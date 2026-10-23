export interface TrackMeta {
  _id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  chapterCount: number;
  lectureCount: number;
  totalSec: number;
  chapters: Array<{
    slug: string;
    urlSlug: string;
    name: string;
  }>;
}

export interface Lecture {
  _id: string;
  chapterId: string;
  videoId: string;
  title: string;
  difficulty: "easy" | "medium" | "hard" | null;
  durationSec: number;
  githubUrl: string | null;
  order: number;
  problemUrl: string | null;
  section: "theory" | "interview";
  tags: string[];
  thumbnail: string;
  patterns: string[];
  problemNumber?: number;
  problemSlug?: string;
  path: string;
  paidOnly?: boolean;
  trackSlug: string;
  chapterSlug: string;
  chapterName?: string;
}

export interface ChapterData {
  chapter: {
    _id: string;
    slug: string;
    urlSlug: string;
    name: string;
    description: string;
    order: number;
    estimatedHours: number;
    totalSec: number;
    firstPath?: string;
  };
  totalLectures: number;
  lectures: Lecture[];
}

export interface POTDProblem {
  _id: string;
  videoId: string;
  date: string;
  difficulty: "easy" | "medium" | "hard";
  durationSec: number;
  githubUrl: string;
  problemName: string;
  problemNumber: number;
  problemUrl: string;
  thumbnail: string;
  title: string;
  topicTags: string[];
  youtubeUrl: string;
  lecturePath: string;
  solved: boolean;
  dayDate: string;
}

export interface SystemDesignQuestion {
  slug: string;
  title: string;
  type: "HLD" | "LLD";
  level: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  companies: string[];
  tags: string[];
  problemStatement?: string;
  functionalReqs?: string[];
  nonFunctionalReqs?: string[];
  scaleHints?: string[];
  hints?: string[];
  rubric?: Record<string, string>;
  referenceOutline?: string;
  relatedLectures?: string[];
  status?: string;
}

export interface AIConcept {
  slug: string;
  question: string;
  answer: string;
  level: string;
  tags: string[];
  topic: string;
}

export interface CompanyMeta {
  _id: string;
  name: string;
  slug: string;
  problems: number;
  mikProblems: number;
  recent: number;
  readiness: number;
}
