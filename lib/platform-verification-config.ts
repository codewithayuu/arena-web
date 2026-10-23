import type { SupportedVerificationPlatform } from "@/lib/platform-verification";

export interface VerificationPlatformConfig {
  name: string;
  settingsUrl: string;
  targetField: string;
  description: string;
}

export const PLATFORM_CONFIGS: Record<SupportedVerificationPlatform, VerificationPlatformConfig> = {
  leetcode: {
    name: "LeetCode",
    settingsUrl: "https://leetcode.com/settings/profile/",
    targetField: "Summary",
    description: "Add the code to your public profile summary, then verify it here.",
  },
  codeforces: {
    name: "Codeforces",
    settingsUrl: "https://codeforces.com/settings/social",
    targetField: "First Name",
    description: "Add the code to your first name in Codeforces social settings.",
  },
  codechef: {
    name: "CodeChef",
    settingsUrl: "https://www.codechef.com/users/edit",
    targetField: "Name",
    description: "Add the code to your public name in CodeChef profile settings.",
  },
  atcoder: {
    name: "AtCoder",
    settingsUrl: "https://atcoder.jp/settings",
    targetField: "Affiliation",
    description: "Add the code to the public affiliation field in AtCoder settings.",
  },
  geeksforgeeks: {
    name: "GeeksforGeeks",
    settingsUrl: "https://edit.geeksforgeeks.org/profile",
    targetField: "Display Name",
    description: "Add the code to your public GeeksforGeeks display name.",
  },
  codestudio: {
    name: "CodeStudio",
    settingsUrl: "https://www.naukri.com/code360/profile",
    targetField: "Name",
    description: "Add the code to your public Code360 profile name.",
  },
  interviewbit: {
    name: "InterviewBit",
    settingsUrl: "https://www.interviewbit.com/profile/",
    targetField: "Bio",
    description: "Add the code to your public InterviewBit bio and keep the profile public.",
  },
  hackerrank: {
    name: "HackerRank",
    settingsUrl: "https://www.hackerrank.com/settings/profile",
    targetField: "First Name",
    description: "Add the code to your first name in HackerRank profile settings.",
  },
  github: {
    name: "GitHub",
    settingsUrl: "https://github.com/settings/profile",
    targetField: "Bio",
    description: "Add the code to your public GitHub bio. You can remove it after verification.",
  },
};
