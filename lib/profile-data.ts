export interface UserPersonalDetails {
  bio: string;
  country: string;
  college: string;
  degree: string;
  branch: string;
  imageUrl: string;
  yearOfGraduation: number;
  jobPreference: number;
}

export interface DifficultyStats {
  easy: number;
  medium: number;
  hard: number;
  basic?: number;
  school?: number;
}

export interface PlatformProfile {
  platform: "leetcode" | "codeforces" | "codechef" | "geeksforgeeks" | "codestudio" | "atcoder" | "hackerrank" | "github" | "interviewbit";
  name: string;
  userName: string;
  profileUrl: string;
  isConnected: boolean;
  isVerified: boolean;
  lastSyncedAt?: string;
  profileStats?: Record<string, unknown>;
  currentRating?: number;
  maxRating?: number;
  rank?: string | number;
  maxRank?: string;
  stars?: number;
  totalQuestionsSolved: number | null;
  totalActiveDays?: number;
  maxStreak?: number;
  difficultyStats?: DifficultyStats;
  contestCount?: number;
  badgeCount?: number;
  color: string;
}

export interface ContestHistoryItem {
  contestName: string;
  platform: "leetcode" | "codeforces" | "codechef" | "atcoder";
  rating: number;
  rank: number;
  contestDate: number; // Unix timestamp
  ratingChange?: number;
}

export interface ArenaContestHistoryItem {
  contestId: string;
  slug: string;
  name: string;
  endsAt: string;
  rank: number;
  solved: number;
  points: number;
  penaltyMinutes: number;
  state: "published" | "archived";
  executionMode?: "participant_local" | "server_judged";
}

export type ArenaContestHistoryStatus = "available" | "partial" | "unavailable";

export interface BadgeItem {
  id: string;
  badgeName: string;
  platform: string;
  icon?: string;
  dateEarned?: string;
  category?: string;
}

export interface GitHubStats {
  githubProfile: string;
  totalContributions: number;
  commitCounts: number;
  pushRequestsCount: number;
  issues: number;
  totalActiveDays: number;
  publicRepos?: number;
  followers?: number;
  following?: number;
  totalStars?: number;
  sampledRepositories?: number;
  recentPublicEvents: number | null;
  recentPublicPushes: number | null;
  recentPublicCommits: number | null;
  recentPublicPullRequests: number | null;
  recentPublicIssues: number | null;
  recentPublicActiveDays: number | null;
  publicActivityWindowDays: number | null;
  publicActivityEventLimit: number | null;
  publicActivityByDay: Record<string, number>;
  publicActivityAvailable: boolean;
  languages: Record<string, number>;
  topRepos: Array<{
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    url: string;
  }>;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  grade?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  builtWith: string[];
  projectUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export interface UserProfileData {
  id: string;
  username: string;
  firstName: string;
  secondName: string;
  profileViews: number | null;
  isVerified: boolean;
  personalDetails: UserPersonalDetails;
  platforms: PlatformProfile[];
  contests: ContestHistoryItem[];
  arenaContests: ArenaContestHistoryItem[];
  arenaContestHistoryStatus: ArenaContestHistoryStatus;
  badges: BadgeItem[];
  github: GitHubStats;
  education: EducationItem[];
  projects: ProjectItem[];
  submissionHeatmap: Record<string, number>; // "YYYY-MM-DD" -> count
  topicDistribution: Record<string, number>;
  totalQuestionsSolved: number | null;
  totalActiveDays: number | null;
  currentStreak: number | null;
  maxStreak: number | null;
  problemSolvingTags: string[];
}

// Profile views hydrate from Supabase; no seeded participant data is rendered.

export function loadProfileFromStorage(username: string): UserProfileData {
  // Profile data must be hydrated from the authenticated Supabase API. Never
  // render the seeded demo profile or another handle's local cache as a real user.
  return createEmptyProfile(username);
}

function createEmptyProfile(username: string): UserProfileData {
  return {
    id: `profile-${username.toLowerCase() || "unknown"}`,
    username,
    firstName: username.split("@")[0] || "Member",
    secondName: "",
    profileViews: null,
    isVerified: false,
    personalDetails: {
      bio: "",
      country: "",
      college: "",
      degree: "",
      branch: "",
      imageUrl: "",
      yearOfGraduation: 0,
      jobPreference: 0,
    },
    platforms: [],
    contests: [],
    arenaContests: [],
    arenaContestHistoryStatus: "available",
    badges: [],
    github: {
      githubProfile: "",
      totalContributions: 0,
      commitCounts: 0,
      pushRequestsCount: 0,
      issues: 0,
      totalActiveDays: 0,
      recentPublicEvents: null,
      recentPublicPushes: null,
      recentPublicCommits: null,
      recentPublicPullRequests: null,
      recentPublicIssues: null,
      recentPublicActiveDays: null,
      publicActivityWindowDays: null,
      publicActivityEventLimit: null,
      publicActivityByDay: {},
      publicActivityAvailable: false,
      languages: {},
      topRepos: [],
    },
    education: [],
    projects: [],
    submissionHeatmap: {},
    topicDistribution: {},
    totalQuestionsSolved: null,
    totalActiveDays: null,
    currentStreak: null,
    maxStreak: null,
    problemSolvingTags: [],
  };
}

