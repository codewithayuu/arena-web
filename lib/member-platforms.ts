export const MEMBER_CONNECTION_PLATFORMS = [
  "codeforces", "leetcode", "codechef", "atcoder", "hackerrank",
] as const;

export type MemberConnectionPlatform = (typeof MEMBER_CONNECTION_PLATFORMS)[number];

export function isMemberConnectionPlatform(value: string): value is MemberConnectionPlatform {
  return MEMBER_CONNECTION_PLATFORMS.includes(value as MemberConnectionPlatform);
}
