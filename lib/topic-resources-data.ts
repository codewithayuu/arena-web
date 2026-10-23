export interface TopicResource {
  id: string;
  title: string;
  url: string;
  type: "video" | "article" | "doc";
  is_starred: boolean;
  source: string;
  tag: string;
}

export interface TopicTemplate {
  id: string;
  title: string;
  code?: string;
  language?: string;
  description?: string;
  source_url?: string;
}

export interface TopicCommunityStats {
  practicing_count: number;
  completed_count: number;
  favourite_count: number;
  interview_note?: string;
}

export interface ProblemExtraData {
  fav_count: number;
  solutions_count: number;
  solve_count?: number;
  difficulty_label?: "EASY" | "MEDIUM" | "HARD";
  tags?: string[];
}

// Curated authentic resources for specific topics
export const TOPIC_RESOURCES: Record<string, TopicResource[]> = {
  conditional_statements: [
    {
      id: "res-cond-1",
      title: "1. If, Else & Else If",
      url: "https://www.youtube.com/watch?v=DXfeA2U1KzE",
      type: "video",
      is_starred: true,
      source: "Tech with Tim",
      tag: "Video",
    },
    {
      id: "res-cond-2",
      title: "2. C++ if, if...else and Nested if...else",
      url: "https://www.programiz.com/cpp-programming/if-else",
      type: "article",
      is_starred: true,
      source: "Programiz",
      tag: "Article",
    },
  ],
  loops: [
    {
      id: "res-loops-1",
      title: "1. For and While Loops in C++",
      url: "https://www.programiz.com/cpp-programming/for-loop",
      type: "article",
      is_starred: true,
      source: "Programiz",
      tag: "Article",
    },
    {
      id: "res-loops-2",
      title: "2. C++ Loops Tutorial",
      url: "https://www.youtube.com/watch?v=1bPf77bXvX0",
      type: "video",
      is_starred: true,
      source: "FreeCodeCamp",
      tag: "Video",
    },
  ],
  functions: [
    {
      id: "res-func-1",
      title: "1. C++ Functions and Scope",
      url: "https://www.learncpp.com/cpp-tutorial/introduction-to-functions/",
      type: "article",
      is_starred: true,
      source: "LearnCpp",
      tag: "Documentation",
    },
  ],
  arrays: [
    {
      id: "res-arr-1",
      title: "1. C++ Arrays & Vectors Guide",
      url: "https://usaco.guide/bronze/intro-ds",
      type: "article",
      is_starred: true,
      source: "USACO Guide",
      tag: "Guide",
    },
  ],
  prefix_sum: [
    {
      id: "res-pref-1",
      title: "1. Introduction to Prefix Sums",
      url: "https://usaco.guide/silver/prefix-sums",
      type: "article",
      is_starred: true,
      source: "USACO Guide",
      tag: "Guide",
    },
    {
      id: "res-pref-2",
      title: "2. Prefix Sum Array - Implementation and Applications",
      url: "https://cp-algorithms.com/data_structures/fenwick.html",
      type: "article",
      is_starred: true,
      source: "CP-Algorithms",
      tag: "Documentation",
    },
  ],
};

// Curated templates
export const TOPIC_TEMPLATES: Record<string, TopicTemplate[]> = {
  prefix_sum: [
    {
      id: "tmpl-pref-1",
      title: "1D / 2D Prefix Sum Template",
      code: `template <typename T>
struct PrefixSum {
    int n;
    vector<T> pref;
    PrefixSum(const vector<T>& a) : n(a.size()), pref(n + 1, 0) {
        for (int i = 0; i < n; i++) pref[i + 1] = pref[i] + a[i];
    }
    T query(int l, int r) { // [l, r] 0-indexed
        return pref[r + 1] - pref[l];
    }
};`,
      language: "cpp",
      description: "Fast 0-indexed range sum queries in O(1).",
    },
  ],
};

// Authentic community counters
export const TOPIC_COMMUNITY_STATS: Record<string, TopicCommunityStats> = {
  conditional_statements: {
    practicing_count: 37,
    completed_count: 5850,
    favourite_count: 3,
    interview_note: "This topic might be useful in Technical Coding Interviews",
  },
  loops: {
    practicing_count: 42,
    completed_count: 5120,
    favourite_count: 5,
    interview_note: "This topic might be useful in Technical Coding Interviews",
  },
  functions: {
    practicing_count: 28,
    completed_count: 4670,
    favourite_count: 2,
    interview_note: "This topic might be useful in Technical Coding Interviews",
  },
  arrays: {
    practicing_count: 54,
    completed_count: 6200,
    favourite_count: 8,
    interview_note: "This topic might be useful in Technical Coding Interviews",
  },
};

// Exact problem enrichments for conditional_statements
export const PROBLEM_EXTRA_DATA: Record<string, ProblemExtraData> = {
  gym_287306h: {
    fav_count: 1,
    solutions_count: 12,
    solve_count: 1589,
    difficulty_label: "EASY",
    tags: ["implementation", "conditions", "basics"],
  },
  gym_287306i: {
    fav_count: 2,
    solutions_count: 12,
    solve_count: 1551,
    difficulty_label: "EASY",
    tags: ["math", "conditions", "basics"],
  },
  gym_287306m: {
    fav_count: 8,
    solutions_count: 12,
    solve_count: 1461,
    difficulty_label: "EASY",
    tags: ["strings", "ascii", "conditions"],
  },
  gym_287306n: {
    fav_count: 2,
    solutions_count: 12,
    solve_count: 1371,
    difficulty_label: "EASY",
    tags: ["strings", "case-conversion", "conditions"],
  },
  gym_287306w: {
    fav_count: 2,
    solutions_count: 8,
    solve_count: 1298,
    difficulty_label: "EASY",
    tags: ["math", "ranges", "conditions"],
  },
  gym_287306y: {
    fav_count: 11,
    solutions_count: 9,
    solve_count: 1254,
    difficulty_label: "EASY",
    tags: ["math", "data-types", "conditions"],
  },
  gym_287306z: {
    fav_count: 3,
    solutions_count: 8,
    solve_count: 1250,
    difficulty_label: "EASY",
    tags: ["expression-parsing", "logic", "conditions"],
  },
  gym_287306j: {
    fav_count: 9,
    solutions_count: 11,
    solve_count: 1412,
    difficulty_label: "MEDIUM",
    tags: ["math", "min-max", "conditions"],
  },
  gym_287306u: {
    fav_count: 5,
    solutions_count: 10,
    solve_count: 1358,
    difficulty_label: "MEDIUM",
    tags: ["geometry", "quadrants", "conditions"],
  },
  gym_287306x: {
    fav_count: 5,
    solutions_count: 9,
    solve_count: 1318,
    difficulty_label: "MEDIUM",
    tags: ["sorting", "conditionals", "basics"],
  },
  gym_287306aa: {
    fav_count: 3,
    solutions_count: 10,
    solve_count: 1312,
    difficulty_label: "MEDIUM",
    tags: ["arithmetic", "expression-eval", "conditions"],
  },
};

// Dynamic helper functions for any topic in the God List
export function getTopicResources(topicId: string, topicTitle: string): TopicResource[] {
  if (TOPIC_RESOURCES[topicId]) {
    return TOPIC_RESOURCES[topicId];
  }
  return [
    {
      id: `res-${topicId}-1`,
      title: `1. Understanding ${topicTitle} Guide`,
      url: `https://cp-algorithms.com/`,
      type: "article",
      is_starred: true,
      source: "CP-Algorithms",
      tag: "Guide",
    },
    {
      id: `res-${topicId}-2`,
      title: `2. ${topicTitle} Problem Solving Tutorial`,
      url: `https://usaco.guide/`,
      type: "video",
      is_starred: true,
      source: "USACO Guide",
      tag: "Video",
    },
  ];
}

export function getTopicTemplates(topicId: string): TopicTemplate[] {
  return TOPIC_TEMPLATES[topicId] || [];
}

export function getTopicCommunityStats(topicId: string, topicDifficulty: number = 0): TopicCommunityStats {
  return {
    practicing_count: 0,
    completed_count: 0,
    favourite_count: 0,
    interview_note: TOPIC_COMMUNITY_STATS[topicId]?.interview_note ?? (topicDifficulty <= 2 ? "This topic might be useful in Technical Coding Interviews" : undefined),
  };
}

export function getProblemExtraData(problemId: string, problemDifficulty: number = 1): ProblemExtraData {
  if (PROBLEM_EXTRA_DATA[problemId]) {
    return {
      ...PROBLEM_EXTRA_DATA[problemId],
      fav_count: 0,
      solutions_count: 0,
      solve_count: 0,
    };
  }

  const diffLabel: "EASY" | "MEDIUM" | "HARD" =
    problemDifficulty <= 1 ? "EASY" : problemDifficulty === 2 ? "MEDIUM" : "HARD";

  return {
    fav_count: 0,
    solutions_count: 0,
    solve_count: 0,
    difficulty_label: diffLabel,
    tags: ["implementation", "competitive-programming"],
  };
}
