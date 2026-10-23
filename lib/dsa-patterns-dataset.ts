// Comprehensive dataset of all 59 DSA Patterns & 300 Curated Problems
// Exact 1:1 match with Algomaster practice dataset

export interface PatternProblem {
  id: string;
  slug: string;
  title: string;
  href?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: number; // 1 to 5
  leetcodeUrl: string;
  solutionUrl?: string;
  videoUrl?: string;
  notesUrl?: string;
  lists: ('am_75' | 'am_150' | 'am_300' | 'am_600')[];
}

export interface PatternCategory {
  category: string;
  slug: string;
  learnUrl?: string | null;
  countText?: string;
  problems: PatternProblem[];
}

export const DSA_PATTERNS: PatternCategory[] = [
  {
    "category": "Arrays",
    "countText": "",
    "learnUrl": "/learn/dsa/arrays-introduction",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 5,
        "href": "/practice/dsa/move-zeroes?list=am-300",
        "id": "move-zeroes",
        "leetcodeUrl": "https://leetcode.com/problems/move-zeroes",
        "notesUrl": "",
        "slug": "move-zeroes",
        "solutionUrl": "/learn/dsa/move-zeroes",
        "title": "Move Zeroes",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 5,
        "href": "/practice/dsa/majority-element?list=am-300",
        "id": "majority-element",
        "leetcodeUrl": "https://leetcode.com/problems/majority-element",
        "notesUrl": "",
        "slug": "majority-element",
        "solutionUrl": "/learn/dsa/majority-element",
        "title": "Majority Element",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 5,
        "href": "/practice/dsa/remove-duplicates-from-sorted-array?list=am-300",
        "id": "remove-duplicates-from-sorted-array",
        "leetcodeUrl": "https://leetcode.com/problems/remove-duplicates-from-sorted-array",
        "notesUrl": "",
        "slug": "remove-duplicates-from-sorted-array",
        "solutionUrl": "/learn/dsa/remove-duplicates-from-sorted-array",
        "title": "Remove Duplicates from Sorted Array",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 5,
        "href": "/practice/dsa/best-time-to-buy-and-sell-stock?list=am-300",
        "id": "best-time-to-buy-and-sell-stock",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock",
        "notesUrl": "",
        "slug": "best-time-to-buy-and-sell-stock",
        "solutionUrl": "/learn/dsa/best-time-to-buy-and-sell-stock",
        "title": "Best Time to Buy and Sell Stock",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/rotate-array?list=am-300",
        "id": "rotate-array",
        "leetcodeUrl": "https://leetcode.com/problems/rotate-array",
        "notesUrl": "",
        "slug": "rotate-array",
        "solutionUrl": "/learn/dsa/rotate-array",
        "title": "Rotate Array",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/product-of-array-except-self?list=am-300",
        "id": "product-of-array-except-self",
        "leetcodeUrl": "https://leetcode.com/problems/product-of-array-except-self",
        "notesUrl": "",
        "slug": "product-of-array-except-self",
        "solutionUrl": "/learn/dsa/product-of-array-except-self",
        "title": "Product of Array Except Self",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/best-time-to-buy-and-sell-stock-ii?list=am-300",
        "id": "best-time-to-buy-and-sell-stock-ii",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii",
        "notesUrl": "",
        "slug": "best-time-to-buy-and-sell-stock-ii",
        "solutionUrl": "/learn/dsa/best-time-to-buy-and-sell-stock-ii",
        "title": "Best Time to Buy and Sell Stock II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 1,
        "href": "/practice/dsa/number-of-zero-filled-subarrays?list=am-300",
        "id": "number-of-zero-filled-subarrays",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-zero-filled-subarrays",
        "notesUrl": "",
        "slug": "number-of-zero-filled-subarrays",
        "solutionUrl": "/learn/dsa/number-of-zero-filled-subarrays",
        "title": "Number of Zero-Filled Subarrays",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/increasing-triplet-subsequence?list=am-300",
        "id": "increasing-triplet-subsequence",
        "leetcodeUrl": "https://leetcode.com/problems/increasing-triplet-subsequence",
        "notesUrl": "",
        "slug": "increasing-triplet-subsequence",
        "solutionUrl": "/learn/dsa/increasing-triplet-subsequence",
        "title": "Increasing Triplet Subsequence",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/first-missing-positive?list=am-300",
        "id": "first-missing-positive",
        "leetcodeUrl": "https://leetcode.com/problems/first-missing-positive",
        "notesUrl": "",
        "slug": "first-missing-positive",
        "solutionUrl": "/learn/dsa/first-missing-positive",
        "title": "First Missing Positive",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "arrays"
  },
  {
    "category": "Strings",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=yMkFYxrDL2M",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/is-subsequence?list=am-300",
        "id": "is-subsequence",
        "leetcodeUrl": "https://leetcode.com/problems/is-subsequence",
        "notesUrl": "",
        "slug": "is-subsequence",
        "solutionUrl": "/learn/dsa/is-subsequence",
        "title": "Is Subsequence",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 5,
        "href": "/practice/dsa/valid-palindrome?list=am-300",
        "id": "valid-palindrome",
        "leetcodeUrl": "https://leetcode.com/problems/valid-palindrome",
        "notesUrl": "",
        "slug": "valid-palindrome",
        "solutionUrl": "/learn/dsa/valid-palindrome",
        "title": "Valid Palindrome",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 5,
        "href": "/practice/dsa/longest-common-prefix?list=am-300",
        "id": "longest-common-prefix",
        "leetcodeUrl": "https://leetcode.com/problems/longest-common-prefix",
        "notesUrl": "",
        "slug": "longest-common-prefix",
        "solutionUrl": "/learn/dsa/longest-common-prefix",
        "title": "Longest Common Prefix",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/zigzag-conversion?list=am-300",
        "id": "zigzag-conversion",
        "leetcodeUrl": "https://leetcode.com/problems/zigzag-conversion",
        "notesUrl": "",
        "slug": "zigzag-conversion",
        "solutionUrl": "/learn/dsa/zigzag-conversion",
        "title": "Zigzag Conversion",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/reverse-words-in-a-string?list=am-300",
        "id": "reverse-words-in-a-string",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-words-in-a-string",
        "notesUrl": "",
        "slug": "reverse-words-in-a-string",
        "solutionUrl": "/learn/dsa/reverse-words-in-a-string",
        "title": "Reverse Words in a String",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "https://leetcode.com/problems/guess-the-word",
        "id": "guess-the-word",
        "leetcodeUrl": "https://leetcode.com/problems/guess-the-word",
        "notesUrl": "",
        "slug": "guess-the-word",
        "solutionUrl": "/learn/dsa/guess-the-word",
        "title": "Guess the Word",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "strings"
  },
  {
    "category": "Bit Manipulation",
    "countText": "",
    "learnUrl": "/learn/dsa/bit-manipulation-introduction",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/single-number?list=am-300",
        "id": "single-number",
        "leetcodeUrl": "https://leetcode.com/problems/single-number",
        "notesUrl": "",
        "slug": "single-number",
        "solutionUrl": "/learn/dsa/single-number",
        "title": "Single Number",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/number-of-1-bits?list=am-300",
        "id": "number-of-1-bits",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-1-bits",
        "notesUrl": "",
        "slug": "number-of-1-bits",
        "solutionUrl": "/learn/dsa/number-of-1-bits",
        "title": "Number of 1 Bits",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/counting-bits?list=am-300",
        "id": "counting-bits",
        "leetcodeUrl": "https://leetcode.com/problems/counting-bits",
        "notesUrl": "",
        "slug": "counting-bits",
        "solutionUrl": "/learn/dsa/counting-bits",
        "title": "Counting Bits",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/reverse-bits?list=am-300",
        "id": "reverse-bits",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-bits",
        "notesUrl": "",
        "slug": "reverse-bits",
        "solutionUrl": "/learn/dsa/reverse-bits",
        "title": "Reverse Bits",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 2,
        "href": "/practice/dsa/bitwise-and-of-numbers-range?list=am-300",
        "id": "bitwise-and-of-numbers-range",
        "leetcodeUrl": "https://leetcode.com/problems/bitwise-and-of-numbers-range",
        "notesUrl": "",
        "slug": "bitwise-and-of-numbers-range",
        "solutionUrl": "/learn/dsa/bitwise-and-of-numbers-range",
        "title": "Bitwise AND of Numbers Range",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 2,
        "href": "/practice/dsa/single-number-iii?list=am-300",
        "id": "single-number-iii",
        "leetcodeUrl": "https://leetcode.com/problems/single-number-iii",
        "notesUrl": "",
        "slug": "single-number-iii",
        "solutionUrl": "/learn/dsa/single-number-iii",
        "title": "Single Number III",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/sum-of-two-integers?list=am-300",
        "id": "sum-of-two-integers",
        "leetcodeUrl": "https://leetcode.com/problems/sum-of-two-integers",
        "notesUrl": "",
        "slug": "sum-of-two-integers",
        "solutionUrl": "/learn/dsa/sum-of-two-integers",
        "title": "Sum of Two Integers",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      }
    ],
    "slug": "bit-manipulation"
  },
  {
    "category": "Hash Tables",
    "countText": "",
    "learnUrl": "/learn/dsa/hash-tables-introduction",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/design-hashmap?list=am-300",
        "id": "design-hashmap",
        "leetcodeUrl": "https://leetcode.com/problems/design-hashmap",
        "notesUrl": "",
        "slug": "design-hashmap",
        "solutionUrl": "/learn/dsa/design-hashmap",
        "title": "Design HashMap",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 1,
        "href": "/practice/dsa/maximum-number-of-balloons?list=am-300",
        "id": "maximum-number-of-balloons",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-number-of-balloons",
        "notesUrl": "",
        "slug": "maximum-number-of-balloons",
        "solutionUrl": "/learn/dsa/maximum-number-of-balloons",
        "title": "Maximum Number of Balloons",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/number-of-good-pairs?list=am-300",
        "id": "number-of-good-pairs",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-good-pairs",
        "notesUrl": "",
        "slug": "number-of-good-pairs",
        "solutionUrl": "/learn/dsa/number-of-good-pairs",
        "title": "Number of Good Pairs",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/isomorphic-strings?list=am-300",
        "id": "isomorphic-strings",
        "leetcodeUrl": "https://leetcode.com/problems/isomorphic-strings",
        "notesUrl": "",
        "slug": "isomorphic-strings",
        "solutionUrl": "/learn/dsa/isomorphic-strings",
        "title": "Isomorphic Strings",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/ransom-note?list=am-300",
        "id": "ransom-note",
        "leetcodeUrl": "https://leetcode.com/problems/ransom-note",
        "notesUrl": "",
        "slug": "ransom-note",
        "solutionUrl": "/learn/dsa/ransom-note",
        "title": "Ransom Note",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/contains-duplicate-ii?list=am-300",
        "id": "contains-duplicate-ii",
        "leetcodeUrl": "https://leetcode.com/problems/contains-duplicate-ii",
        "notesUrl": "",
        "slug": "contains-duplicate-ii",
        "solutionUrl": "/learn/dsa/contains-duplicate-ii",
        "title": "Contains Duplicate II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/group-anagrams?list=am-300",
        "id": "group-anagrams",
        "leetcodeUrl": "https://leetcode.com/problems/group-anagrams",
        "notesUrl": "",
        "slug": "group-anagrams",
        "solutionUrl": "/learn/dsa/group-anagrams",
        "title": "Group Anagrams",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/encode-and-decode-tinyurl?list=am-300",
        "id": "encode-and-decode-tinyurl",
        "leetcodeUrl": "https://leetcode.com/problems/encode-and-decode-tinyurl",
        "notesUrl": "",
        "slug": "encode-and-decode-tinyurl",
        "solutionUrl": "/learn/dsa/encode-and-decode-tinyurl",
        "title": "Encode and Decode TinyURL",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/reorganize-string?list=am-300",
        "id": "reorganize-string",
        "leetcodeUrl": "https://leetcode.com/problems/reorganize-string",
        "notesUrl": "",
        "slug": "reorganize-string",
        "solutionUrl": "/learn/dsa/reorganize-string",
        "title": "Reorganize String",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/longest-consecutive-sequence?list=am-300",
        "id": "longest-consecutive-sequence",
        "leetcodeUrl": "https://leetcode.com/problems/longest-consecutive-sequence",
        "notesUrl": "",
        "slug": "longest-consecutive-sequence",
        "solutionUrl": "/learn/dsa/longest-consecutive-sequence",
        "title": "Longest Consecutive Sequence",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 1,
        "href": "/practice/dsa/split-array-into-consecutive-subsequences?list=am-300",
        "id": "split-array-into-consecutive-subsequences",
        "leetcodeUrl": "https://leetcode.com/problems/split-array-into-consecutive-subsequences",
        "notesUrl": "",
        "slug": "split-array-into-consecutive-subsequences",
        "solutionUrl": "/learn/dsa/split-array-into-consecutive-subsequences",
        "title": "Split Array into Consecutive Subsequences",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/number-of-matching-subsequences?list=am-300",
        "id": "number-of-matching-subsequences",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-matching-subsequences",
        "notesUrl": "",
        "slug": "number-of-matching-subsequences",
        "solutionUrl": "/learn/dsa/number-of-matching-subsequences",
        "title": "Number of Matching Subsequences",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 1,
        "href": "/practice/dsa/number-of-good-ways-to-split-a-string?list=am-300",
        "id": "number-of-good-ways-to-split-a-string",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-good-ways-to-split-a-string",
        "notesUrl": "",
        "slug": "number-of-good-ways-to-split-a-string",
        "solutionUrl": "/learn/dsa/number-of-good-ways-to-split-a-string",
        "title": "Number of Good Ways to Split a String",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "hash-tables"
  },
  {
    "category": "Two Pointers",
    "countText": "",
    "learnUrl": "/learn/dsa/two-pointers-introduction",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 5,
        "href": "/practice/dsa/merge-sorted-array?list=am-300",
        "id": "merge-sorted-array",
        "leetcodeUrl": "https://leetcode.com/problems/merge-sorted-array",
        "notesUrl": "",
        "slug": "merge-sorted-array",
        "solutionUrl": "/learn/dsa/merge-sorted-array",
        "title": "Merge Sorted Array",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/two-sum-ii-input-array-is-sorted?list=am-300",
        "id": "two-sum-ii-input-array-is-sorted",
        "leetcodeUrl": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted",
        "notesUrl": "",
        "slug": "two-sum-ii-input-array-is-sorted",
        "solutionUrl": "/learn/dsa/two-sum-ii-input-array-is-sorted",
        "title": "Two Sum II - Input Array Is Sorted",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/container-with-most-water?list=am-300",
        "id": "container-with-most-water",
        "leetcodeUrl": "https://leetcode.com/problems/container-with-most-water",
        "notesUrl": "",
        "slug": "container-with-most-water",
        "solutionUrl": "/learn/dsa/container-with-most-water",
        "title": "Container With Most Water",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/3Sum?list=am-300",
        "id": "3Sum",
        "leetcodeUrl": "https://leetcode.com/problems/3Sum",
        "notesUrl": "",
        "slug": "3Sum",
        "solutionUrl": "/learn/dsa/3Sum",
        "title": "3Sum",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 5,
        "href": "/practice/dsa/trapping-rain-water?list=am-300",
        "id": "trapping-rain-water",
        "leetcodeUrl": "https://leetcode.com/problems/trapping-rain-water",
        "notesUrl": "",
        "slug": "trapping-rain-water",
        "solutionUrl": "/learn/dsa/trapping-rain-water",
        "title": "Trapping Rain Water",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "two-pointers"
  },
  {
    "category": "Prefix Sum",
    "countText": "",
    "learnUrl": "/learn/dsa/prefix-sum-introduction",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/range-sum-query-immutable?list=am-300",
        "id": "range-sum-query-immutable",
        "leetcodeUrl": "https://leetcode.com/problems/range-sum-query-immutable",
        "notesUrl": "",
        "slug": "range-sum-query-immutable",
        "solutionUrl": "/learn/dsa/range-sum-query-immutable",
        "title": "Range Sum Query - Immutable",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/subarray-sum-equals-k?list=am-300",
        "id": "subarray-sum-equals-k",
        "leetcodeUrl": "https://leetcode.com/problems/subarray-sum-equals-k",
        "notesUrl": "",
        "slug": "subarray-sum-equals-k",
        "solutionUrl": "/learn/dsa/subarray-sum-equals-k",
        "title": "Subarray Sum Equals K",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/subarray-sums-divisible-by-k?list=am-300",
        "id": "subarray-sums-divisible-by-k",
        "leetcodeUrl": "https://leetcode.com/problems/subarray-sums-divisible-by-k",
        "notesUrl": "",
        "slug": "subarray-sums-divisible-by-k",
        "solutionUrl": "/learn/dsa/subarray-sums-divisible-by-k",
        "title": "Subarray Sums Divisible by K",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/continuous-subarray-sum?list=am-300",
        "id": "continuous-subarray-sum",
        "leetcodeUrl": "https://leetcode.com/problems/continuous-subarray-sum",
        "notesUrl": "",
        "slug": "continuous-subarray-sum",
        "solutionUrl": "/learn/dsa/continuous-subarray-sum",
        "title": "Continuous Subarray Sum",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/contiguous-array?list=am-300",
        "id": "contiguous-array",
        "leetcodeUrl": "https://leetcode.com/problems/contiguous-array",
        "notesUrl": "",
        "slug": "contiguous-array",
        "solutionUrl": "/learn/dsa/contiguous-array",
        "title": "Contiguous Array",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "prefix-sum"
  },
  {
    "category": "Sliding Window - Fixed Size",
    "countText": "",
    "learnUrl": "/learn/dsa/sliding-window-introduction",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/maximum-average-subarray-i?list=am-300",
        "id": "maximum-average-subarray-i",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-average-subarray-i",
        "notesUrl": "",
        "slug": "maximum-average-subarray-i",
        "solutionUrl": "/learn/dsa/maximum-average-subarray-i",
        "title": "Maximum Average Subarray I",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/find-all-anagrams-in-a-string?list=am-300",
        "id": "find-all-anagrams-in-a-string",
        "leetcodeUrl": "https://leetcode.com/problems/find-all-anagrams-in-a-string",
        "notesUrl": "",
        "slug": "find-all-anagrams-in-a-string",
        "solutionUrl": "/learn/dsa/find-all-anagrams-in-a-string",
        "title": "Find All Anagrams in a String",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/permutation-in-string?list=am-300",
        "id": "permutation-in-string",
        "leetcodeUrl": "https://leetcode.com/problems/permutation-in-string",
        "notesUrl": "",
        "slug": "permutation-in-string",
        "solutionUrl": "/learn/dsa/permutation-in-string",
        "title": "Permutation in String",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/maximum-sum-of-distinct-subarrays-with-length-k?list=am-300",
        "id": "maximum-sum-of-distinct-subarrays-with-length-k",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k",
        "notesUrl": "",
        "slug": "maximum-sum-of-distinct-subarrays-with-length-k",
        "solutionUrl": "/learn/dsa/maximum-sum-of-distinct-subarrays-with-length-k",
        "title": "Maximum Sum of Distinct Subarrays With Length K",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/substring-with-concatenation-of-all-words?list=am-300",
        "id": "substring-with-concatenation-of-all-words",
        "leetcodeUrl": "https://leetcode.com/problems/substring-with-concatenation-of-all-words",
        "notesUrl": "",
        "slug": "substring-with-concatenation-of-all-words",
        "solutionUrl": "/learn/dsa/substring-with-concatenation-of-all-words",
        "title": "Substring with Concatenation of All Words",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      }
    ],
    "slug": "sliding-window-fixed-size"
  },
  {
    "category": "Sliding Window - Dynamic Size",
    "countText": "",
    "learnUrl": "/learn/dsa/sliding-window-introduction",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/longest-substring-without-repeating-characters?list=am-300",
        "id": "longest-substring-without-repeating-characters",
        "leetcodeUrl": "https://leetcode.com/problems/longest-substring-without-repeating-characters",
        "notesUrl": "",
        "slug": "longest-substring-without-repeating-characters",
        "solutionUrl": "/learn/dsa/longest-substring-without-repeating-characters",
        "title": "Longest Substring Without Repeating Characters",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/longest-repeating-character-replacement?list=am-300",
        "id": "longest-repeating-character-replacement",
        "leetcodeUrl": "https://leetcode.com/problems/longest-repeating-character-replacement",
        "notesUrl": "",
        "slug": "longest-repeating-character-replacement",
        "solutionUrl": "/learn/dsa/longest-repeating-character-replacement",
        "title": "Longest Repeating Character Replacement",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/minimum-size-subarray-sum?list=am-300",
        "id": "minimum-size-subarray-sum",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-size-subarray-sum",
        "notesUrl": "",
        "slug": "minimum-size-subarray-sum",
        "solutionUrl": "/learn/dsa/minimum-size-subarray-sum",
        "title": "Minimum Size Subarray Sum",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/max-consecutive-ones-iii?list=am-300",
        "id": "max-consecutive-ones-iii",
        "leetcodeUrl": "https://leetcode.com/problems/max-consecutive-ones-iii",
        "notesUrl": "",
        "slug": "max-consecutive-ones-iii",
        "solutionUrl": "/learn/dsa/max-consecutive-ones-iii",
        "title": "Max Consecutive Ones III",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/minimum-window-substring?list=am-300",
        "id": "minimum-window-substring",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-window-substring",
        "notesUrl": "",
        "slug": "minimum-window-substring",
        "solutionUrl": "/learn/dsa/minimum-window-substring",
        "title": "Minimum Window Substring",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "sliding-window-dynamic-size"
  },
  {
    "category": "Kadane's Algorithm",
    "countText": "",
    "learnUrl": "/learn/dsa/kadane-s-algorithm-introduction",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/maximum-subarray?list=am-300",
        "id": "maximum-subarray",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray",
        "notesUrl": "",
        "slug": "maximum-subarray",
        "solutionUrl": "/learn/dsa/maximum-subarray",
        "title": "Maximum Subarray",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/maximum-sum-circular-subarray?list=am-300",
        "id": "maximum-sum-circular-subarray",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-sum-circular-subarray",
        "notesUrl": "",
        "slug": "maximum-sum-circular-subarray",
        "solutionUrl": "/learn/dsa/maximum-sum-circular-subarray",
        "title": "Maximum Sum Circular Subarray",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/maximum-product-subarray?list=am-300",
        "id": "maximum-product-subarray",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-product-subarray",
        "notesUrl": "",
        "slug": "maximum-product-subarray",
        "solutionUrl": "/learn/dsa/maximum-product-subarray",
        "title": "Maximum Product Subarray",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 1,
        "href": "/practice/dsa/best-sightseeing-pair?list=am-300",
        "id": "best-sightseeing-pair",
        "leetcodeUrl": "https://leetcode.com/problems/best-sightseeing-pair",
        "notesUrl": "",
        "slug": "best-sightseeing-pair",
        "solutionUrl": "/learn/dsa/best-sightseeing-pair",
        "title": "Best Sightseeing Pair",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "kadane-s-algorithm"
  },
  {
    "category": "Matrix (2D Array)",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=J1aQ9JN4vZY",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/spiral-matrix?list=am-300",
        "id": "spiral-matrix",
        "leetcodeUrl": "https://leetcode.com/problems/spiral-matrix",
        "notesUrl": "",
        "slug": "spiral-matrix",
        "solutionUrl": "/learn/dsa/spiral-matrix",
        "title": "Spiral Matrix",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/rotate-image?list=am-300",
        "id": "rotate-image",
        "leetcodeUrl": "https://leetcode.com/problems/rotate-image",
        "notesUrl": "",
        "slug": "rotate-image",
        "solutionUrl": "/learn/dsa/rotate-image",
        "title": "Rotate Image",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/set-matrix-zeroes?list=am-300",
        "id": "set-matrix-zeroes",
        "leetcodeUrl": "https://leetcode.com/problems/set-matrix-zeroes",
        "notesUrl": "",
        "slug": "set-matrix-zeroes",
        "solutionUrl": "/learn/dsa/set-matrix-zeroes",
        "title": "Set Matrix Zeroes",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/valid-sudoku?list=am-300",
        "id": "valid-sudoku",
        "leetcodeUrl": "https://leetcode.com/problems/valid-sudoku",
        "notesUrl": "",
        "slug": "valid-sudoku",
        "solutionUrl": "/learn/dsa/valid-sudoku",
        "title": "Valid Sudoku",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/game-of-life?list=am-300",
        "id": "game-of-life",
        "leetcodeUrl": "https://leetcode.com/problems/game-of-life",
        "notesUrl": "",
        "slug": "game-of-life",
        "solutionUrl": "/learn/dsa/game-of-life",
        "title": "Game of Life",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      }
    ],
    "slug": "matrix-2d-array-"
  },
  {
    "category": "Linked List",
    "countText": "",
    "learnUrl": "/learn/dsa/linked-list-introduction",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/intersection-of-two-linked-lists?list=am-300",
        "id": "intersection-of-two-linked-lists",
        "leetcodeUrl": "https://leetcode.com/problems/intersection-of-two-linked-lists",
        "notesUrl": "",
        "slug": "intersection-of-two-linked-lists",
        "solutionUrl": "/learn/dsa/intersection-of-two-linked-lists",
        "title": "Intersection of Two Linked Lists",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/design-linked-list?list=am-300",
        "id": "design-linked-list",
        "leetcodeUrl": "https://leetcode.com/problems/design-linked-list",
        "notesUrl": "",
        "slug": "design-linked-list",
        "solutionUrl": "/learn/dsa/design-linked-list",
        "title": "Design Linked List",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/remove-nth-node-from-end-of-list?list=am-300",
        "id": "remove-nth-node-from-end-of-list",
        "leetcodeUrl": "https://leetcode.com/problems/remove-nth-node-from-end-of-list",
        "notesUrl": "",
        "slug": "remove-nth-node-from-end-of-list",
        "solutionUrl": "/learn/dsa/remove-nth-node-from-end-of-list",
        "title": "Remove Nth Node From End of List",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/remove-duplicates-from-sorted-list-ii?list=am-300",
        "id": "remove-duplicates-from-sorted-list-ii",
        "leetcodeUrl": "https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii",
        "notesUrl": "",
        "slug": "remove-duplicates-from-sorted-list-ii",
        "solutionUrl": "/learn/dsa/remove-duplicates-from-sorted-list-ii",
        "title": "Remove Duplicates from Sorted List II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/swap-nodes-in-pairs?list=am-300",
        "id": "swap-nodes-in-pairs",
        "leetcodeUrl": "https://leetcode.com/problems/swap-nodes-in-pairs",
        "notesUrl": "",
        "slug": "swap-nodes-in-pairs",
        "solutionUrl": "/learn/dsa/swap-nodes-in-pairs",
        "title": "Swap Nodes in Pairs",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/copy-list-with-random-pointer?list=am-300",
        "id": "copy-list-with-random-pointer",
        "leetcodeUrl": "https://leetcode.com/problems/copy-list-with-random-pointer",
        "notesUrl": "",
        "slug": "copy-list-with-random-pointer",
        "solutionUrl": "/learn/dsa/copy-list-with-random-pointer",
        "title": "Copy List with Random Pointer",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/partition-list?list=am-300",
        "id": "partition-list",
        "leetcodeUrl": "https://leetcode.com/problems/partition-list",
        "notesUrl": "",
        "slug": "partition-list",
        "solutionUrl": "/learn/dsa/partition-list",
        "title": "Partition List",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/rotate-list?list=am-300",
        "id": "rotate-list",
        "leetcodeUrl": "https://leetcode.com/problems/rotate-list",
        "notesUrl": "",
        "slug": "rotate-list",
        "solutionUrl": "/learn/dsa/rotate-list",
        "title": "Rotate List",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/add-two-numbers?list=am-300",
        "id": "add-two-numbers",
        "leetcodeUrl": "https://leetcode.com/problems/add-two-numbers",
        "notesUrl": "",
        "slug": "add-two-numbers",
        "solutionUrl": "/learn/dsa/add-two-numbers",
        "title": "Add Two Numbers",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/flatten-a-multilevel-doubly-linked-list?list=am-300",
        "id": "flatten-a-multilevel-doubly-linked-list",
        "leetcodeUrl": "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list",
        "notesUrl": "",
        "slug": "flatten-a-multilevel-doubly-linked-list",
        "solutionUrl": "/learn/dsa/flatten-a-multilevel-doubly-linked-list",
        "title": "Flatten a Multilevel Doubly Linked List",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "linked-list"
  },
  {
    "category": "LinkedList In-place Reversal",
    "countText": "",
    "learnUrl": "/learn/dsa/linked-list-in-place-reversal-introduction",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/palindrome-linked-list?list=am-300",
        "id": "palindrome-linked-list",
        "leetcodeUrl": "https://leetcode.com/problems/palindrome-linked-list",
        "notesUrl": "",
        "slug": "palindrome-linked-list",
        "solutionUrl": "/learn/dsa/palindrome-linked-list",
        "title": "Palindrome Linked List",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/reverse-linked-list?list=am-300",
        "id": "reverse-linked-list",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-linked-list",
        "notesUrl": "",
        "slug": "reverse-linked-list",
        "solutionUrl": "/learn/dsa/reverse-linked-list",
        "title": "Reverse Linked List",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/reverse-linked-list-ii?list=am-300",
        "id": "reverse-linked-list-ii",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-linked-list-ii",
        "notesUrl": "",
        "slug": "reverse-linked-list-ii",
        "solutionUrl": "/learn/dsa/reverse-linked-list-ii",
        "title": "Reverse Linked List II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/reverse-nodes-in-k-group?list=am-300",
        "id": "reverse-nodes-in-k-group",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-nodes-in-k-group",
        "notesUrl": "",
        "slug": "reverse-nodes-in-k-group",
        "solutionUrl": "/learn/dsa/reverse-nodes-in-k-group",
        "title": "Reverse Nodes in k-Group",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "linkedlist-in-place-reversal"
  },
  {
    "category": "Fast and Slow Pointers",
    "countText": "",
    "learnUrl": "/learn/dsa/fast-slow-pointers-introduction",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/middle-of-the-linked-list?list=am-300",
        "id": "middle-of-the-linked-list",
        "leetcodeUrl": "https://leetcode.com/problems/middle-of-the-linked-list",
        "notesUrl": "",
        "slug": "middle-of-the-linked-list",
        "solutionUrl": "/learn/dsa/middle-of-the-linked-list",
        "title": "Middle of the Linked List",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/happy-number?list=am-300",
        "id": "happy-number",
        "leetcodeUrl": "https://leetcode.com/problems/happy-number",
        "notesUrl": "",
        "slug": "happy-number",
        "solutionUrl": "/learn/dsa/happy-number",
        "title": "Happy Number",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/linked-list-cycle-ii?list=am-300",
        "id": "linked-list-cycle-ii",
        "leetcodeUrl": "https://leetcode.com/problems/linked-list-cycle-ii",
        "notesUrl": "",
        "slug": "linked-list-cycle-ii",
        "solutionUrl": "/learn/dsa/linked-list-cycle-ii",
        "title": "Linked List Cycle II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "fast-and-slow-pointers"
  },
  {
    "category": "Stacks",
    "countText": "",
    "learnUrl": "/learn/dsa/stack-introduction",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 5,
        "href": "/practice/dsa/valid-parentheses?list=am-300",
        "id": "valid-parentheses",
        "leetcodeUrl": "https://leetcode.com/problems/valid-parentheses",
        "notesUrl": "",
        "slug": "valid-parentheses",
        "solutionUrl": "/learn/dsa/valid-parentheses",
        "title": "Valid Parentheses",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/remove-all-adjacent-duplicates-in-string?list=am-300",
        "id": "remove-all-adjacent-duplicates-in-string",
        "leetcodeUrl": "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string",
        "notesUrl": "",
        "slug": "remove-all-adjacent-duplicates-in-string",
        "solutionUrl": "/learn/dsa/remove-all-adjacent-duplicates-in-string",
        "title": "Remove All Adjacent Duplicates In String",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/min-stack?list=am-300",
        "id": "min-stack",
        "leetcodeUrl": "https://leetcode.com/problems/min-stack",
        "notesUrl": "",
        "slug": "min-stack",
        "solutionUrl": "/learn/dsa/min-stack",
        "title": "Min Stack",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/remove-duplicate-letters?list=am-300",
        "id": "remove-duplicate-letters",
        "leetcodeUrl": "https://leetcode.com/problems/remove-duplicate-letters",
        "notesUrl": "",
        "slug": "remove-duplicate-letters",
        "solutionUrl": "/learn/dsa/remove-duplicate-letters",
        "title": "Remove Duplicate Letters",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 1,
        "href": "/practice/dsa/removing-stars-from-a-string?list=am-300",
        "id": "removing-stars-from-a-string",
        "leetcodeUrl": "https://leetcode.com/problems/removing-stars-from-a-string",
        "notesUrl": "",
        "slug": "removing-stars-from-a-string",
        "solutionUrl": "/learn/dsa/removing-stars-from-a-string",
        "title": "Removing Stars From a String",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/evaluate-reverse-polish-notation?list=am-300",
        "id": "evaluate-reverse-polish-notation",
        "leetcodeUrl": "https://leetcode.com/problems/evaluate-reverse-polish-notation",
        "notesUrl": "",
        "slug": "evaluate-reverse-polish-notation",
        "solutionUrl": "/learn/dsa/evaluate-reverse-polish-notation",
        "title": "Evaluate Reverse Polish Notation",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/basic-calculator-ii?list=am-300",
        "id": "basic-calculator-ii",
        "leetcodeUrl": "https://leetcode.com/problems/basic-calculator-ii",
        "notesUrl": "",
        "slug": "basic-calculator-ii",
        "solutionUrl": "/learn/dsa/basic-calculator-ii",
        "title": "Basic Calculator II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 5,
        "href": "/practice/dsa/longest-valid-parentheses?list=am-300",
        "id": "longest-valid-parentheses",
        "leetcodeUrl": "https://leetcode.com/problems/longest-valid-parentheses",
        "notesUrl": "",
        "slug": "longest-valid-parentheses",
        "solutionUrl": "/learn/dsa/longest-valid-parentheses",
        "title": "Longest Valid Parentheses",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "stacks"
  },
  {
    "category": "Monotonic Stack",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=DtJVwbbicjQ&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/next-greater-element-i?list=am-300",
        "id": "next-greater-element-i",
        "leetcodeUrl": "https://leetcode.com/problems/next-greater-element-i",
        "notesUrl": "",
        "slug": "next-greater-element-i",
        "solutionUrl": "/learn/dsa/next-greater-element-i",
        "title": "Next Greater Element I",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/daily-temperatures?list=am-300",
        "id": "daily-temperatures",
        "leetcodeUrl": "https://leetcode.com/problems/daily-temperatures",
        "notesUrl": "",
        "slug": "daily-temperatures",
        "solutionUrl": "/learn/dsa/daily-temperatures",
        "title": "Daily Temperatures",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/online-stock-span?list=am-300",
        "id": "online-stock-span",
        "leetcodeUrl": "https://leetcode.com/problems/online-stock-span",
        "notesUrl": "",
        "slug": "online-stock-span",
        "solutionUrl": "/learn/dsa/online-stock-span",
        "title": "Online Stock Span",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/132-pattern?list=am-300",
        "id": "132-pattern",
        "leetcodeUrl": "https://leetcode.com/problems/132-pattern",
        "notesUrl": "",
        "slug": "132-pattern",
        "solutionUrl": "/learn/dsa/132-pattern",
        "title": "132 Pattern",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/number-of-visible-people-in-a-queue?list=am-300",
        "id": "number-of-visible-people-in-a-queue",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-visible-people-in-a-queue",
        "notesUrl": "",
        "slug": "number-of-visible-people-in-a-queue",
        "solutionUrl": "/learn/dsa/number-of-visible-people-in-a-queue",
        "title": "Number of Visible People in a Queue",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 5,
        "href": "/practice/dsa/largest-rectangle-in-histogram?list=am-300",
        "id": "largest-rectangle-in-histogram",
        "leetcodeUrl": "https://leetcode.com/problems/largest-rectangle-in-histogram",
        "notesUrl": "",
        "slug": "largest-rectangle-in-histogram",
        "solutionUrl": "/learn/dsa/largest-rectangle-in-histogram",
        "title": "Largest Rectangle in Histogram",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "monotonic-stack"
  },
  {
    "category": "Queues",
    "countText": "",
    "learnUrl": "/learn/dsa/queue-introduction",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/number-of-recent-calls?list=am-300",
        "id": "number-of-recent-calls",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-recent-calls",
        "notesUrl": "",
        "slug": "number-of-recent-calls",
        "solutionUrl": "/learn/dsa/number-of-recent-calls",
        "title": "Number of Recent Calls",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 2,
        "href": "/practice/dsa/time-needed-to-buy-tickets?list=am-300",
        "id": "time-needed-to-buy-tickets",
        "leetcodeUrl": "https://leetcode.com/problems/time-needed-to-buy-tickets",
        "notesUrl": "",
        "slug": "time-needed-to-buy-tickets",
        "solutionUrl": "/learn/dsa/time-needed-to-buy-tickets",
        "title": "Time Needed to Buy Tickets",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 2,
        "href": "/practice/dsa/reveal-cards-in-increasing-order?list=am-300",
        "id": "reveal-cards-in-increasing-order",
        "leetcodeUrl": "https://leetcode.com/problems/reveal-cards-in-increasing-order",
        "notesUrl": "",
        "slug": "reveal-cards-in-increasing-order",
        "solutionUrl": "/learn/dsa/reveal-cards-in-increasing-order",
        "title": "Reveal Cards In Increasing Order",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "queues"
  },
  {
    "category": "Monotonic Queue",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=DfljaUwZsOk&pp=ygUPbW9ub3RvbmljIHF1ZXVl",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 2,
        "href": "/practice/dsa/jump-game-vi?list=am-300",
        "id": "jump-game-vi",
        "leetcodeUrl": "https://leetcode.com/problems/jump-game-vi",
        "notesUrl": "",
        "slug": "jump-game-vi",
        "solutionUrl": "/learn/dsa/jump-game-vi",
        "title": "Jump Game VI",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit?list=am-300",
        "id": "longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit",
        "leetcodeUrl": "https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit",
        "notesUrl": "",
        "slug": "longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit",
        "solutionUrl": "/learn/dsa/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit",
        "title": "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 5,
        "href": "/practice/dsa/sliding-window-maximum?list=am-300",
        "id": "sliding-window-maximum",
        "leetcodeUrl": "https://leetcode.com/problems/sliding-window-maximum",
        "notesUrl": "",
        "slug": "sliding-window-maximum",
        "solutionUrl": "/learn/dsa/sliding-window-maximum",
        "title": "Sliding Window Maximum",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 1,
        "href": "/practice/dsa/max-value-of-equation?list=am-300",
        "id": "max-value-of-equation",
        "leetcodeUrl": "https://leetcode.com/problems/max-value-of-equation",
        "notesUrl": "",
        "slug": "max-value-of-equation",
        "solutionUrl": "/learn/dsa/max-value-of-equation",
        "title": "Max Value of Equation",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "monotonic-queue"
  },
  {
    "category": "Bucket Sort",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=ROnYubH_spM",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/sort-characters-by-frequency?list=am-300",
        "id": "sort-characters-by-frequency",
        "leetcodeUrl": "https://leetcode.com/problems/sort-characters-by-frequency",
        "notesUrl": "",
        "slug": "sort-characters-by-frequency",
        "solutionUrl": "/learn/dsa/sort-characters-by-frequency",
        "title": "Sort Characters By Frequency",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/top-k-frequent-words?list=am-300",
        "id": "top-k-frequent-words",
        "leetcodeUrl": "https://leetcode.com/problems/top-k-frequent-words",
        "notesUrl": "",
        "slug": "top-k-frequent-words",
        "solutionUrl": "/learn/dsa/top-k-frequent-words",
        "title": "Top K Frequent Words",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 2,
        "href": "/practice/dsa/maximum-gap?list=am-300",
        "id": "maximum-gap",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-gap",
        "notesUrl": "",
        "slug": "maximum-gap",
        "solutionUrl": "/learn/dsa/maximum-gap",
        "title": "Maximum Gap",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "bucket-sort"
  },
  {
    "category": "Recursion",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=ngCos392W4w",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 5,
        "href": "/practice/dsa/merge-two-sorted-lists?list=am-300",
        "id": "merge-two-sorted-lists",
        "leetcodeUrl": "https://leetcode.com/problems/merge-two-sorted-lists",
        "notesUrl": "",
        "slug": "merge-two-sorted-lists",
        "solutionUrl": "/learn/dsa/merge-two-sorted-lists",
        "title": "Merge Two Sorted Lists",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 2,
        "href": "/practice/dsa/powx-n?list=am-300",
        "id": "powx-n",
        "leetcodeUrl": "https://leetcode.com/problems/powx-n",
        "notesUrl": "",
        "slug": "powx-n",
        "solutionUrl": "/learn/dsa/powx-n",
        "title": "Pow(x, n)",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/decode-string?list=am-300",
        "id": "decode-string",
        "leetcodeUrl": "https://leetcode.com/problems/decode-string",
        "notesUrl": "",
        "slug": "decode-string",
        "solutionUrl": "/learn/dsa/decode-string",
        "title": "Decode String",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "recursion"
  },
  {
    "category": "Divide and Conquer",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=2Rr2tW9zvRg",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/convert-sorted-list-to-binary-search-tree?list=am-300",
        "id": "convert-sorted-list-to-binary-search-tree",
        "leetcodeUrl": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree",
        "notesUrl": "",
        "slug": "convert-sorted-list-to-binary-search-tree",
        "solutionUrl": "/learn/dsa/convert-sorted-list-to-binary-search-tree",
        "title": "Convert Sorted List to Binary Search Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/construct-quad-tree?list=am-300",
        "id": "construct-quad-tree",
        "leetcodeUrl": "https://leetcode.com/problems/construct-quad-tree",
        "notesUrl": "",
        "slug": "construct-quad-tree",
        "solutionUrl": "/learn/dsa/construct-quad-tree",
        "title": "Construct Quad Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 2,
        "href": "/practice/dsa/maximum-binary-tree?list=am-300",
        "id": "maximum-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-binary-tree",
        "notesUrl": "",
        "slug": "maximum-binary-tree",
        "solutionUrl": "/learn/dsa/maximum-binary-tree",
        "title": "Maximum Binary Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "divide-and-conquer"
  },
  {
    "category": "Merge Sort",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=TzeBrDU-JaY",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/sort-list?list=am-300",
        "id": "sort-list",
        "leetcodeUrl": "https://leetcode.com/problems/sort-list",
        "notesUrl": "",
        "slug": "sort-list",
        "solutionUrl": "/learn/dsa/sort-list",
        "title": "Sort List",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/reverse-pairs?list=am-300",
        "id": "reverse-pairs",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-pairs",
        "notesUrl": "",
        "slug": "reverse-pairs",
        "solutionUrl": "/learn/dsa/reverse-pairs",
        "title": "Reverse Pairs",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "merge-sort"
  },
  {
    "category": "QuickSort / QuickSelect",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=XEmy13g1Qxc",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/sort-colors?list=am-300",
        "id": "sort-colors",
        "leetcodeUrl": "https://leetcode.com/problems/sort-colors",
        "notesUrl": "",
        "slug": "sort-colors",
        "solutionUrl": "/learn/dsa/sort-colors",
        "title": "Sort Colors",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/kth-largest-element-in-an-array?list=am-300",
        "id": "kth-largest-element-in-an-array",
        "leetcodeUrl": "https://leetcode.com/problems/kth-largest-element-in-an-array",
        "notesUrl": "",
        "slug": "kth-largest-element-in-an-array",
        "solutionUrl": "/learn/dsa/kth-largest-element-in-an-array",
        "title": "Kth Largest Element in an Array",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "quicksort-quickselect"
  },
  {
    "category": "Binary Search",
    "countText": "",
    "learnUrl": "/learn/dsa/binary-search-introduction",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/search-insert-position?list=am-300",
        "id": "search-insert-position",
        "leetcodeUrl": "https://leetcode.com/problems/search-insert-position",
        "notesUrl": "",
        "slug": "search-insert-position",
        "solutionUrl": "/learn/dsa/search-insert-position",
        "title": "Search Insert Position",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/find-first-and-last-position-of-element-in-sorted-array?list=am-300",
        "id": "find-first-and-last-position-of-element-in-sorted-array",
        "leetcodeUrl": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array",
        "notesUrl": "",
        "slug": "find-first-and-last-position-of-element-in-sorted-array",
        "solutionUrl": "/learn/dsa/find-first-and-last-position-of-element-in-sorted-array",
        "title": "Find First and Last Position of Element in Sorted Array",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/search-in-rotated-sorted-array?list=am-300",
        "id": "search-in-rotated-sorted-array",
        "leetcodeUrl": "https://leetcode.com/problems/search-in-rotated-sorted-array",
        "notesUrl": "",
        "slug": "search-in-rotated-sorted-array",
        "solutionUrl": "/learn/dsa/search-in-rotated-sorted-array",
        "title": "Search in Rotated Sorted Array",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/find-peak-element?list=am-300",
        "id": "find-peak-element",
        "leetcodeUrl": "https://leetcode.com/problems/find-peak-element",
        "notesUrl": "",
        "slug": "find-peak-element",
        "solutionUrl": "/learn/dsa/find-peak-element",
        "title": "Find Peak Element",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/random-pick-with-weight?list=am-300",
        "id": "random-pick-with-weight",
        "leetcodeUrl": "https://leetcode.com/problems/random-pick-with-weight",
        "notesUrl": "",
        "slug": "random-pick-with-weight",
        "solutionUrl": "/learn/dsa/random-pick-with-weight",
        "title": "Random Pick with Weight",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/koko-eating-bananas?list=am-300",
        "id": "koko-eating-bananas",
        "leetcodeUrl": "https://leetcode.com/problems/koko-eating-bananas",
        "notesUrl": "",
        "slug": "koko-eating-bananas",
        "solutionUrl": "/learn/dsa/koko-eating-bananas",
        "title": "Koko Eating Bananas",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/find-minimum-in-rotated-sorted-array?list=am-300",
        "id": "find-minimum-in-rotated-sorted-array",
        "leetcodeUrl": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array",
        "notesUrl": "",
        "slug": "find-minimum-in-rotated-sorted-array",
        "solutionUrl": "/learn/dsa/find-minimum-in-rotated-sorted-array",
        "title": "Find Minimum in Rotated Sorted Array",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/search-a-2d-matrix?list=am-300",
        "id": "search-a-2d-matrix",
        "leetcodeUrl": "https://leetcode.com/problems/search-a-2d-matrix",
        "notesUrl": "",
        "slug": "search-a-2d-matrix",
        "solutionUrl": "/learn/dsa/search-a-2d-matrix",
        "title": "Search a 2D Matrix",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/find-in-mountain-array?list=am-300",
        "id": "find-in-mountain-array",
        "leetcodeUrl": "https://leetcode.com/problems/find-in-mountain-array",
        "notesUrl": "",
        "slug": "find-in-mountain-array",
        "solutionUrl": "/learn/dsa/find-in-mountain-array",
        "title": "Find in Mountain Array",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 5,
        "href": "/practice/dsa/median-of-two-sorted-arrays?list=am-300",
        "id": "median-of-two-sorted-arrays",
        "leetcodeUrl": "https://leetcode.com/problems/median-of-two-sorted-arrays",
        "notesUrl": "",
        "slug": "median-of-two-sorted-arrays",
        "solutionUrl": "/learn/dsa/median-of-two-sorted-arrays",
        "title": "Median of Two Sorted Arrays",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "binary-search"
  },
  {
    "category": "Backtracking",
    "countText": "",
    "learnUrl": "/learn/dsa/backtracking-introduction",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/generate-parentheses?list=am-300",
        "id": "generate-parentheses",
        "leetcodeUrl": "https://leetcode.com/problems/generate-parentheses",
        "notesUrl": "",
        "slug": "generate-parentheses",
        "solutionUrl": "/learn/dsa/generate-parentheses",
        "title": "Generate Parentheses",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/permutations?list=am-300",
        "id": "permutations",
        "leetcodeUrl": "https://leetcode.com/problems/permutations",
        "notesUrl": "",
        "slug": "permutations",
        "solutionUrl": "/learn/dsa/permutations",
        "title": "Permutations",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/subsets?list=am-300",
        "id": "subsets",
        "leetcodeUrl": "https://leetcode.com/problems/subsets",
        "notesUrl": "",
        "slug": "subsets",
        "solutionUrl": "/learn/dsa/subsets",
        "title": "Subsets",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/combination-sum?list=am-300",
        "id": "combination-sum",
        "leetcodeUrl": "https://leetcode.com/problems/combination-sum",
        "notesUrl": "",
        "slug": "combination-sum",
        "solutionUrl": "/learn/dsa/combination-sum",
        "title": "Combination Sum",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/combination-sum-ii?list=am-300",
        "id": "combination-sum-ii",
        "leetcodeUrl": "https://leetcode.com/problems/combination-sum-ii",
        "notesUrl": "",
        "slug": "combination-sum-ii",
        "solutionUrl": "/learn/dsa/combination-sum-ii",
        "title": "Combination Sum II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/letter-combinations-of-a-phone-number?list=am-300",
        "id": "letter-combinations-of-a-phone-number",
        "leetcodeUrl": "https://leetcode.com/problems/letter-combinations-of-a-phone-number",
        "notesUrl": "",
        "slug": "letter-combinations-of-a-phone-number",
        "solutionUrl": "/learn/dsa/letter-combinations-of-a-phone-number",
        "title": "Letter Combinations of a Phone Number",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/palindrome-partitioning?list=am-300",
        "id": "palindrome-partitioning",
        "leetcodeUrl": "https://leetcode.com/problems/palindrome-partitioning",
        "notesUrl": "",
        "slug": "palindrome-partitioning",
        "solutionUrl": "/learn/dsa/palindrome-partitioning",
        "title": "Palindrome Partitioning",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 5,
        "href": "/practice/dsa/n-queens?list=am-300",
        "id": "n-queens",
        "leetcodeUrl": "https://leetcode.com/problems/n-queens",
        "notesUrl": "",
        "slug": "n-queens",
        "solutionUrl": "/learn/dsa/n-queens",
        "title": "N-Queens",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "backtracking"
  },
  {
    "category": "Tree Traversal - Level Order",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=rpPWkRijTh0&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/binary-tree-level-order-traversal?list=am-300",
        "id": "binary-tree-level-order-traversal",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-level-order-traversal",
        "notesUrl": "",
        "slug": "binary-tree-level-order-traversal",
        "solutionUrl": "/learn/dsa/binary-tree-level-order-traversal",
        "title": "Binary Tree Level Order Traversal",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/binary-tree-right-side-view?list=am-300",
        "id": "binary-tree-right-side-view",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-right-side-view",
        "notesUrl": "",
        "slug": "binary-tree-right-side-view",
        "solutionUrl": "/learn/dsa/binary-tree-right-side-view",
        "title": "Binary Tree Right Side View",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/binary-tree-zigzag-level-order-traversal?list=am-300",
        "id": "binary-tree-zigzag-level-order-traversal",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal",
        "notesUrl": "",
        "slug": "binary-tree-zigzag-level-order-traversal",
        "solutionUrl": "/learn/dsa/binary-tree-zigzag-level-order-traversal",
        "title": "Binary Tree Zigzag Level Order Traversal",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/populating-next-right-pointers-in-each-node-ii?list=am-300",
        "id": "populating-next-right-pointers-in-each-node-ii",
        "leetcodeUrl": "https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii",
        "notesUrl": "",
        "slug": "populating-next-right-pointers-in-each-node-ii",
        "solutionUrl": "/learn/dsa/populating-next-right-pointers-in-each-node-ii",
        "title": "Populating Next Right Pointers in Each Node II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/maximum-width-of-binary-tree?list=am-300",
        "id": "maximum-width-of-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-width-of-binary-tree",
        "notesUrl": "",
        "slug": "maximum-width-of-binary-tree",
        "solutionUrl": "/learn/dsa/maximum-width-of-binary-tree",
        "title": "Maximum Width of Binary Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "tree-traversal-level-order"
  },
  {
    "category": "Tree Traversal - Pre Order",
    "countText": "",
    "learnUrl": "/practice/dsa/binary-tree-preorder-traversal?list=am-300",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 2,
        "href": "/practice/dsa/binary-tree-preorder-traversal?list=am-300",
        "id": "binary-tree-preorder-traversal",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-preorder-traversal",
        "notesUrl": "",
        "slug": "binary-tree-preorder-traversal",
        "solutionUrl": "/learn/dsa/binary-tree-preorder-traversal",
        "title": "Binary Tree Preorder Traversal",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/same-tree?list=am-300",
        "id": "same-tree",
        "leetcodeUrl": "https://leetcode.com/problems/same-tree",
        "notesUrl": "",
        "slug": "same-tree",
        "solutionUrl": "/learn/dsa/same-tree",
        "title": "Same Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/symmetric-tree?list=am-300",
        "id": "symmetric-tree",
        "leetcodeUrl": "https://leetcode.com/problems/symmetric-tree",
        "notesUrl": "",
        "slug": "symmetric-tree",
        "solutionUrl": "/learn/dsa/symmetric-tree",
        "title": "Symmetric Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/binary-tree-paths?list=am-300",
        "id": "binary-tree-paths",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-paths",
        "notesUrl": "",
        "slug": "binary-tree-paths",
        "solutionUrl": "/learn/dsa/binary-tree-paths",
        "title": "Binary Tree Paths",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/convert-sorted-array-to-binary-search-tree?list=am-300",
        "id": "convert-sorted-array-to-binary-search-tree",
        "leetcodeUrl": "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree",
        "notesUrl": "",
        "slug": "convert-sorted-array-to-binary-search-tree",
        "solutionUrl": "/learn/dsa/convert-sorted-array-to-binary-search-tree",
        "title": "Convert Sorted Array to Binary Search Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 2,
        "href": "/practice/dsa/count-complete-tree-nodes?list=am-300",
        "id": "count-complete-tree-nodes",
        "leetcodeUrl": "https://leetcode.com/problems/count-complete-tree-nodes",
        "notesUrl": "",
        "slug": "count-complete-tree-nodes",
        "solutionUrl": "/learn/dsa/count-complete-tree-nodes",
        "title": "Count Complete Tree Nodes",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/path-sum-iii?list=am-300",
        "id": "path-sum-iii",
        "leetcodeUrl": "https://leetcode.com/problems/path-sum-iii",
        "notesUrl": "",
        "slug": "path-sum-iii",
        "solutionUrl": "/learn/dsa/path-sum-iii",
        "title": "Path Sum III",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 1,
        "href": "/practice/dsa/maximum-difference-between-node-and-ancestor?list=am-300",
        "id": "maximum-difference-between-node-and-ancestor",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-difference-between-node-and-ancestor",
        "notesUrl": "",
        "slug": "maximum-difference-between-node-and-ancestor",
        "solutionUrl": "/learn/dsa/maximum-difference-between-node-and-ancestor",
        "title": "Maximum Difference Between Node and Ancestor",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/construct-binary-tree-from-preorder-and-inorder-traversal?list=am-300",
        "id": "construct-binary-tree-from-preorder-and-inorder-traversal",
        "leetcodeUrl": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal",
        "notesUrl": "",
        "slug": "construct-binary-tree-from-preorder-and-inorder-traversal",
        "solutionUrl": "/learn/dsa/construct-binary-tree-from-preorder-and-inorder-traversal",
        "title": "Construct Binary Tree from Preorder and Inorder Traversal",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 2,
        "href": "/practice/dsa/construct-binary-tree-from-inorder-and-postorder-traversal?list=am-300",
        "id": "construct-binary-tree-from-inorder-and-postorder-traversal",
        "leetcodeUrl": "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal",
        "notesUrl": "",
        "slug": "construct-binary-tree-from-inorder-and-postorder-traversal",
        "solutionUrl": "/learn/dsa/construct-binary-tree-from-inorder-and-postorder-traversal",
        "title": "Construct Binary Tree from Inorder and Postorder Traversal",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/serialize-and-deserialize-binary-tree?list=am-300",
        "id": "serialize-and-deserialize-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree",
        "notesUrl": "",
        "slug": "serialize-and-deserialize-binary-tree",
        "solutionUrl": "/learn/dsa/serialize-and-deserialize-binary-tree",
        "title": "Serialize and Deserialize Binary Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "tree-traversal-pre-order"
  },
  {
    "category": "Tree Traversal - In Order",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=g_S5WuasWUE",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/binary-tree-inorder-traversal?list=am-300",
        "id": "binary-tree-inorder-traversal",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-inorder-traversal",
        "notesUrl": "",
        "slug": "binary-tree-inorder-traversal",
        "solutionUrl": "/learn/dsa/binary-tree-inorder-traversal",
        "title": "Binary Tree Inorder Traversal",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 2,
        "href": "/practice/dsa/minimum-distance-between-bst-nodes?list=am-300",
        "id": "minimum-distance-between-bst-nodes",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-distance-between-bst-nodes",
        "notesUrl": "",
        "slug": "minimum-distance-between-bst-nodes",
        "solutionUrl": "/learn/dsa/minimum-distance-between-bst-nodes",
        "title": "Minimum Distance Between BST Nodes",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 2,
        "href": "/practice/dsa/minimum-absolute-difference-in-bst?list=am-300",
        "id": "minimum-absolute-difference-in-bst",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-absolute-difference-in-bst",
        "notesUrl": "",
        "slug": "minimum-absolute-difference-in-bst",
        "solutionUrl": "/learn/dsa/minimum-absolute-difference-in-bst",
        "title": "Minimum Absolute Difference in BST",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/validate-binary-search-tree?list=am-300",
        "id": "validate-binary-search-tree",
        "leetcodeUrl": "https://leetcode.com/problems/validate-binary-search-tree",
        "notesUrl": "",
        "slug": "validate-binary-search-tree",
        "solutionUrl": "/learn/dsa/validate-binary-search-tree",
        "title": "Validate Binary Search Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/kth-smallest-element-in-a-bst?list=am-300",
        "id": "kth-smallest-element-in-a-bst",
        "leetcodeUrl": "https://leetcode.com/problems/kth-smallest-element-in-a-bst",
        "notesUrl": "",
        "slug": "kth-smallest-element-in-a-bst",
        "solutionUrl": "/learn/dsa/kth-smallest-element-in-a-bst",
        "title": "Kth Smallest Element in a BST",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/binary-search-tree-iterator?list=am-300",
        "id": "binary-search-tree-iterator",
        "leetcodeUrl": "https://leetcode.com/problems/binary-search-tree-iterator",
        "notesUrl": "",
        "slug": "binary-search-tree-iterator",
        "solutionUrl": "/learn/dsa/binary-search-tree-iterator",
        "title": "Binary Search Tree Iterator",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "tree-traversal-in-order"
  },
  {
    "category": "Tree Traversal - Post-Order",
    "countText": "",
    "learnUrl": "/practice/dsa/binary-tree-postorder-traversal?list=am-300",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 1,
        "href": "/practice/dsa/binary-tree-postorder-traversal?list=am-300",
        "id": "binary-tree-postorder-traversal",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-postorder-traversal",
        "notesUrl": "",
        "slug": "binary-tree-postorder-traversal",
        "solutionUrl": "/learn/dsa/binary-tree-postorder-traversal",
        "title": "Binary Tree Postorder Traversal",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/invert-binary-tree?list=am-300",
        "id": "invert-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/invert-binary-tree",
        "notesUrl": "",
        "slug": "invert-binary-tree",
        "solutionUrl": "/learn/dsa/invert-binary-tree",
        "title": "Invert Binary Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 4,
        "href": "/practice/dsa/diameter-of-binary-tree?list=am-300",
        "id": "diameter-of-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/diameter-of-binary-tree",
        "notesUrl": "",
        "slug": "diameter-of-binary-tree",
        "solutionUrl": "/learn/dsa/diameter-of-binary-tree",
        "title": "Diameter of Binary Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/delete-nodes-and-return-forest?list=am-300",
        "id": "delete-nodes-and-return-forest",
        "leetcodeUrl": "https://leetcode.com/problems/delete-nodes-and-return-forest",
        "notesUrl": "",
        "slug": "delete-nodes-and-return-forest",
        "solutionUrl": "/learn/dsa/delete-nodes-and-return-forest",
        "title": "Delete Nodes And Return Forest",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/lowest-common-ancestor-of-a-binary-tree?list=am-300",
        "id": "lowest-common-ancestor-of-a-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree",
        "notesUrl": "",
        "slug": "lowest-common-ancestor-of-a-binary-tree",
        "solutionUrl": "/learn/dsa/lowest-common-ancestor-of-a-binary-tree",
        "title": "Lowest Common Ancestor of a Binary Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/find-duplicate-subtrees?list=am-300",
        "id": "find-duplicate-subtrees",
        "leetcodeUrl": "https://leetcode.com/problems/find-duplicate-subtrees",
        "notesUrl": "",
        "slug": "find-duplicate-subtrees",
        "solutionUrl": "/learn/dsa/find-duplicate-subtrees",
        "title": "Find Duplicate Subtrees",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/flatten-binary-tree-to-linked-list?list=am-300",
        "id": "flatten-binary-tree-to-linked-list",
        "leetcodeUrl": "https://leetcode.com/problems/flatten-binary-tree-to-linked-list",
        "notesUrl": "",
        "slug": "flatten-binary-tree-to-linked-list",
        "solutionUrl": "/learn/dsa/flatten-binary-tree-to-linked-list",
        "title": "Flatten Binary Tree to Linked List",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/distribute-coins-in-binary-tree?list=am-300",
        "id": "distribute-coins-in-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/distribute-coins-in-binary-tree",
        "notesUrl": "",
        "slug": "distribute-coins-in-binary-tree",
        "solutionUrl": "/learn/dsa/distribute-coins-in-binary-tree",
        "title": "Distribute Coins in Binary Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/binary-tree-maximum-path-sum?list=am-300",
        "id": "binary-tree-maximum-path-sum",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-maximum-path-sum",
        "notesUrl": "",
        "slug": "binary-tree-maximum-path-sum",
        "solutionUrl": "/learn/dsa/binary-tree-maximum-path-sum",
        "title": "Binary Tree Maximum Path Sum",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      }
    ],
    "slug": "tree-traversal-post-order"
  },
  {
    "category": "BST / Ordered Set",
    "countText": "",
    "learnUrl": "/learn/dsa/bst-introduction",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 2,
        "href": "/practice/dsa/trim-a-binary-search-tree?list=am-300",
        "id": "trim-a-binary-search-tree",
        "leetcodeUrl": "https://leetcode.com/problems/trim-a-binary-search-tree",
        "notesUrl": "",
        "slug": "trim-a-binary-search-tree",
        "solutionUrl": "/learn/dsa/trim-a-binary-search-tree",
        "title": "Trim a Binary Search Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/my-calendar-i?list=am-300",
        "id": "my-calendar-i",
        "leetcodeUrl": "https://leetcode.com/problems/my-calendar-i",
        "notesUrl": "",
        "slug": "my-calendar-i",
        "solutionUrl": "/learn/dsa/my-calendar-i",
        "title": "My Calendar I",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/my-calendar-ii?list=am-300",
        "id": "my-calendar-ii",
        "leetcodeUrl": "https://leetcode.com/problems/my-calendar-ii",
        "notesUrl": "",
        "slug": "my-calendar-ii",
        "solutionUrl": "/learn/dsa/my-calendar-ii",
        "title": "My Calendar II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/stock-price-fluctuation?list=am-300",
        "id": "stock-price-fluctuation",
        "leetcodeUrl": "https://leetcode.com/problems/stock-price-fluctuation",
        "notesUrl": "",
        "slug": "stock-price-fluctuation",
        "solutionUrl": "/learn/dsa/stock-price-fluctuation",
        "title": "Stock Price Fluctuation",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      }
    ],
    "slug": "bst-ordered-set"
  },
  {
    "category": "Tries",
    "countText": "",
    "learnUrl": "/learn/dsa/tries-introduction",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/implement-trie-prefix-tree?list=am-300",
        "id": "implement-trie-prefix-tree",
        "leetcodeUrl": "https://leetcode.com/problems/implement-trie-prefix-tree",
        "notesUrl": "",
        "slug": "implement-trie-prefix-tree",
        "solutionUrl": "/learn/dsa/implement-trie-prefix-tree",
        "title": "Implement Trie (Prefix Tree)",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/design-add-and-search-words-data-structure?list=am-300",
        "id": "design-add-and-search-words-data-structure",
        "leetcodeUrl": "https://leetcode.com/problems/design-add-and-search-words-data-structure",
        "notesUrl": "",
        "slug": "design-add-and-search-words-data-structure",
        "solutionUrl": "/learn/dsa/design-add-and-search-words-data-structure",
        "title": "Design Add and Search Words Data Structure",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/search-suggestions-system?list=am-300",
        "id": "search-suggestions-system",
        "leetcodeUrl": "https://leetcode.com/problems/search-suggestions-system",
        "notesUrl": "",
        "slug": "search-suggestions-system",
        "solutionUrl": "/learn/dsa/search-suggestions-system",
        "title": "Search Suggestions System",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 1,
        "href": "/practice/dsa/longest-word-in-dictionary?list=am-300",
        "id": "longest-word-in-dictionary",
        "leetcodeUrl": "https://leetcode.com/problems/longest-word-in-dictionary",
        "notesUrl": "",
        "slug": "longest-word-in-dictionary",
        "solutionUrl": "/learn/dsa/longest-word-in-dictionary",
        "title": "Longest Word in Dictionary",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/maximum-xor-of-two-numbers-in-an-array?list=am-300",
        "id": "maximum-xor-of-two-numbers-in-an-array",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array",
        "notesUrl": "",
        "slug": "maximum-xor-of-two-numbers-in-an-array",
        "solutionUrl": "/learn/dsa/maximum-xor-of-two-numbers-in-an-array",
        "title": "Maximum XOR of Two Numbers in an Array",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/word-search-ii?list=am-300",
        "id": "word-search-ii",
        "leetcodeUrl": "https://leetcode.com/problems/word-search-ii",
        "notesUrl": "",
        "slug": "word-search-ii",
        "solutionUrl": "/learn/dsa/word-search-ii",
        "title": "Word Search II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      }
    ],
    "slug": "tries"
  },
  {
    "category": "Heaps",
    "countText": "",
    "learnUrl": "/learn/dsa/heaps-introduction",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/furthest-building-you-can-reach?list=am-300",
        "id": "furthest-building-you-can-reach",
        "leetcodeUrl": "https://leetcode.com/problems/furthest-building-you-can-reach",
        "notesUrl": "",
        "slug": "furthest-building-you-can-reach",
        "solutionUrl": "/learn/dsa/furthest-building-you-can-reach",
        "title": "Furthest Building You Can Reach",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/single-threaded-cpu?list=am-300",
        "id": "single-threaded-cpu",
        "leetcodeUrl": "https://leetcode.com/problems/single-threaded-cpu",
        "notesUrl": "",
        "slug": "single-threaded-cpu",
        "solutionUrl": "/learn/dsa/single-threaded-cpu",
        "title": "Single-Threaded CPU",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/process-tasks-using-servers?list=am-300",
        "id": "process-tasks-using-servers",
        "leetcodeUrl": "https://leetcode.com/problems/process-tasks-using-servers",
        "notesUrl": "",
        "slug": "process-tasks-using-servers",
        "solutionUrl": "/learn/dsa/process-tasks-using-servers",
        "title": "Process Tasks Using Servers",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "heaps"
  },
  {
    "category": "Two Heaps",
    "countText": "",
    "learnUrl": "https://emre.me/coding-patterns/two-heaps/",
    "problems": [
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/find-median-from-data-stream?list=am-300",
        "id": "find-median-from-data-stream",
        "leetcodeUrl": "https://leetcode.com/problems/find-median-from-data-stream",
        "notesUrl": "",
        "slug": "find-median-from-data-stream",
        "solutionUrl": "/learn/dsa/find-median-from-data-stream",
        "title": "Find Median from Data Stream",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/ipo?list=am-300",
        "id": "ipo",
        "leetcodeUrl": "https://leetcode.com/problems/ipo",
        "notesUrl": "",
        "slug": "ipo",
        "solutionUrl": "/learn/dsa/ipo",
        "title": "IPO",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/sliding-window-median?list=am-300",
        "id": "sliding-window-median",
        "leetcodeUrl": "https://leetcode.com/problems/sliding-window-median",
        "notesUrl": "",
        "slug": "sliding-window-median",
        "solutionUrl": "/learn/dsa/sliding-window-median",
        "title": "Sliding Window Median",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      }
    ],
    "slug": "two-heaps"
  },
  {
    "category": "Top K Elements",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=6_v6OoxvMOE&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/kth-largest-element-in-a-stream?list=am-300",
        "id": "kth-largest-element-in-a-stream",
        "leetcodeUrl": "https://leetcode.com/problems/kth-largest-element-in-a-stream",
        "notesUrl": "",
        "slug": "kth-largest-element-in-a-stream",
        "solutionUrl": "/learn/dsa/kth-largest-element-in-a-stream",
        "title": "Kth Largest Element in a Stream",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/top-k-frequent-elements?list=am-300",
        "id": "top-k-frequent-elements",
        "leetcodeUrl": "https://leetcode.com/problems/top-k-frequent-elements",
        "notesUrl": "",
        "slug": "top-k-frequent-elements",
        "solutionUrl": "/learn/dsa/top-k-frequent-elements",
        "title": "Top K Frequent Elements",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/k-closest-points-to-origin?list=am-300",
        "id": "k-closest-points-to-origin",
        "leetcodeUrl": "https://leetcode.com/problems/k-closest-points-to-origin",
        "notesUrl": "",
        "slug": "k-closest-points-to-origin",
        "solutionUrl": "/learn/dsa/k-closest-points-to-origin",
        "title": "K Closest Points to Origin",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      }
    ],
    "slug": "top-k-elements"
  },
  {
    "category": "Intervals",
    "countText": "",
    "learnUrl": "/learn/dsa/intervals-introduction",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/merge-intervals?list=am-300",
        "id": "merge-intervals",
        "leetcodeUrl": "https://leetcode.com/problems/merge-intervals",
        "notesUrl": "",
        "slug": "merge-intervals",
        "solutionUrl": "/learn/dsa/merge-intervals",
        "title": "Merge Intervals",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/insert-interval?list=am-300",
        "id": "insert-interval",
        "leetcodeUrl": "https://leetcode.com/problems/insert-interval",
        "notesUrl": "",
        "slug": "insert-interval",
        "solutionUrl": "/learn/dsa/insert-interval",
        "title": "Insert Interval",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/minimum-number-of-arrows-to-burst-balloons?list=am-300",
        "id": "minimum-number-of-arrows-to-burst-balloons",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons",
        "notesUrl": "",
        "slug": "minimum-number-of-arrows-to-burst-balloons",
        "solutionUrl": "/learn/dsa/minimum-number-of-arrows-to-burst-balloons",
        "title": "Minimum Number of Arrows to Burst Balloons",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/maximum-number-of-events-that-can-be-attended?list=am-300",
        "id": "maximum-number-of-events-that-can-be-attended",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended",
        "notesUrl": "",
        "slug": "maximum-number-of-events-that-can-be-attended",
        "solutionUrl": "/learn/dsa/maximum-number-of-events-that-can-be-attended",
        "title": "Maximum Number of Events That Can Be Attended",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/non-overlapping-intervals?list=am-300",
        "id": "non-overlapping-intervals",
        "leetcodeUrl": "https://leetcode.com/problems/non-overlapping-intervals",
        "notesUrl": "",
        "slug": "non-overlapping-intervals",
        "solutionUrl": "/learn/dsa/non-overlapping-intervals",
        "title": "Non-overlapping Intervals",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "intervals"
  },
  {
    "category": "K-Way Merge",
    "countText": "",
    "learnUrl": "/practice/dsa/find-k-pairs-with-smallest-sums?list=am-300",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/find-k-pairs-with-smallest-sums?list=am-300",
        "id": "find-k-pairs-with-smallest-sums",
        "leetcodeUrl": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums",
        "notesUrl": "",
        "slug": "find-k-pairs-with-smallest-sums",
        "solutionUrl": "/learn/dsa/find-k-pairs-with-smallest-sums",
        "title": "Find K Pairs with Smallest Sums",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/kth-smallest-element-in-a-sorted-matrix?list=am-300",
        "id": "kth-smallest-element-in-a-sorted-matrix",
        "leetcodeUrl": "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix",
        "notesUrl": "",
        "slug": "kth-smallest-element-in-a-sorted-matrix",
        "solutionUrl": "/learn/dsa/kth-smallest-element-in-a-sorted-matrix",
        "title": "Kth Smallest Element in a Sorted Matrix",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 5,
        "href": "/practice/dsa/merge-k-sorted-lists?list=am-300",
        "id": "merge-k-sorted-lists",
        "leetcodeUrl": "https://leetcode.com/problems/merge-k-sorted-lists",
        "notesUrl": "",
        "slug": "merge-k-sorted-lists",
        "solutionUrl": "/learn/dsa/merge-k-sorted-lists",
        "title": "Merge k Sorted Lists",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/smallest-range-covering-elements-from-k-lists?list=am-300",
        "id": "smallest-range-covering-elements-from-k-lists",
        "leetcodeUrl": "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists",
        "notesUrl": "",
        "slug": "smallest-range-covering-elements-from-k-lists",
        "solutionUrl": "/learn/dsa/smallest-range-covering-elements-from-k-lists",
        "title": "Smallest Range Covering Elements from K Lists",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "k-way-merge"
  },
  {
    "category": "Data Structure Design",
    "countText": "",
    "learnUrl": "/practice/dsa/design-browser-history?list=am-300",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/design-browser-history?list=am-300",
        "id": "design-browser-history",
        "leetcodeUrl": "https://leetcode.com/problems/design-browser-history",
        "notesUrl": "",
        "slug": "design-browser-history",
        "solutionUrl": "/learn/dsa/design-browser-history",
        "title": "Design Browser History",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/time-based-key-value-store?list=am-300",
        "id": "time-based-key-value-store",
        "leetcodeUrl": "https://leetcode.com/problems/time-based-key-value-store",
        "notesUrl": "",
        "slug": "time-based-key-value-store",
        "solutionUrl": "/learn/dsa/time-based-key-value-store",
        "title": "Time Based Key-Value Store",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/snapshot-array?list=am-300",
        "id": "snapshot-array",
        "leetcodeUrl": "https://leetcode.com/problems/snapshot-array",
        "notesUrl": "",
        "slug": "snapshot-array",
        "solutionUrl": "/learn/dsa/snapshot-array",
        "title": "Snapshot Array",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/design-twitter?list=am-300",
        "id": "design-twitter",
        "leetcodeUrl": "https://leetcode.com/problems/design-twitter",
        "notesUrl": "",
        "slug": "design-twitter",
        "solutionUrl": "/learn/dsa/design-twitter",
        "title": "Design Twitter",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/lru-cache?list=am-300",
        "id": "lru-cache",
        "leetcodeUrl": "https://leetcode.com/problems/lru-cache",
        "notesUrl": "",
        "slug": "lru-cache",
        "solutionUrl": "/learn/dsa/lru-cache",
        "title": "LRU Cache",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/insert-delete-getrandom-o1?list=am-300",
        "id": "insert-delete-getrandom-o1",
        "leetcodeUrl": "https://leetcode.com/problems/insert-delete-getrandom-o1",
        "notesUrl": "",
        "slug": "insert-delete-getrandom-o1",
        "solutionUrl": "/learn/dsa/insert-delete-getrandom-o1",
        "title": "Insert Delete GetRandom O(1)",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/design-a-food-rating-system?list=am-300",
        "id": "design-a-food-rating-system",
        "leetcodeUrl": "https://leetcode.com/problems/design-a-food-rating-system",
        "notesUrl": "",
        "slug": "design-a-food-rating-system",
        "solutionUrl": "/learn/dsa/design-a-food-rating-system",
        "title": "Design a Food Rating System",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/maximum-frequency-stack?list=am-300",
        "id": "maximum-frequency-stack",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-frequency-stack",
        "notesUrl": "",
        "slug": "maximum-frequency-stack",
        "solutionUrl": "/learn/dsa/maximum-frequency-stack",
        "title": "Maximum Frequency Stack",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "data-structure-design"
  },
  {
    "category": "Greedy",
    "countText": "",
    "learnUrl": "/learn/dsa/greedy-introduction",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/jump-game-ii?list=am-300",
        "id": "jump-game-ii",
        "leetcodeUrl": "https://leetcode.com/problems/jump-game-ii",
        "notesUrl": "",
        "slug": "jump-game-ii",
        "solutionUrl": "/learn/dsa/jump-game-ii",
        "title": "Jump Game II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/minimum-add-to-make-parentheses-valid?list=am-300",
        "id": "minimum-add-to-make-parentheses-valid",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid",
        "notesUrl": "",
        "slug": "minimum-add-to-make-parentheses-valid",
        "solutionUrl": "/learn/dsa/minimum-add-to-make-parentheses-valid",
        "title": "Minimum Add to Make Parentheses Valid",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/gas-station?list=am-300",
        "id": "gas-station",
        "leetcodeUrl": "https://leetcode.com/problems/gas-station",
        "notesUrl": "",
        "slug": "gas-station",
        "solutionUrl": "/learn/dsa/gas-station",
        "title": "Gas Station",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/task-scheduler?list=am-300",
        "id": "task-scheduler",
        "leetcodeUrl": "https://leetcode.com/problems/task-scheduler",
        "notesUrl": "",
        "slug": "task-scheduler",
        "solutionUrl": "/learn/dsa/task-scheduler",
        "title": "Task Scheduler",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 1,
        "href": "/practice/dsa/minimum-cost-to-hire-k-workers?list=am-300",
        "id": "minimum-cost-to-hire-k-workers",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-cost-to-hire-k-workers",
        "notesUrl": "",
        "slug": "minimum-cost-to-hire-k-workers",
        "solutionUrl": "/learn/dsa/minimum-cost-to-hire-k-workers",
        "title": "Minimum Cost to Hire K Workers",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/candy?list=am-300",
        "id": "candy",
        "leetcodeUrl": "https://leetcode.com/problems/candy",
        "notesUrl": "",
        "slug": "candy",
        "solutionUrl": "/learn/dsa/candy",
        "title": "Candy",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/minimum-number-of-refueling-stops?list=am-300",
        "id": "minimum-number-of-refueling-stops",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-number-of-refueling-stops",
        "notesUrl": "",
        "slug": "minimum-number-of-refueling-stops",
        "solutionUrl": "/learn/dsa/minimum-number-of-refueling-stops",
        "title": "Minimum Number of Refueling Stops",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      }
    ],
    "slug": "greedy"
  },
  {
    "category": "Depth First Search (DFS)",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=7fujbpJ0LB4",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/number-of-islands?list=am-300",
        "id": "number-of-islands",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-islands",
        "notesUrl": "",
        "slug": "number-of-islands",
        "solutionUrl": "/learn/dsa/number-of-islands",
        "title": "Number of Islands",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 2,
        "href": "/practice/dsa/time-needed-to-inform-all-employees?list=am-300",
        "id": "time-needed-to-inform-all-employees",
        "leetcodeUrl": "https://leetcode.com/problems/time-needed-to-inform-all-employees",
        "notesUrl": "",
        "slug": "time-needed-to-inform-all-employees",
        "solutionUrl": "/learn/dsa/time-needed-to-inform-all-employees",
        "title": "Time Needed to Inform All Employees",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/all-paths-from-source-to-target?list=am-300",
        "id": "all-paths-from-source-to-target",
        "leetcodeUrl": "https://leetcode.com/problems/all-paths-from-source-to-target",
        "notesUrl": "",
        "slug": "all-paths-from-source-to-target",
        "solutionUrl": "/learn/dsa/all-paths-from-source-to-target",
        "title": "All Paths From Source to Target",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/clone-graph?list=am-300",
        "id": "clone-graph",
        "leetcodeUrl": "https://leetcode.com/problems/clone-graph",
        "notesUrl": "",
        "slug": "clone-graph",
        "solutionUrl": "/learn/dsa/clone-graph",
        "title": "Clone Graph",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/is-graph-bipartite?list=am-300",
        "id": "is-graph-bipartite",
        "leetcodeUrl": "https://leetcode.com/problems/is-graph-bipartite",
        "notesUrl": "",
        "slug": "is-graph-bipartite",
        "solutionUrl": "/learn/dsa/is-graph-bipartite",
        "title": "Is Graph Bipartite?",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/all-nodes-distance-k-in-binary-tree?list=am-300",
        "id": "all-nodes-distance-k-in-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree",
        "notesUrl": "",
        "slug": "all-nodes-distance-k-in-binary-tree",
        "solutionUrl": "/learn/dsa/all-nodes-distance-k-in-binary-tree",
        "title": "All Nodes Distance K in Binary Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/employee-importance?list=am-300",
        "id": "employee-importance",
        "leetcodeUrl": "https://leetcode.com/problems/employee-importance",
        "notesUrl": "",
        "slug": "employee-importance",
        "solutionUrl": "/learn/dsa/employee-importance",
        "title": "Employee Importance",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/surrounded-regions?list=am-300",
        "id": "surrounded-regions",
        "leetcodeUrl": "https://leetcode.com/problems/surrounded-regions",
        "notesUrl": "",
        "slug": "surrounded-regions",
        "solutionUrl": "/learn/dsa/surrounded-regions",
        "title": "Surrounded Regions",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/pacific-atlantic-water-flow?list=am-300",
        "id": "pacific-atlantic-water-flow",
        "leetcodeUrl": "https://leetcode.com/problems/pacific-atlantic-water-flow",
        "notesUrl": "",
        "slug": "pacific-atlantic-water-flow",
        "solutionUrl": "/learn/dsa/pacific-atlantic-water-flow",
        "title": "Pacific Atlantic Water Flow",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 5,
        "href": "/practice/dsa/making-a-large-island?list=am-300",
        "id": "making-a-large-island",
        "leetcodeUrl": "https://leetcode.com/problems/making-a-large-island",
        "notesUrl": "",
        "slug": "making-a-large-island",
        "solutionUrl": "/learn/dsa/making-a-large-island",
        "title": "Making A Large Island",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      }
    ],
    "slug": "depth-first-search-dfs-"
  },
  {
    "category": "Breadth First Search (BFS)",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=oDqjPvD54Ss",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 5,
        "href": "/practice/dsa/rotting-oranges?list=am-300",
        "id": "rotting-oranges",
        "leetcodeUrl": "https://leetcode.com/problems/rotting-oranges",
        "notesUrl": "",
        "slug": "rotting-oranges",
        "solutionUrl": "/learn/dsa/rotting-oranges",
        "title": "Rotting Oranges",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150",
          "am_75"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/01-matrix?list=am-300",
        "id": "01-matrix",
        "leetcodeUrl": "https://leetcode.com/problems/01-matrix",
        "notesUrl": "",
        "slug": "01-matrix",
        "solutionUrl": "/learn/dsa/01-matrix",
        "title": "01 Matrix",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/open-the-lock?list=am-300",
        "id": "open-the-lock",
        "leetcodeUrl": "https://leetcode.com/problems/open-the-lock",
        "notesUrl": "",
        "slug": "open-the-lock",
        "solutionUrl": "/learn/dsa/open-the-lock",
        "title": "Open the Lock",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/shortest-path-in-a-grid-with-obstacles-elimination?list=am-300",
        "id": "shortest-path-in-a-grid-with-obstacles-elimination",
        "leetcodeUrl": "https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination",
        "notesUrl": "",
        "slug": "shortest-path-in-a-grid-with-obstacles-elimination",
        "solutionUrl": "/learn/dsa/shortest-path-in-a-grid-with-obstacles-elimination",
        "title": "Shortest Path in a Grid with Obstacles Elimination",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/bus-routes?list=am-300",
        "id": "bus-routes",
        "leetcodeUrl": "https://leetcode.com/problems/bus-routes",
        "notesUrl": "",
        "slug": "bus-routes",
        "solutionUrl": "/learn/dsa/bus-routes",
        "title": "Bus Routes",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 4,
        "href": "/practice/dsa/word-ladder?list=am-300",
        "id": "word-ladder",
        "leetcodeUrl": "https://leetcode.com/problems/word-ladder",
        "notesUrl": "",
        "slug": "word-ladder",
        "solutionUrl": "/learn/dsa/word-ladder",
        "title": "Word Ladder",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      }
    ],
    "slug": "breadth-first-search-bfs-"
  },
  {
    "category": "Topological Sort",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=eL-KzMXSXXI",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 4,
        "href": "/practice/dsa/course-schedule-ii?list=am-300",
        "id": "course-schedule-ii",
        "leetcodeUrl": "https://leetcode.com/problems/course-schedule-ii",
        "notesUrl": "",
        "slug": "course-schedule-ii",
        "solutionUrl": "/learn/dsa/course-schedule-ii",
        "title": "Course Schedule II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600",
          "am_150"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/find-eventual-safe-states?list=am-300",
        "id": "find-eventual-safe-states",
        "leetcodeUrl": "https://leetcode.com/problems/find-eventual-safe-states",
        "notesUrl": "",
        "slug": "find-eventual-safe-states",
        "solutionUrl": "/learn/dsa/find-eventual-safe-states",
        "title": "Find Eventual Safe States",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 2,
        "href": "/practice/dsa/minimum-height-trees?list=am-300",
        "id": "minimum-height-trees",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-height-trees",
        "notesUrl": "",
        "slug": "minimum-height-trees",
        "solutionUrl": "/learn/dsa/minimum-height-trees",
        "title": "Minimum Height Trees",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 2,
        "href": "/practice/dsa/sort-items-by-groups-respecting-dependencies?list=am-300",
        "id": "sort-items-by-groups-respecting-dependencies",
        "leetcodeUrl": "https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies",
        "notesUrl": "",
        "slug": "sort-items-by-groups-respecting-dependencies",
        "solutionUrl": "/learn/dsa/sort-items-by-groups-respecting-dependencies",
        "title": "Sort Items by Groups Respecting Dependencies",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "topological-sort"
  },
  {
    "category": "Union Find",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=ibjEGG7ylHk&list=PLDV1Zeh2NRsBI1C-mR6ZhHTyfoEJWlxvq",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/number-of-provinces?list=am-300",
        "id": "number-of-provinces",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-provinces",
        "notesUrl": "",
        "slug": "number-of-provinces",
        "solutionUrl": "/learn/dsa/number-of-provinces",
        "title": "Number of Provinces",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/redundant-connection?list=am-300",
        "id": "redundant-connection",
        "leetcodeUrl": "https://leetcode.com/problems/redundant-connection",
        "notesUrl": "",
        "slug": "redundant-connection",
        "solutionUrl": "/learn/dsa/redundant-connection",
        "title": "Redundant Connection",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/accounts-merge?list=am-300",
        "id": "accounts-merge",
        "leetcodeUrl": "https://leetcode.com/problems/accounts-merge",
        "notesUrl": "",
        "slug": "accounts-merge",
        "solutionUrl": "/learn/dsa/accounts-merge",
        "title": "Accounts Merge",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/minimize-malware-spread?list=am-300",
        "id": "minimize-malware-spread",
        "leetcodeUrl": "https://leetcode.com/problems/minimize-malware-spread",
        "notesUrl": "",
        "slug": "minimize-malware-spread",
        "solutionUrl": "/learn/dsa/minimize-malware-spread",
        "title": "Minimize Malware Spread",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "union-find"
  },
  {
    "category": "Minimum Spanning Tree",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=4ZlRH0eK-qQ",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/min-cost-to-connect-all-points?list=am-300",
        "id": "min-cost-to-connect-all-points",
        "leetcodeUrl": "https://leetcode.com/problems/min-cost-to-connect-all-points",
        "notesUrl": "",
        "slug": "min-cost-to-connect-all-points",
        "solutionUrl": "/learn/dsa/min-cost-to-connect-all-points",
        "title": "Min Cost to Connect All Points",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "minimum-spanning-tree"
  },
  {
    "category": "Shortest Path",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=j0OUwduDOS0",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/network-delay-time?list=am-300",
        "id": "network-delay-time",
        "leetcodeUrl": "https://leetcode.com/problems/network-delay-time",
        "notesUrl": "",
        "slug": "network-delay-time",
        "solutionUrl": "/learn/dsa/network-delay-time",
        "title": "Network Delay Time",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/cheapest-flights-within-k-stops?list=am-300",
        "id": "cheapest-flights-within-k-stops",
        "leetcodeUrl": "https://leetcode.com/problems/cheapest-flights-within-k-stops",
        "notesUrl": "",
        "slug": "cheapest-flights-within-k-stops",
        "solutionUrl": "/learn/dsa/cheapest-flights-within-k-stops",
        "title": "Cheapest Flights Within K Stops",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/path-with-maximum-probability?list=am-300",
        "id": "path-with-maximum-probability",
        "leetcodeUrl": "https://leetcode.com/problems/path-with-maximum-probability",
        "notesUrl": "",
        "slug": "path-with-maximum-probability",
        "solutionUrl": "/learn/dsa/path-with-maximum-probability",
        "title": "Path with Maximum Probability",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/path-with-minimum-effort?list=am-300",
        "id": "path-with-minimum-effort",
        "leetcodeUrl": "https://leetcode.com/problems/path-with-minimum-effort",
        "notesUrl": "",
        "slug": "path-with-minimum-effort",
        "solutionUrl": "/learn/dsa/path-with-minimum-effort",
        "title": "Path With Minimum Effort",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/swim-in-rising-water?list=am-300",
        "id": "swim-in-rising-water",
        "leetcodeUrl": "https://leetcode.com/problems/swim-in-rising-water",
        "notesUrl": "",
        "slug": "swim-in-rising-water",
        "solutionUrl": "/learn/dsa/swim-in-rising-water",
        "title": "Swim in Rising Water",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "shortest-path"
  },
  {
    "category": "Eulerian Circuit",
    "countText": "",
    "learnUrl": "/practice/dsa/reconstruct-itinerary?list=am-300",
    "problems": [
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/reconstruct-itinerary?list=am-300",
        "id": "reconstruct-itinerary",
        "leetcodeUrl": "https://leetcode.com/problems/reconstruct-itinerary",
        "notesUrl": "",
        "slug": "reconstruct-itinerary",
        "solutionUrl": "/learn/dsa/reconstruct-itinerary",
        "title": "Reconstruct Itinerary",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/cracking-the-safe?list=am-300",
        "id": "cracking-the-safe",
        "leetcodeUrl": "https://leetcode.com/problems/cracking-the-safe",
        "notesUrl": "",
        "slug": "cracking-the-safe",
        "solutionUrl": "/learn/dsa/cracking-the-safe",
        "title": "Cracking the Safe",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "eulerian-circuit"
  },
  {
    "category": "1-D DP",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=_i4Yxeh5ceQ",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/climbing-stairs?list=am-300",
        "id": "climbing-stairs",
        "leetcodeUrl": "https://leetcode.com/problems/climbing-stairs",
        "notesUrl": "",
        "slug": "climbing-stairs",
        "solutionUrl": "/learn/dsa/climbing-stairs",
        "title": "Climbing Stairs",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/min-cost-climbing-stairs?list=am-300",
        "id": "min-cost-climbing-stairs",
        "leetcodeUrl": "https://leetcode.com/problems/min-cost-climbing-stairs",
        "notesUrl": "",
        "slug": "min-cost-climbing-stairs",
        "solutionUrl": "/learn/dsa/min-cost-climbing-stairs",
        "title": "Min Cost Climbing Stairs",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/house-robber?list=am-300",
        "id": "house-robber",
        "leetcodeUrl": "https://leetcode.com/problems/house-robber",
        "notesUrl": "",
        "slug": "house-robber",
        "solutionUrl": "/learn/dsa/house-robber",
        "title": "House Robber",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/house-robber-ii?list=am-300",
        "id": "house-robber-ii",
        "leetcodeUrl": "https://leetcode.com/problems/house-robber-ii",
        "notesUrl": "",
        "slug": "house-robber-ii",
        "solutionUrl": "/learn/dsa/house-robber-ii",
        "title": "House Robber II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "1-d-dp"
  },
  {
    "category": "0/1 Knapsack",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=cJ21moQpofY",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/partition-equal-subset-sum?list=am-300",
        "id": "partition-equal-subset-sum",
        "leetcodeUrl": "https://leetcode.com/problems/partition-equal-subset-sum",
        "notesUrl": "",
        "slug": "partition-equal-subset-sum",
        "solutionUrl": "/learn/dsa/partition-equal-subset-sum",
        "title": "Partition Equal Subset Sum",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/target-sum?list=am-300",
        "id": "target-sum",
        "leetcodeUrl": "https://leetcode.com/problems/target-sum",
        "notesUrl": "",
        "slug": "target-sum",
        "solutionUrl": "/learn/dsa/target-sum",
        "title": "Target Sum",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/last-stone-weight-ii?list=am-300",
        "id": "last-stone-weight-ii",
        "leetcodeUrl": "https://leetcode.com/problems/last-stone-weight-ii",
        "notesUrl": "",
        "slug": "last-stone-weight-ii",
        "solutionUrl": "/learn/dsa/last-stone-weight-ii",
        "title": "Last Stone Weight II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "0-1-knapsack"
  },
  {
    "category": "Unbounded Knapsack",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=OgvOZ6OrJoY",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/coin-change?list=am-300",
        "id": "coin-change",
        "leetcodeUrl": "https://leetcode.com/problems/coin-change",
        "notesUrl": "",
        "slug": "coin-change",
        "solutionUrl": "/learn/dsa/coin-change",
        "title": "Coin Change",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/coin-change-ii?list=am-300",
        "id": "coin-change-ii",
        "leetcodeUrl": "https://leetcode.com/problems/coin-change-ii",
        "notesUrl": "",
        "slug": "coin-change-ii",
        "solutionUrl": "/learn/dsa/coin-change-ii",
        "title": "Coin Change II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/perfect-squares?list=am-300",
        "id": "perfect-squares",
        "leetcodeUrl": "https://leetcode.com/problems/perfect-squares",
        "notesUrl": "",
        "slug": "perfect-squares",
        "solutionUrl": "/learn/dsa/perfect-squares",
        "title": "Perfect Squares",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "unbounded-knapsack"
  },
  {
    "category": "Longest Increasing Subsequence (LIS)",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=cjWnW0hdF1Y",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/longest-increasing-subsequence?list=am-300",
        "id": "longest-increasing-subsequence",
        "leetcodeUrl": "https://leetcode.com/problems/longest-increasing-subsequence",
        "notesUrl": "",
        "slug": "longest-increasing-subsequence",
        "solutionUrl": "/learn/dsa/longest-increasing-subsequence",
        "title": "Longest Increasing Subsequence",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/number-of-longest-increasing-subsequence?list=am-300",
        "id": "number-of-longest-increasing-subsequence",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-longest-increasing-subsequence",
        "notesUrl": "",
        "slug": "number-of-longest-increasing-subsequence",
        "solutionUrl": "/learn/dsa/number-of-longest-increasing-subsequence",
        "title": "Number of Longest Increasing Subsequence",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/russian-doll-envelopes?list=am-300",
        "id": "russian-doll-envelopes",
        "leetcodeUrl": "https://leetcode.com/problems/russian-doll-envelopes",
        "notesUrl": "",
        "slug": "russian-doll-envelopes",
        "solutionUrl": "/learn/dsa/russian-doll-envelopes",
        "title": "Russian Doll Envelopes",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "longest-increasing-subsequence-lis-"
  },
  {
    "category": "2D Grid DP",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=qMky6D6YtXU",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/unique-paths-ii?list=am-300",
        "id": "unique-paths-ii",
        "leetcodeUrl": "https://leetcode.com/problems/unique-paths-ii",
        "notesUrl": "",
        "slug": "unique-paths-ii",
        "solutionUrl": "/learn/dsa/unique-paths-ii",
        "title": "Unique Paths II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/minimum-path-sum?list=am-300",
        "id": "minimum-path-sum",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-path-sum",
        "notesUrl": "",
        "slug": "minimum-path-sum",
        "solutionUrl": "/learn/dsa/minimum-path-sum",
        "title": "Minimum Path Sum",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/triangle?list=am-300",
        "id": "triangle",
        "leetcodeUrl": "https://leetcode.com/problems/triangle",
        "notesUrl": "",
        "slug": "triangle",
        "solutionUrl": "/learn/dsa/triangle",
        "title": "Triangle",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/count-square-submatrices-with-all-ones?list=am-300",
        "id": "count-square-submatrices-with-all-ones",
        "leetcodeUrl": "https://leetcode.com/problems/count-square-submatrices-with-all-ones",
        "notesUrl": "",
        "slug": "count-square-submatrices-with-all-ones",
        "solutionUrl": "/learn/dsa/count-square-submatrices-with-all-ones",
        "title": "Count Square Submatrices with All Ones",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/maximum-number-of-points-with-cost?list=am-300",
        "id": "maximum-number-of-points-with-cost",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-number-of-points-with-cost",
        "notesUrl": "",
        "slug": "maximum-number-of-points-with-cost",
        "solutionUrl": "/learn/dsa/maximum-number-of-points-with-cost",
        "title": "Maximum Number of Points with Cost",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/maximum-profit-in-job-scheduling?list=am-300",
        "id": "maximum-profit-in-job-scheduling",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-profit-in-job-scheduling",
        "notesUrl": "",
        "slug": "maximum-profit-in-job-scheduling",
        "solutionUrl": "/learn/dsa/maximum-profit-in-job-scheduling",
        "title": "Maximum Profit in Job Scheduling",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/burst-balloons?list=am-300",
        "id": "burst-balloons",
        "leetcodeUrl": "https://leetcode.com/problems/burst-balloons",
        "notesUrl": "",
        "slug": "burst-balloons",
        "solutionUrl": "/learn/dsa/burst-balloons",
        "title": "Burst Balloons",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/cherry-pickup?list=am-300",
        "id": "cherry-pickup",
        "leetcodeUrl": "https://leetcode.com/problems/cherry-pickup",
        "notesUrl": "",
        "slug": "cherry-pickup",
        "solutionUrl": "/learn/dsa/cherry-pickup",
        "title": "Cherry Pickup",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/longest-increasing-path-in-a-matrix?list=am-300",
        "id": "longest-increasing-path-in-a-matrix",
        "leetcodeUrl": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix",
        "notesUrl": "",
        "slug": "longest-increasing-path-in-a-matrix",
        "solutionUrl": "/learn/dsa/longest-increasing-path-in-a-matrix",
        "title": "Longest Increasing Path in a Matrix",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "2d-grid-dp"
  },
  {
    "category": "String DP",
    "countText": "",
    "learnUrl": "/practice/dsa/longest-common-subsequence?list=am-300",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/longest-common-subsequence?list=am-300",
        "id": "longest-common-subsequence",
        "leetcodeUrl": "https://leetcode.com/problems/longest-common-subsequence",
        "notesUrl": "",
        "slug": "longest-common-subsequence",
        "solutionUrl": "/learn/dsa/longest-common-subsequence",
        "title": "Longest Common Subsequence",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/longest-palindromic-subsequence?list=am-300",
        "id": "longest-palindromic-subsequence",
        "leetcodeUrl": "https://leetcode.com/problems/longest-palindromic-subsequence",
        "notesUrl": "",
        "slug": "longest-palindromic-subsequence",
        "solutionUrl": "/learn/dsa/longest-palindromic-subsequence",
        "title": "Longest Palindromic Subsequence",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/edit-distance?list=am-300",
        "id": "edit-distance",
        "leetcodeUrl": "https://leetcode.com/problems/edit-distance",
        "notesUrl": "",
        "slug": "edit-distance",
        "solutionUrl": "/learn/dsa/edit-distance",
        "title": "Edit Distance",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/decode-ways?list=am-300",
        "id": "decode-ways",
        "leetcodeUrl": "https://leetcode.com/problems/decode-ways",
        "notesUrl": "",
        "slug": "decode-ways",
        "solutionUrl": "/learn/dsa/decode-ways",
        "title": "Decode Ways",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/word-break?list=am-300",
        "id": "word-break",
        "leetcodeUrl": "https://leetcode.com/problems/word-break",
        "notesUrl": "",
        "slug": "word-break",
        "solutionUrl": "/learn/dsa/word-break",
        "title": "Word Break",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/interleaving-string?list=am-300",
        "id": "interleaving-string",
        "leetcodeUrl": "https://leetcode.com/problems/interleaving-string",
        "notesUrl": "",
        "slug": "interleaving-string",
        "solutionUrl": "/learn/dsa/interleaving-string",
        "title": "Interleaving String",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/wildcard-matching?list=am-300",
        "id": "wildcard-matching",
        "leetcodeUrl": "https://leetcode.com/problems/wildcard-matching",
        "notesUrl": "",
        "slug": "wildcard-matching",
        "solutionUrl": "/learn/dsa/wildcard-matching",
        "title": "Wildcard Matching",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/distinct-subsequences?list=am-300",
        "id": "distinct-subsequences",
        "leetcodeUrl": "https://leetcode.com/problems/distinct-subsequences",
        "notesUrl": "",
        "slug": "distinct-subsequences",
        "solutionUrl": "/learn/dsa/distinct-subsequences",
        "title": "Distinct Subsequences",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/palindrome-partitioning-ii?list=am-300",
        "id": "palindrome-partitioning-ii",
        "leetcodeUrl": "https://leetcode.com/problems/palindrome-partitioning-ii",
        "notesUrl": "",
        "slug": "palindrome-partitioning-ii",
        "solutionUrl": "/learn/dsa/palindrome-partitioning-ii",
        "title": "Palindrome Partitioning II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "string-dp"
  },
  {
    "category": "Tree / Graph DP",
    "countText": "",
    "learnUrl": "/practice/dsa/house-robber-iii?list=am-300",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/house-robber-iii?list=am-300",
        "id": "house-robber-iii",
        "leetcodeUrl": "https://leetcode.com/problems/house-robber-iii",
        "notesUrl": "",
        "slug": "house-robber-iii",
        "solutionUrl": "/learn/dsa/house-robber-iii",
        "title": "House Robber III",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/unique-binary-search-trees-ii?list=am-300",
        "id": "unique-binary-search-trees-ii",
        "leetcodeUrl": "https://leetcode.com/problems/unique-binary-search-trees-ii",
        "notesUrl": "",
        "slug": "unique-binary-search-trees-ii",
        "solutionUrl": "/learn/dsa/unique-binary-search-trees-ii",
        "title": "Unique Binary Search Trees II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/number-of-ways-to-arrive-at-destination?list=am-300",
        "id": "number-of-ways-to-arrive-at-destination",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-ways-to-arrive-at-destination",
        "notesUrl": "",
        "slug": "number-of-ways-to-arrive-at-destination",
        "solutionUrl": "/learn/dsa/number-of-ways-to-arrive-at-destination",
        "title": "Number of Ways to Arrive at Destination",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/binary-tree-cameras?list=am-300",
        "id": "binary-tree-cameras",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-cameras",
        "notesUrl": "",
        "slug": "binary-tree-cameras",
        "solutionUrl": "/learn/dsa/binary-tree-cameras",
        "title": "Binary Tree Cameras",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/sum-of-distances-in-tree?list=am-300",
        "id": "sum-of-distances-in-tree",
        "leetcodeUrl": "https://leetcode.com/problems/sum-of-distances-in-tree",
        "notesUrl": "",
        "slug": "sum-of-distances-in-tree",
        "solutionUrl": "/learn/dsa/sum-of-distances-in-tree",
        "title": "Sum of Distances in Tree",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "tree-graph-dp"
  },
  {
    "category": "Bitmask DP",
    "countText": "",
    "learnUrl": "https://www.hackerearth.com/practice/algorithms/dynamic-programming/bit-masking/tutorial/",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/minimum-number-of-work-sessions-to-finish-the-tasks?list=am-300",
        "id": "minimum-number-of-work-sessions-to-finish-the-tasks",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks",
        "notesUrl": "",
        "slug": "minimum-number-of-work-sessions-to-finish-the-tasks",
        "solutionUrl": "/learn/dsa/minimum-number-of-work-sessions-to-finish-the-tasks",
        "title": "Minimum Number of Work Sessions to Finish the Tasks",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/fair-distribution-of-cookies?list=am-300",
        "id": "fair-distribution-of-cookies",
        "leetcodeUrl": "https://leetcode.com/problems/fair-distribution-of-cookies",
        "notesUrl": "",
        "slug": "fair-distribution-of-cookies",
        "solutionUrl": "/learn/dsa/fair-distribution-of-cookies",
        "title": "Fair Distribution of Cookies",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/shortest-path-visiting-all-nodes?list=am-300",
        "id": "shortest-path-visiting-all-nodes",
        "leetcodeUrl": "https://leetcode.com/problems/shortest-path-visiting-all-nodes",
        "notesUrl": "",
        "slug": "shortest-path-visiting-all-nodes",
        "solutionUrl": "/learn/dsa/shortest-path-visiting-all-nodes",
        "title": "Shortest Path Visiting All Nodes",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "bitmask-dp"
  },
  {
    "category": "Digit DP",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=heUFId6Qd1A",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/count-numbers-with-unique-digits?list=am-300",
        "id": "count-numbers-with-unique-digits",
        "leetcodeUrl": "https://leetcode.com/problems/count-numbers-with-unique-digits",
        "notesUrl": "",
        "slug": "count-numbers-with-unique-digits",
        "solutionUrl": "/learn/dsa/count-numbers-with-unique-digits",
        "title": "Count Numbers with Unique Digits",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/number-of-digit-one?list=am-300",
        "id": "number-of-digit-one",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-digit-one",
        "notesUrl": "",
        "slug": "number-of-digit-one",
        "solutionUrl": "/learn/dsa/number-of-digit-one",
        "title": "Number of Digit One",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/numbers-at-most-n-given-digit-set?list=am-300",
        "id": "numbers-at-most-n-given-digit-set",
        "leetcodeUrl": "https://leetcode.com/problems/numbers-at-most-n-given-digit-set",
        "notesUrl": "",
        "slug": "numbers-at-most-n-given-digit-set",
        "solutionUrl": "/learn/dsa/numbers-at-most-n-given-digit-set",
        "title": "Numbers At Most N Given Digit Set",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "digit-dp"
  },
  {
    "category": "Probability DP",
    "countText": "",
    "learnUrl": "/practice/dsa/knight-probability-in-chessboard?list=am-300",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/knight-probability-in-chessboard?list=am-300",
        "id": "knight-probability-in-chessboard",
        "leetcodeUrl": "https://leetcode.com/problems/knight-probability-in-chessboard",
        "notesUrl": "",
        "slug": "knight-probability-in-chessboard",
        "solutionUrl": "/learn/dsa/knight-probability-in-chessboard",
        "title": "Knight Probability in Chessboard",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/soup-servings?list=am-300",
        "id": "soup-servings",
        "leetcodeUrl": "https://leetcode.com/problems/soup-servings",
        "notesUrl": "",
        "slug": "soup-servings",
        "solutionUrl": "/learn/dsa/soup-servings",
        "title": "Soup Servings",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/new-21-game?list=am-300",
        "id": "new-21-game",
        "leetcodeUrl": "https://leetcode.com/problems/new-21-game",
        "notesUrl": "",
        "slug": "new-21-game",
        "solutionUrl": "/learn/dsa/new-21-game",
        "title": "New 21 Game",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "probability-dp"
  },
  {
    "category": "State Machine DP",
    "countText": "",
    "learnUrl": "/practice/dsa/best-time-to-buy-and-sell-stock-with-cooldown?list=am-300",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/best-time-to-buy-and-sell-stock-with-cooldown?list=am-300",
        "id": "best-time-to-buy-and-sell-stock-with-cooldown",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown",
        "notesUrl": "",
        "slug": "best-time-to-buy-and-sell-stock-with-cooldown",
        "solutionUrl": "/learn/dsa/best-time-to-buy-and-sell-stock-with-cooldown",
        "title": "Best Time to Buy and Sell Stock with Cooldown",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/best-time-to-buy-and-sell-stock-iii?list=am-300",
        "id": "best-time-to-buy-and-sell-stock-iii",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii",
        "notesUrl": "",
        "slug": "best-time-to-buy-and-sell-stock-iii",
        "solutionUrl": "/learn/dsa/best-time-to-buy-and-sell-stock-iii",
        "title": "Best Time to Buy and Sell Stock III",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "state-machine-dp"
  },
  {
    "category": "Maths / Geometry",
    "countText": "",
    "learnUrl": "/practice/dsa/palindrome-number?list=am-300",
    "problems": [
      {
        "difficulty": "Easy",
        "frequency": 3,
        "href": "/practice/dsa/palindrome-number?list=am-300",
        "id": "palindrome-number",
        "leetcodeUrl": "https://leetcode.com/problems/palindrome-number",
        "notesUrl": "",
        "slug": "palindrome-number",
        "solutionUrl": "/learn/dsa/palindrome-number",
        "title": "Palindrome Number",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/reverse-integer?list=am-300",
        "id": "reverse-integer",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-integer",
        "notesUrl": "",
        "slug": "reverse-integer",
        "solutionUrl": "/learn/dsa/reverse-integer",
        "title": "Reverse Integer",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/factorial-trailing-zeroes?list=am-300",
        "id": "factorial-trailing-zeroes",
        "leetcodeUrl": "https://leetcode.com/problems/factorial-trailing-zeroes",
        "notesUrl": "",
        "slug": "factorial-trailing-zeroes",
        "solutionUrl": "/learn/dsa/factorial-trailing-zeroes",
        "title": "Factorial Trailing Zeroes",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/valid-square?list=am-300",
        "id": "valid-square",
        "leetcodeUrl": "https://leetcode.com/problems/valid-square",
        "notesUrl": "",
        "slug": "valid-square",
        "solutionUrl": "/learn/dsa/valid-square",
        "title": "Valid Square",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/minimum-area-rectangle-ii?list=am-300",
        "id": "minimum-area-rectangle-ii",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-area-rectangle-ii",
        "notesUrl": "",
        "slug": "minimum-area-rectangle-ii",
        "solutionUrl": "/learn/dsa/minimum-area-rectangle-ii",
        "title": "Minimum Area Rectangle II",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/max-points-on-a-line?list=am-300",
        "id": "max-points-on-a-line",
        "leetcodeUrl": "https://leetcode.com/problems/max-points-on-a-line",
        "notesUrl": "",
        "slug": "max-points-on-a-line",
        "solutionUrl": "/learn/dsa/max-points-on-a-line",
        "title": "Max Points on a Line",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "maths-geometry"
  },
  {
    "category": "String Matching",
    "countText": "",
    "learnUrl": "https://www.youtube.com/watch?v=V5-7GzOfADQ",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/repeated-string-match?list=am-300",
        "id": "repeated-string-match",
        "leetcodeUrl": "https://leetcode.com/problems/repeated-string-match",
        "notesUrl": "",
        "slug": "repeated-string-match",
        "solutionUrl": "/learn/dsa/repeated-string-match",
        "title": "Repeated String Match",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/shortest-palindrome?list=am-300",
        "id": "shortest-palindrome",
        "leetcodeUrl": "https://leetcode.com/problems/shortest-palindrome",
        "notesUrl": "",
        "slug": "shortest-palindrome",
        "solutionUrl": "/learn/dsa/shortest-palindrome",
        "title": "Shortest Palindrome",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/longest-duplicate-substring?list=am-300",
        "id": "longest-duplicate-substring",
        "leetcodeUrl": "https://leetcode.com/problems/longest-duplicate-substring",
        "notesUrl": "",
        "slug": "longest-duplicate-substring",
        "solutionUrl": "/learn/dsa/longest-duplicate-substring",
        "title": "Longest Duplicate Substring",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "string-matching"
  },
  {
    "category": "Binary Indexed Tree / Segment Tree",
    "countText": "",
    "learnUrl": "/practice/dsa/range-sum-query-mutable?list=am-300",
    "problems": [
      {
        "difficulty": "Medium",
        "frequency": 3,
        "href": "/practice/dsa/range-sum-query-mutable?list=am-300",
        "id": "range-sum-query-mutable",
        "leetcodeUrl": "https://leetcode.com/problems/range-sum-query-mutable",
        "notesUrl": "",
        "slug": "range-sum-query-mutable",
        "solutionUrl": "/learn/dsa/range-sum-query-mutable",
        "title": "Range Sum Query - Mutable",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/count-of-smaller-numbers-after-self?list=am-300",
        "id": "count-of-smaller-numbers-after-self",
        "leetcodeUrl": "https://leetcode.com/problems/count-of-smaller-numbers-after-self",
        "notesUrl": "",
        "slug": "count-of-smaller-numbers-after-self",
        "solutionUrl": "/learn/dsa/count-of-smaller-numbers-after-self",
        "title": "Count of Smaller Numbers After Self",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "binary-indexed-tree-segment-tree"
  },
  {
    "category": "Line Sweep",
    "countText": "",
    "learnUrl": "/practice/dsa/minimum-interval-to-include-each-query?list=am-300",
    "problems": [
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/minimum-interval-to-include-each-query?list=am-300",
        "id": "minimum-interval-to-include-each-query",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-interval-to-include-each-query",
        "notesUrl": "",
        "slug": "minimum-interval-to-include-each-query",
        "solutionUrl": "/learn/dsa/minimum-interval-to-include-each-query",
        "title": "Minimum Interval to Include Each Query",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      },
      {
        "difficulty": "Hard",
        "frequency": 3,
        "href": "/practice/dsa/the-skyline-problem?list=am-300",
        "id": "the-skyline-problem",
        "leetcodeUrl": "https://leetcode.com/problems/the-skyline-problem",
        "notesUrl": "",
        "slug": "the-skyline-problem",
        "solutionUrl": "/learn/dsa/the-skyline-problem",
        "title": "The Skyline Problem",
        "videoUrl": "",
        "lists": [
          "am_300",
          "am_600"
        ]
      }
    ],
    "slug": "line-sweep"
  }
];
