export const ROADMAP_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"] as const;
export const ROADMAP_CONTEXTS = [
  "Working professional",
  "Self-learner",
  "Early-career developer",
  "Experienced developer",
] as const;
export const ROADMAP_HOURS = ["1–2 hours", "3–4 hours", "5–6 hours", "7+ hours"] as const;
export const ROADMAP_EXPERIENCE = ["New to coding", "Beginner", "Intermediate", "Advanced"] as const;
export const ROADMAP_INTERESTS = [
  "Web development",
  "Mobile development",
  "Backend systems",
  "Cloud and DevOps",
  "AI and machine learning",
  "Game development",
] as const;
export const ROADMAP_DSA_GOALS = [
  "Interview preparation",
  "Competitive programming",
  "Both",
  "Core fundamentals",
  "Not a current focus",
] as const;
export const ROADMAP_TIMELINES = ["3 months", "6 months", "9 months", "12 months", "Self-paced"] as const;
export const ROADMAP_STYLES = ["Video", "Reading", "Projects", "Practice", "Structured courses"] as const;

export type PersonalizedRoadmapAnswers = {
  isStudent: boolean;
  collegeYear: (typeof ROADMAP_YEARS)[number] | null;
  professionalContext: (typeof ROADMAP_CONTEXTS)[number] | null;
  developmentAffinity: number;
  problemSolvingAffinity: number;
  dailyHours: (typeof ROADMAP_HOURS)[number];
  experienceLevel: (typeof ROADMAP_EXPERIENCE)[number];
  developmentInterests: Array<(typeof ROADMAP_INTERESTS)[number]>;
  dsaGoal: (typeof ROADMAP_DSA_GOALS)[number];
  targetTimeline: (typeof ROADMAP_TIMELINES)[number];
  learningStyle: Array<(typeof ROADMAP_STYLES)[number]>;
};

export type PersonalizedRoadmapPhase = {
  number: number;
  title: string;
  weeks: number;
  duration: string;
  hours: number;
  topics: string[];
  milestone: string;
  href: string;
};

export type PersonalizedRoadmap = {
  title: string;
  profile: string;
  primaryPath: "DSA-focused" | "Development-focused" | "Balanced";
  subPath: string;
  totalWeeks: number;
  totalHours: number;
  isRealistic: boolean;
  phases: PersonalizedRoadmapPhase[];
};

function isOneOf<T extends readonly string[]>(value: unknown, options: T): value is T[number] {
  return typeof value === "string" && options.includes(value);
}

export function parsePersonalizedRoadmapAnswers(input: unknown): PersonalizedRoadmapAnswers | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const value = input as Record<string, unknown>;
  const isStudent = value.isStudent;
  if (typeof isStudent !== "boolean") return null;
  const collegeYear = value.collegeYear === null ? null : value.collegeYear;
  const professionalContext = value.professionalContext === null ? null : value.professionalContext;
  if (isStudent ? !isOneOf(collegeYear, ROADMAP_YEARS) : !isOneOf(professionalContext, ROADMAP_CONTEXTS)) return null;
  if (!Number.isInteger(value.developmentAffinity) || Number(value.developmentAffinity) < 1 || Number(value.developmentAffinity) > 10) return null;
  if (!Number.isInteger(value.problemSolvingAffinity) || Number(value.problemSolvingAffinity) < 1 || Number(value.problemSolvingAffinity) > 10) return null;
  if (!isOneOf(value.dailyHours, ROADMAP_HOURS) || !isOneOf(value.experienceLevel, ROADMAP_EXPERIENCE)) return null;
  if (!isOneOf(value.dsaGoal, ROADMAP_DSA_GOALS) || !isOneOf(value.targetTimeline, ROADMAP_TIMELINES)) return null;
  if (!Array.isArray(value.developmentInterests) || value.developmentInterests.length < 1 || value.developmentInterests.length > 6) return null;
  if (!value.developmentInterests.every((item) => isOneOf(item, ROADMAP_INTERESTS))) return null;
  if (!Array.isArray(value.learningStyle) || value.learningStyle.length < 1 || value.learningStyle.length > 5) return null;
  if (!value.learningStyle.every((item) => isOneOf(item, ROADMAP_STYLES))) return null;
  return {
    isStudent,
    collegeYear: isStudent ? collegeYear as PersonalizedRoadmapAnswers["collegeYear"] : null,
    professionalContext: isStudent ? null : professionalContext as PersonalizedRoadmapAnswers["professionalContext"],
    developmentAffinity: Number(value.developmentAffinity),
    problemSolvingAffinity: Number(value.problemSolvingAffinity),
    dailyHours: value.dailyHours,
    experienceLevel: value.experienceLevel,
    developmentInterests: [...new Set(value.developmentInterests as PersonalizedRoadmapAnswers["developmentInterests"])],
    dsaGoal: value.dsaGoal,
    targetTimeline: value.targetTimeline,
    learningStyle: [...new Set(value.learningStyle as PersonalizedRoadmapAnswers["learningStyle"])],
  };
}

function hoursPerDay(option: PersonalizedRoadmapAnswers["dailyHours"]): number {
  if (option === "1–2 hours") return 1.5;
  if (option === "3–4 hours") return 3.5;
  if (option === "5–6 hours") return 5.5;
  return 8;
}

function weeksForTimeline(option: PersonalizedRoadmapAnswers["targetTimeline"]): number {
  if (option === "3 months") return 13;
  if (option === "6 months") return 26;
  if (option === "9 months") return 39;
  if (option === "12 months") return 52;
  return 26;
}

function devTrack(interests: PersonalizedRoadmapAnswers["developmentInterests"]): string {
  if (interests.includes("Web development")) return "Web development";
  if (interests.includes("Backend systems")) return "Backend engineering";
  if (interests.includes("Mobile development")) return "Mobile development";
  if (interests.includes("Cloud and DevOps")) return "Cloud and DevOps";
  if (interests.includes("AI and machine learning")) return "AI and machine learning";
  return "Game development";
}

export function generatePersonalizedRoadmap(answers: PersonalizedRoadmapAnswers): PersonalizedRoadmap {
  const dsaGoalIsLight = answers.dsaGoal === "Not a current focus";
  const dsaGoalIsStrong = answers.dsaGoal === "Competitive programming" || answers.dsaGoal === "Both";
  const devScore = answers.developmentAffinity + (dsaGoalIsLight ? 2 : 0);
  const dsaScore = answers.problemSolvingAffinity + (dsaGoalIsStrong ? 2 : answers.dsaGoal === "Interview preparation" ? 1 : 0);
  const sum = devScore + dsaScore || 1;
  const devSplit = Math.round(devScore / sum * 100);
  const dsaSplit = 100 - devSplit;
  const primaryPath = dsaSplit > 65 ? "DSA-focused" : devSplit > 65 ? "Development-focused" : "Balanced";
  const track = devTrack(answers.developmentInterests);
  const dsaTrack = answers.dsaGoal === "Competitive programming" ? "Competitive programming" : "Interview preparation";
  const subPath = primaryPath === "DSA-focused" ? dsaTrack : primaryPath === "Development-focused" ? track : `${track} + ${dsaTrack}`;
  const weeks = weeksForTimeline(answers.targetTimeline);
  const weeklyHours = hoursPerDay(answers.dailyHours) * 7;
  const totalHours = Math.round(weeklyHours * weeks);
  const weights = primaryPath === "DSA-focused" ? [0.22, 0.32, 0.30, 0.16] : [0.2, 0.3, 0.3, 0.2];
  const weekParts = weights.map((weight) => Math.floor(weeks * weight));
  let remaining = weeks - weekParts.reduce((total, part) => total + part, 0);
  for (let index = 0; remaining > 0; index = (index + 1) % weekParts.length, remaining -= 1) weekParts[index] += 1;

  const dsaTopics = answers.experienceLevel === "New to coding" || answers.experienceLevel === "Beginner"
    ? ["Programming fundamentals", "Arrays and strings", "Complexity and debugging"]
    : ["Trees and graphs", "Dynamic programming", "Problem patterns and analysis"];
  const devTopics = track === "Web development"
    ? ["HTML and CSS", "JavaScript and React", "APIs and application structure"]
    : track === "Backend engineering"
      ? ["HTTP and APIs", "Databases and data modeling", "Authentication and deployment"]
      : [track, "Core tools and workflows", "Build and ship a small project"];
  const phases: PersonalizedRoadmapPhase[] = [
    { number: 1, title: "Build the foundation", topics: ["Programming fundamentals", "Git and debugging", "Study routine"], milestone: "Write small programs and explain their structure", href: "/learn/dsa", weeks: weekParts[0] },
    { number: 2, title: primaryPath === "DSA-focused" ? "Strengthen problem solving" : `Learn ${track}`, topics: primaryPath === "DSA-focused" ? dsaTopics : devTopics, milestone: primaryPath === "DSA-focused" ? "Solve core problems with a clear approach" : "Build a small working feature", href: primaryPath === "DSA-focused" ? "/practice/dsa-patterns" : "/topic-list", weeks: weekParts[1] },
    { number: 3, title: primaryPath === "Development-focused" ? "Apply your skills" : "Connect concepts", topics: primaryPath === "Development-focused" ? ["Project architecture", "Testing and quality", "Deployment basics"] : [...dsaTopics.slice(0, 2), ...devTopics.slice(0, 1)], milestone: "Complete a project or a focused problem set", href: "/practice/dsa-patterns", weeks: weekParts[2] },
    { number: 4, title: primaryPath === "DSA-focused" ? "Prepare for contests and interviews" : "Build a portfolio project", topics: primaryPath === "DSA-focused" ? [dsaTrack, "Timed practice", "Review and improvement"] : ["Plan a complete project", "Ship a usable version", "Write a short case study"], milestone: primaryPath === "DSA-focused" ? "Complete a timed practice set and review it" : "Publish a complete project", href: "/practice/contest-builder", weeks: weekParts[3] },
  ].map((phase) => ({
    ...phase,
    duration: `${phase.weeks} ${phase.weeks === 1 ? "week" : "weeks"}`,
    hours: Math.round(weeklyHours * phase.weeks),
  }));
  const identity = answers.isStudent ? `${answers.collegeYear} student` : answers.professionalContext;
  const title = `${primaryPath} learning plan`;
  const profile = `${identity} · ${subPath}`;
  const minimumHours = answers.experienceLevel === "New to coding" ? 300 : answers.experienceLevel === "Beginner" ? 220 : 150;
  return { title, profile, primaryPath, subPath, totalWeeks: weeks, totalHours, isRealistic: totalHours >= minimumHours, phases };
}
