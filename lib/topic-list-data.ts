import categoriesData from "../data/topic-list/categories.json";
import problemsData from "../data/topic-list/problems.json";
import usefulLinksData from "../data/topic-list/useful-links.json";

export interface Topic {
  topic_id: string;
  topic_title: string;
  difficulty: number; // 0: Very Easy, 1: Easy, 2: Medium, 3: Hard, 4: Very Hard
  importance: number; // 1: Nice to know, 2: Should know, 3: Must know
  phase?: number;
  is_interview_topic?: boolean;
  topic_desc?: string;
  prerequisites?: string[] | string;
  topic_blog?: string;
  date_added?: string;
  favourite_count?: number;
}

export interface SubCategory {
  sub_category_id: string;
  sub_category_title: string;
  sub_category_desc?: string;
  topics: Topic[];
}

export interface Category {
  category_id: string;
  category_title: string;
  category_desc?: string;
  sub_categories: SubCategory[];
}

export interface Problem {
  problem_id: string;
  problem_title: string;
  problem_url: string;
  difficulty: number;
  topics: string[];
  solve_count?: number;
  is_starred: boolean;
  created_at?: { seconds: number; nanoseconds: number };
  editorial_link?: string;
  problem_comments?: string;
}

export interface UsefulLink {
  title: string;
  link: string;
  desc?: string;
}

export interface ModulePreset {
  name: string;
  difficulty: string;
  importance: string;
  description: string;
}

export const CATEGORIES: Category[] = categoriesData as unknown as Category[];
export const PROBLEMS: Record<string, Problem> = problemsData as unknown as Record<string, Problem>;
export const USEFUL_LINKS: UsefulLink[] = usefulLinksData as unknown as UsefulLink[];

export const MODULES_LIST: ModulePreset[] = [
  {
    name: "Beginner Essential",
    difficulty: "0",
    importance: "3",
    description: "Start here! Core fundamentals every programmer must know.",
  },
  {
    name: "Beginner Standard",
    difficulty: "0",
    importance: "2",
    description: "Important beginner topics to solidify your foundation.",
  },
  {
    name: "Beginner Extra",
    difficulty: "0",
    importance: "1",
    description: "Additional beginner topics for a well-rounded start.",
  },
  {
    name: "Intermediate Essential",
    difficulty: "1",
    importance: "3",
    description: "Must-know topics to level up from beginner to intermediate.",
  },
  {
    name: "Intermediate Standard",
    difficulty: "1",
    importance: "2",
    description: "Important intermediate topics to broaden your skills.",
  },
  {
    name: "Intermediate Extra",
    difficulty: "1",
    importance: "1",
    description: "Extra intermediate topics for deeper exploration.",
  },
  {
    name: "Advanced Essential",
    difficulty: "2",
    importance: "3",
    description: "Critical advanced topics for competitive programming success.",
  },
  {
    name: "Advanced Standard",
    difficulty: "2",
    importance: "2",
    description: "Important advanced topics to strengthen your expertise.",
  },
  {
    name: "Advanced Extra",
    difficulty: "2",
    importance: "1",
    description: "Specialized advanced topics for comprehensive knowledge.",
  },
  {
    name: "Expert Essential",
    difficulty: "3",
    importance: "3",
    description: "Essential expert-level topics for top competitive performance.",
  },
  {
    name: "Expert Standard",
    difficulty: "3",
    importance: "2",
    description: "Important expert topics to master complex algorithms.",
  },
  {
    name: "Expert Extra",
    difficulty: "3",
    importance: "1",
    description: "Specialized expert topics for niche problem-solving.",
  },
  {
    name: "Legendary Essential",
    difficulty: "4",
    importance: "3",
    description: "The most crucial legendary topics for grandmaster-level skills.",
  },
  {
    name: "Legendary Standard",
    difficulty: "4",
    importance: "2",
    description: "Important legendary topics for elite competitive programming.",
  },
  {
    name: "Legendary Extra",
    difficulty: "4",
    importance: "1",
    description: "Rare legendary topics for the ultimate challenge.",
  },
];

// Flat list of all 576 topics with parent metadata
export interface EnrichedTopic extends Topic {
  category_id: string;
  category_title: string;
  sub_category_id: string;
  sub_category_title: string;
  topic_number: number;
}

export const ALL_TOPICS: EnrichedTopic[] = (() => {
  const list: EnrichedTopic[] = [];
  let number = 1;
  for (const cat of CATEGORIES) {
    for (const sub of cat.sub_categories) {
      for (const topic of sub.topics) {
        list.push({
          ...topic,
          category_id: cat.category_id,
          category_title: cat.category_title,
          sub_category_id: sub.sub_category_id,
          sub_category_title: sub.sub_category_title,
          topic_number: number++,
        });
      }
    }
  }
  return list;
})();

// Fast Map Index
const TOPIC_MAP = new Map<string, EnrichedTopic>(
  ALL_TOPICS.map((t) => [t.topic_id, t])
);

// Problems by topic ID index (lazily indexed on first access)
let problemsByTopicMap: Map<string, Problem[]> | null = null;

function getProblemsByTopicMap(): Map<string, Problem[]> {
  if (!problemsByTopicMap) {
    const map = new Map<string, Problem[]>();
    for (const problem of Object.values(PROBLEMS)) {
      for (const tid of problem.topics || []) {
        let list = map.get(tid);
        if (!list) {
          list = [];
          map.set(tid, list);
        }
        list.push(problem);
      }
    }
    problemsByTopicMap = map;
  }
  return problemsByTopicMap;
}

export function getTopicById(id: string): EnrichedTopic | undefined {
  return TOPIC_MAP.get(id);
}

export function getProblemsByTopicId(id: string): Problem[] {
  return getProblemsByTopicMap().get(id) || [];
}

export function getTopicDifficultyTitle(difficulty: number): string {
  switch (difficulty) {
    case 0:
      return "Very Easy";
    case 1:
      return "Easy";
    case 2:
      return "Medium";
    case 3:
      return "Hard";
    case 4:
      return "Very Hard";
    default:
      return "Basic";
  }
}

// Mindflare Color Scheme with Difficulty Tones:
// Level 0: Emerald/Green
// Level 1: Cyan/Blue
// Level 2: Orange/Amber
// Level 3: Vivid Red (#e8263d - Mindflare signature primary)
// Level 4: Crimson/Purple
export function getTopicDifficultyColor(difficulty: number): string {
  switch (difficulty) {
    case 0:
      return "#10b981"; // Emerald
    case 1:
      return "#06b6d4"; // Cyan
    case 2:
      return "#f59e0b"; // Amber
    case 3:
      return "#e8263d"; // Mindflare Primary Red
    case 4:
      return "#a855f7"; // Purple/Crimson
    default:
      return "#10b981";
  }
}

export function getTopicImportanceLabel(importance: number): string {
  switch (importance) {
    case 1:
      return "★☆☆ Nice to know";
    case 2:
      return "★★☆ Should know";
    case 3:
      return "★★★ Must know";
    default:
      return "Important";
  }
}

export function getTopicCompletionCount(_topicId: string, _topicNumber?: number): number {
  return 0;
}
