import type { SupportedVerificationPlatform } from "./platform-verification";

export interface PlatformProviderStats {
  totalQuestionsSolved?: number;
  currentRating?: number;
  maxRating?: number;
  rank?: string;
}

export interface PlatformProviderProfile {
  verificationText: string;
  stats: PlatformProviderStats;
  profileStats: Record<string, unknown>;
}

export function fetchPlatformProfile(
  platform: SupportedVerificationPlatform,
  handle: string,
  options?: { includeExtended?: boolean },
): Promise<PlatformProviderProfile>;
