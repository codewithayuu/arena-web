export interface PracticeExample {
  id: number;
  input: string;
  output: string;
  explanation?: string;
  visualizerArray?: { index: number; value: any; highlight?: boolean }[];
}

export interface PracticeProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  frequency: number; // 1 to 5
  leetcodeUrl: string;
  topics: string[];
  companies: string[];
  description: string;
  note?: string;
  examples: PracticeExample[];
  constraints: string[];
  followUp?: string;
  starterCodes: {
    Java: string;
    Python: string;
    'C++': string;
    JavaScript: string;
    TypeScript: string;
  };
  solutionCode?: {
    Java: string;
    Python: string;
    'C++': string;
    JavaScript: string;
  };
  solutionExplanation?: string;
}

export interface ProblemCategory {
  title: string;
  slug: string;
  problems: PracticeProblem[];
}

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: 'move-zeroes',
    slug: 'move-zeroes',
    title: 'Move Zeroes',
    difficulty: 'Easy',
    category: 'Arrays',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/problems/move-zeroes/',
    topics: ['Array', 'Two Pointers'],
    companies: ['Amazon', 'Facebook', 'Microsoft', 'Apple', 'Bloomberg'],
    description:
      'Given an integer array nums, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements.',
    note: 'Note that you must do this in-place without making a copy of the array.',
    examples: [
      {
        id: 1,
        input: 'nums = [0,1,0,3,12]',
        output: '[1,3,12,0,0]',
        explanation: 'All zeroes are moved to the end while preserving the relative order of non-zero elements [1, 3, 12].',
        visualizerArray: [
          { index: 0, value: 0 },
          { index: 1, value: 1 },
          { index: 2, value: 0 },
          { index: 3, value: 3 },
          { index: 4, value: 12 },
        ],
      },
      {
        id: 2,
        input: 'nums = [0]',
        output: '[0]',
        visualizerArray: [{ index: 0, value: 0 }],
      },
      {
        id: 3,
        input: 'nums = [1,0,2,0,3]',
        output: '[1,2,3,0,0]',
        visualizerArray: [
          { index: 0, value: 1 },
          { index: 1, value: 0 },
          { index: 2, value: 2 },
          { index: 3, value: 0 },
          { index: 4, value: 3 },
        ],
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-2^31 <= nums[i] <= 2^31 - 1',
    ],
    followUp: 'Could you minimize the total number of operations done?',
    starterCodes: {
      Java: `class Solution {
    public void moveZeroes(int[] nums) {
        
    }
}`,
      Python: `class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        pass`,
      'C++': `class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        
    }
};`,
      JavaScript: `/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    
};`,
      TypeScript: `/**
 Do not return anything, modify nums in-place instead.
 */
function moveZeroes(nums: number[]): void {
    
};`,
    },
    solutionCode: {
      Java: `class Solution {
    public void moveZeroes(int[] nums) {
        int insertPos = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                nums[insertPos++] = nums[i];
            }
        }
        while (insertPos < nums.length) {
            nums[insertPos++] = 0;
        }
    }
}`,
      Python: `class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        insert_pos = 0
        for num in nums:
            if num != 0:
                nums[insert_pos] = num
                insert_pos += 1
        for i in range(insert_pos, len(nums)):
            nums[i] = 0`,
      'C++': `class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int insertPos = 0;
        for (int x : nums) {
            if (x != 0) nums[insertPos++] = x;
        }
        while (insertPos < nums.size()) {
            nums[insertPos++] = 0;
        }
    }
};`,
      JavaScript: `var moveZeroes = function(nums) {
    let insertPos = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            nums[insertPos++] = nums[i];
        }
    }
    while (insertPos < nums.length) {
        nums[insertPos++] = 0;
    }
};`,
    },
    solutionExplanation:
      'We can use the two-pointer technique. One pointer (insertPos) tracks where the next non-zero element should be placed, while the second pointer iterates through the array. Once all non-zero elements are placed, fill the rest with zeroes.',
  },
  {
    id: 'majority-element',
    slug: 'majority-element',
    title: 'Majority Element',
    difficulty: 'Easy',
    category: 'Arrays',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/problems/majority-element/',
    topics: ['Array', 'Hash Table', 'Divide and Conquer', 'Counting'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Adobe'],
    description:
      'Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.',
    examples: [
      {
        id: 1,
        input: 'nums = [3,2,3]',
        output: '3',
        visualizerArray: [
          { index: 0, value: 3 },
          { index: 1, value: 2 },
          { index: 2, value: 3 },
        ],
      },
      {
        id: 2,
        input: 'nums = [2,2,1,1,1,2,2]',
        output: '2',
        visualizerArray: [
          { index: 0, value: 2 },
          { index: 1, value: 2 },
          { index: 2, value: 1 },
          { index: 3, value: 1 },
          { index: 4, value: 1 },
          { index: 5, value: 2 },
          { index: 6, value: 2 },
        ],
      },
    ],
    constraints: [
      'n == nums.length',
      '1 <= n <= 5 * 10^4',
      '-10^9 <= nums[i] <= 10^9',
    ],
    followUp: 'Could you solve the problem in linear time and in O(1) space?',
    starterCodes: {
      Java: `class Solution {
    public int majorityElement(int[] nums) {
        
    }
}`,
      Python: `class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        pass`,
      'C++': `class Solution {
public:
    int majorityElement(vector<int>& nums) {
        
    }
};`,
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
    
};`,
      TypeScript: `function majorityElement(nums: number[]): number {
    
};`,
    },
    solutionCode: {
      Java: `class Solution {
    public int majorityElement(int[] nums) {
        int candidate = nums[0];
        int count = 0;
        for (int num : nums) {
            if (count == 0) {
                candidate = num;
            }
            count += (num == candidate) ? 1 : -1;
        }
        return candidate;
    }
}`,
      Python: `class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        candidate, count = nums[0], 0
        for num in nums:
            if count == 0:
                candidate = num
            count += 1 if num == candidate else -1
        return candidate`,
      'C++': `class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int candidate = nums[0], count = 0;
        for (int num : nums) {
            if (count == 0) candidate = num;
            count += (num == candidate) ? 1 : -1;
        }
        return candidate;
    }
};`,
      JavaScript: `var majorityElement = function(nums) {
    let candidate = nums[0], count = 0;
    for (let num of nums) {
        if (count === 0) candidate = num;
        count += (num === candidate) ? 1 : -1;
    }
    return candidate;
};`,
    },
    solutionExplanation:
      "Boyer-Moore Voting Algorithm: Maintain a candidate and a counter. Increment when you see the candidate, decrement when you see another element. If counter drops to zero, pick the current element as new candidate.",
  },
  {
    id: 'remove-duplicates-from-sorted-array',
    slug: 'remove-duplicates-from-sorted-array',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    category: 'Arrays',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
    topics: ['Array', 'Two Pointers'],
    companies: ['Microsoft', 'Amazon', 'Facebook', 'Google'],
    description:
      'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Return the number of unique elements in nums.',
    examples: [
      {
        id: 1,
        input: 'nums = [1,1,2]',
        output: '2, nums = [1,2,_]',
        visualizerArray: [
          { index: 0, value: 1 },
          { index: 1, value: 1 },
          { index: 2, value: 2 },
        ],
      },
      {
        id: 2,
        input: 'nums = [0,0,1,1,1,2,2,3,3,4]',
        output: '5, nums = [0,1,2,3,4,_,_,_,_,_]',
        visualizerArray: [
          { index: 0, value: 0 },
          { index: 1, value: 1 },
          { index: 2, value: 2 },
          { index: 3, value: 3 },
          { index: 4, value: 4 },
        ],
      },
    ],
    constraints: [
      '1 <= nums.length <= 3 * 10^4',
      '-100 <= nums[i] <= 100',
      'nums is sorted in non-decreasing order.',
    ],
    starterCodes: {
      Java: `class Solution {
    public int removeDuplicates(int[] nums) {
        
    }
}`,
      Python: `class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        pass`,
      'C++': `class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        
    }
};`,
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
    
};`,
      TypeScript: `function removeDuplicates(nums: number[]): number {
    
};`,
    },
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Arrays',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    topics: ['Array', 'Dynamic Programming'],
    companies: ['Amazon', 'Microsoft', 'Apple', 'Google', 'Facebook'],
    description:
      'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    examples: [
      {
        id: 1,
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.',
        visualizerArray: [
          { index: 0, value: 7 },
          { index: 1, value: 1, highlight: true },
          { index: 2, value: 5 },
          { index: 3, value: 3 },
          { index: 4, value: 6, highlight: true },
          { index: 5, value: 4 },
        ],
      },
      {
        id: 2,
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.',
        visualizerArray: [
          { index: 0, value: 7 },
          { index: 1, value: 6 },
          { index: 2, value: 4 },
          { index: 3, value: 3 },
          { index: 4, value: 1 },
        ],
      },
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
    starterCodes: {
      Java: `class Solution {
    public int maxProfit(int[] prices) {
        
    }
}`,
      Python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        pass`,
      'C++': `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        
    }
};`,
      JavaScript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    
};`,
      TypeScript: `function maxProfit(prices: number[]): number {
    
};`,
    },
  },
  {
    id: 'rotate-array',
    slug: 'rotate-array',
    title: 'Rotate Array',
    difficulty: 'Medium',
    category: 'Arrays',
    frequency: 4,
    leetcodeUrl: 'https://leetcode.com/problems/rotate-array/',
    topics: ['Array', 'Math', 'Two Pointers'],
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    description:
      'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.',
    examples: [
      {
        id: 1,
        input: 'nums = [1,2,3,4,5,6,7], k = 3',
        output: '[5,6,7,1,2,3,4]',
        explanation: 'rotate 1 steps to the right: [7,1,2,3,4,5,6]\nrotate 2 steps to the right: [6,7,1,2,3,4,5]\nrotate 3 steps to the right: [5,6,7,1,2,3,4]',
        visualizerArray: [
          { index: 0, value: 1 },
          { index: 1, value: 2 },
          { index: 2, value: 3 },
          { index: 3, value: 4 },
          { index: 4, value: 5 },
          { index: 5, value: 6 },
          { index: 6, value: 7 },
        ],
      },
      {
        id: 2,
        input: 'nums = [-1,-100,3,99], k = 2',
        output: '[3,99,-1,-100]',
        visualizerArray: [
          { index: 0, value: -1 },
          { index: 1, value: -100 },
          { index: 2, value: 3 },
          { index: 3, value: 99 },
        ],
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-2^31 <= nums[i] <= 2^31 - 1',
      '0 <= k <= 10^5',
    ],
    followUp: 'Try to come up with as many solutions as you can. There are at least three different ways to solve this problem. Could you do it in-place with O(1) extra space?',
    starterCodes: {
      Java: `class Solution {
    public void rotate(int[] nums, int k) {
        
    }
}`,
      Python: `class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        pass`,
      'C++': `class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        
    }
};`,
      JavaScript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
    
};`,
      TypeScript: `function rotate(nums: number[], k: number): void {
    
};`,
    },
  },
  {
    id: 'product-of-array-except-self',
    slug: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    category: 'Arrays',
    frequency: 4,
    leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/',
    topics: ['Array', 'Prefix Sum'],
    companies: ['Amazon', 'Apple', 'Facebook', 'Microsoft', 'Google'],
    description:
      'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.',
    examples: [
      {
        id: 1,
        input: 'nums = [1,2,3,4]',
        output: '[24,12,8,6]',
        visualizerArray: [
          { index: 0, value: 1 },
          { index: 1, value: 2 },
          { index: 2, value: 3 },
          { index: 3, value: 4 },
        ],
      },
      {
        id: 2,
        input: 'nums = [-1,1,0,-3,3]',
        output: '[0,0,9,0,0]',
        visualizerArray: [
          { index: 0, value: -1 },
          { index: 1, value: 1 },
          { index: 2, value: 0 },
          { index: 3, value: -3 },
          { index: 4, value: 3 },
        ],
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.',
    ],
    followUp: 'Can you solve the problem in O(1) extra memory space? (The output array does not count as extra space for space complexity analysis.)',
    starterCodes: {
      Java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        
    }
}`,
      Python: `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        pass`,
      'C++': `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        
    }
};`,
      JavaScript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {
    
};`,
      TypeScript: `function productExceptSelf(nums: number[]): number[] {
    
};`,
    },
  },
];

export const CATEGORIES: ProblemCategory[] = [
  {
    title: 'Arrays',
    slug: 'arrays',
    problems: PRACTICE_PROBLEMS.filter((p) => p.category === 'Arrays'),
  },
  {
    title: 'Two Pointers',
    slug: 'two-pointers',
    problems: [
      {
        id: 'valid-palindrome',
        slug: 'valid-palindrome',
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        category: 'Two Pointers',
        frequency: 5,
        leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
        topics: ['Two Pointers', 'String'],
        companies: ['Facebook', 'Microsoft', 'Amazon'],
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
        examples: [
          {
            id: 1,
            input: 's = "A man, a plan, a canal: Panama"',
            output: 'true',
            explanation: '"amanaplanacanalpanama" is a palindrome.',
          },
        ],
        constraints: ['1 <= s.length <= 2 * 10^5'],
        starterCodes: {
          Java: `class Solution {\n    public boolean isPalindrome(String s) {\n        \n    }\n}`,
          Python: `class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        pass`,
          'C++': `class Solution {\npublic:\n    bool isPalindrome(string s) {\n        \n    }\n};`,
          JavaScript: `var isPalindrome = function(s) {\n    \n};`,
          TypeScript: `function isPalindrome(s: string): boolean {\n    \n};`,
        },
      },
      {
        id: 'trapping-rain-water',
        slug: 'trapping-rain-water',
        title: 'Trapping Rain Water',
        difficulty: 'Hard',
        category: 'Two Pointers',
        frequency: 5,
        leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/',
        topics: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
        companies: ['Google', 'Amazon', 'Meta', 'Goldman Sachs'],
        description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        examples: [
          {
            id: 1,
            input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
            output: '6',
          },
        ],
        constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
        starterCodes: {
          Java: `class Solution {\n    public int trap(int[] height) {\n        \n    }\n}`,
          Python: `class Solution:\n    def trap(self, height: List[int]) -> int:\n        pass`,
          'C++': `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};`,
          JavaScript: `var trap = function(height) {\n    \n};`,
          TypeScript: `function trap(height: number[]): number {\n    \n};`,
        },
      },
    ],
  },
];

import { SYSTEM_DESIGN_PROBLEMS } from './system-design-problems';
import { CONCURRENCY_PROBLEMS } from './concurrency-problems';
import { LOW_LEVEL_DESIGN_PROBLEMS } from './low-level-design-problems';
import {
  COMPANY_PROBLEMS,
  getCompanyProblems,
  getCompanyBySlug,
  toPracticeProblem,
} from './company-problems-data';

export {
  SYSTEM_DESIGN_PROBLEMS,
  CONCURRENCY_PROBLEMS,
  LOW_LEVEL_DESIGN_PROBLEMS,
  COMPANY_PROBLEMS,
};

export function getAllPracticeProblems(): PracticeProblem[] {
  const all: PracticeProblem[] = [];
  const seen = new Set<string>();

  const addProblem = (p: PracticeProblem) => {
    if (!seen.has(p.slug)) {
      seen.add(p.slug);
      all.push(p);
    }
  };

  CATEGORIES.forEach((cat) => cat.problems.forEach(addProblem));
  SYSTEM_DESIGN_PROBLEMS.forEach(addProblem);
  CONCURRENCY_PROBLEMS.forEach(addProblem);
  LOW_LEVEL_DESIGN_PROBLEMS.forEach(addProblem);
  COMPANY_PROBLEMS.forEach(addProblem);

  return all;
}

export function getPracticeProblemBySlug(slug: string): PracticeProblem | undefined {
  return getAllPracticeProblems().find((p) => p.slug === slug);
}

export function getProblemsByList(listParam?: string): { title: string; problems: PracticeProblem[] } {
  if (listParam === 'system-design') {
    return { title: 'System Design Problems', problems: SYSTEM_DESIGN_PROBLEMS };
  }
  if (listParam === 'concurrency') {
    return { title: 'Concurrency Problems', problems: CONCURRENCY_PROBLEMS };
  }
  if (listParam === 'low-level-design') {
    return { title: 'Low-Level Design Problems', problems: LOW_LEVEL_DESIGN_PROBLEMS };
  }
  if (listParam === 'am_600' || listParam === 'am-600') {
    return { title: 'Mindflare 600 Problems', problems: getAllPracticeProblems() };
  }
  if (listParam === 'dsa-patterns') {
    return { title: 'DSA Patterns Problems', problems: getAllPracticeProblems() };
  }
  if (listParam?.startsWith('company-')) {
    const slug = listParam.replace('company-', '');
    const company = getCompanyBySlug(slug);
    const companyTitle = company ? `${company.name} Problems` : 'Company Problems';
    const cProblems = getCompanyProblems(slug);
    const companyName = company ? company.name : slug;
    return {
      title: companyTitle,
      problems: cProblems.map((p) => toPracticeProblem(p, companyName)),
    };
  }
  return { title: 'Mindflare 300 Problems', problems: getAllPracticeProblems() };
}

export function getAdjacentPracticeProblems(currentSlug: string, listParam?: string) {
  const { problems } = getProblemsByList(listParam);
  const list = problems.length > 0 ? problems : getAllPracticeProblems();
  const index = list.findIndex((p) => p.slug === currentSlug);
  if (index === -1) {
    const all = getAllPracticeProblems();
    const fallbackIdx = all.findIndex((p) => p.slug === currentSlug);
    if (fallbackIdx === -1) return { prev: null, next: null, currentIndex: 0, total: all.length };
    return {
      prev: fallbackIdx > 0 ? all[fallbackIdx - 1] : all[all.length - 1],
      next: fallbackIdx < all.length - 1 ? all[fallbackIdx + 1] : all[0],
      currentIndex: fallbackIdx + 1,
      total: all.length,
    };
  }

  const prev = index > 0 ? list[index - 1] : list[list.length - 1];
  const next = index < list.length - 1 ? list[index + 1] : list[0];
  return { prev, next, currentIndex: index + 1, total: list.length };
}

