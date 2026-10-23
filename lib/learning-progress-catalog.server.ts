import "server-only";

import companyProblemIds from "@/data/companies/problem-ids.json";
import { DSA_PATTERNS } from "@/lib/dsa-patterns-dataset";
import { getAllLessons } from "@/lib/dsa-curriculum";
import { PRACTICE_PROBLEMS } from "@/lib/practice-problems";
import { ALL_TOPICS, PROBLEMS } from "@/lib/topic-list-data";

const validKeys = new Set<string>([
  ...ALL_TOPICS.map((topic) => `topic:${topic.topic_id}`),
  ...Object.keys(PROBLEMS).map((problemId) => `problem:${problemId}`),
  ...DSA_PATTERNS.flatMap((category) => category.problems.map((problem) => `problem:${problem.id}`)),
  ...PRACTICE_PROBLEMS.map((problem) => `problem:${problem.id}`),
  ...companyProblemIds.map((problemId) => `problem:${problemId}`),
  ...getAllLessons().map((lesson) => `lesson:dsa:${lesson.slug}`),
]);

export function isValidLearningProgressKey(key: string): boolean {
  if (
    key.startsWith("lecture:") ||
    key.startsWith("potd:") ||
    key.startsWith("sd:") ||
    key.startsWith("beginners:")
  ) {
    return true;
  }
  return validKeys.has(key);
}

export function getValidLearningProgressKeys(): string[] {
  return [...validKeys].sort();
}

