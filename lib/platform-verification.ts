import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { MemberConnectionPlatform } from "@/lib/member-platforms";
export { MEMBER_CONNECTION_PLATFORMS, isMemberConnectionPlatform } from "@/lib/member-platforms";

export const SUPPORTED_VERIFICATION_PLATFORMS = [
  "codeforces", "leetcode", "codechef", "atcoder", "geeksforgeeks",
  "codestudio", "interviewbit", "hackerrank", "github",
] as const;
export type SupportedVerificationPlatform = (typeof SUPPORTED_VERIFICATION_PLATFORMS)[number];

export interface VerificationChallenge {
  version: 1;
  userId: string;
  platform: SupportedVerificationPlatform;
  handle: string;
  code: string;
  expiresAt: number;
  nonce: string;
}

export function cleanPlatformHandle(platform: SupportedVerificationPlatform, raw: string): string {
  const handle = raw.trim().split(/[?#]/, 1)[0].replace(/\/+$/, "");
  const patterns: Record<SupportedVerificationPlatform, RegExp[]> = {
    codeforces: [/^https?:\/\/(www\.)?codeforces\.com\/profile\//i],
    leetcode: [/^https?:\/\/(www\.)?leetcode\.com\/(u\/)?/i],
    codechef: [/^https?:\/\/(www\.)?codechef\.com\/users\//i],
    atcoder: [/^https?:\/\/(www\.)?atcoder\.jp\/users\//i],
    geeksforgeeks: [/^https?:\/\/(www\.)?geeksforgeeks\.org\/user\//i],
    codestudio: [/^https?:\/\/(www\.)?(naukri\.com\/code360\/profile|codingninjas\.com\/studio\/profile)\//i],
    interviewbit: [/^https?:\/\/(www\.)?interviewbit\.com\/profile\//i],
    hackerrank: [/^https?:\/\/(www\.)?hackerrank\.com\/profile\//i],
    github: [/^https?:\/\/(www\.)?github\.com\//i],
  };
  return patterns[platform].reduce((value, pattern) => value.replace(pattern, ""), handle).replace(/\/+$/, "").trim();
}

function signingSecret(): string {
  const secret = process.env.PLATFORM_VERIFICATION_SECRET;
  if (!secret || secret.length < 32) throw new Error("Platform verification is not configured");
  return secret;
}

function sign(payload: string): Buffer {
  return createHmac("sha256", signingSecret()).update(payload).digest();
}

export function createVerificationToken(challenge: VerificationChallenge): string {
  const payload = Buffer.from(JSON.stringify(challenge)).toString("base64url");
  return `${payload}.${sign(payload).toString("base64url")}`;
}

export function verifyVerificationToken(token: string): VerificationChallenge | null {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  try {
    const supplied = Buffer.from(signature, "base64url");
    const expected = sign(payload);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as VerificationChallenge;
    if (
      value.version !== 1 ||
      !SUPPORTED_VERIFICATION_PLATFORMS.includes(value.platform) ||
      !value.userId || !value.handle || !value.code || !value.nonce ||
      !Number.isSafeInteger(value.expiresAt) || value.expiresAt <= Date.now()
    ) return null;
    return value;
  } catch {
    return null;
  }
}

export function newVerificationChallenge(
  userId: string,
  platform: SupportedVerificationPlatform,
  handle: string,
): VerificationChallenge {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const random = randomBytes(10);
  const code = Array.from(random, (byte) => alphabet[byte % alphabet.length]).join("");
  return {
    version: 1,
    userId,
    platform,
    handle,
    code,
    expiresAt: Date.now() + 15 * 60 * 1000,
    nonce: randomBytes(16).toString("hex"),
  };
}
