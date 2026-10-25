"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { UserProfileData, loadProfileFromStorage, PlatformProfile } from "@/lib/profile-data";
import { ProfileHeroCard } from "./profile-hero-card";
import { ProfileNavTabs, ProfileTabKey } from "./profile-nav-tabs";
import { ProblemSolvingPanel } from "./problem-solving-panel";
import { ContestRatingsPanel } from "./contest-ratings-panel";
import { DevelopmentPanel } from "./development-panel";
import { BadgesAndCardPanel } from "./badges-and-card-panel";
import { JourneyAboutPanel } from "./journey-about-panel";
import { ConnectAccountsModal } from "./connect-accounts-modal";
import { EditProfileModal } from "./edit-profile-modal";
import { ShareProfileModal } from "./share-profile-modal";
import { PageLoading } from "@/components/ui/page-loading";

interface ProfileViewProps {
  initialUsername: string;
  initialTab?: ProfileTabKey;
}

export function ProfileView({ initialUsername, initialTab = "problemSolving" }: ProfileViewProps) {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const clerkUserId = user?.id;
  const clerkUsername = user?.username;
  const clerkFirstName = user?.firstName;
  const [profile, setProfile] = useState<UserProfileData>(() =>
    loadProfileFromStorage(initialUsername)
  );
  const [isOwner, setIsOwner] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [activeTab, setActiveTab] = useState<ProfileTabKey>(initialTab);

  // Modals state
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Load a local cache immediately, then hydrate owned or public data from Supabase.
  useEffect(() => {
    if (!isClerkLoaded) return;

    const loaded = loadProfileFromStorage(initialUsername);
    setProfile(loaded);
    const requested = initialUsername.trim().toLowerCase();
    const ownNames = [clerkUsername, clerkFirstName?.toLowerCase(), clerkUserId]
      .filter((value): value is string => Boolean(value))
      .map((value) => value.toLowerCase());
    const isOwnerRoute = isClerkLoaded && Boolean(clerkUserId) && ownNames.includes(requested);

    let cancelled = false;
    setIsProfileLoading(true);
    setProfileLoadError(null);
    const profileUrl = isOwnerRoute
      ? "/api/profile/me"
      : `/api/profile/${encodeURIComponent(initialUsername)}`;
    void fetch(profileUrl, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.json().catch(() => ({})) as { error?: string };
          throw new Error(body.error || "Profile could not be loaded");
        }
        const data = await response.json();
        if (cancelled) return;
        setIsOwner(profileUrl === "/api/profile/me" || data.isOwner === true);
        const stored = loadProfileFromStorage(initialUsername);
        const platformMeta = {
          codeforces: { name: "Codeforces", color: "#3b82f6", url: "https://codeforces.com/profile/" },
          leetcode: { name: "LeetCode", color: "#f59e0b", url: "https://leetcode.com/u/" },
          codechef: { name: "CodeChef", color: "#8b5cf6", url: "https://www.codechef.com/users/" },
          atcoder: { name: "AtCoder", color: "#94a3b8", url: "https://atcoder.jp/users/" },
          geeksforgeeks: { name: "GeeksforGeeks", color: "#10b981", url: "https://www.geeksforgeeks.org/user/" },
          codestudio: { name: "CodeStudio", color: "#f97316", url: "https://www.naukri.com/code360/profile/" },
          interviewbit: { name: "InterviewBit", color: "#38bdf8", url: "https://www.interviewbit.com/profile/" },
          hackerrank: { name: "HackerRank", color: "#10b981", url: "https://www.hackerrank.com/profile/" },
          github: { name: "GitHub", color: "#ffffff", url: "https://github.com/" },
        } as const;
        const ratedContestPlatforms = new Set(["codeforces", "leetcode", "codechef", "atcoder"]);
        const platforms: PlatformProfile[] = (Array.isArray(data.platforms) ? data.platforms : []).map((row: {
          platform: keyof typeof platformMeta;
          handle: string;
          total_questions_solved: number | null;
          current_rating: number | null;
          max_rating: number | null;
          rank: string | null;
          last_synced_at: string | null;
          profile_stats: Record<string, unknown>;
        }) => ({
          platform: row.platform,
          name: platformMeta[row.platform].name,
          userName: row.handle,
          profileUrl: `${platformMeta[row.platform].url}${encodeURIComponent(row.handle)}`,
          isConnected: true,
          isVerified: true,
          lastSyncedAt: row.last_synced_at ?? undefined,
          profileStats: row.profile_stats ?? {},
          difficultyStats: (() => {
            const stats = row.profile_stats?.difficultyStats;
            if (!stats || typeof stats !== "object") return undefined;
            const values = stats as Record<string, unknown>;
            if (typeof values.easy !== "number" || typeof values.medium !== "number" || typeof values.hard !== "number") return undefined;
            return {
              easy: values.easy,
              medium: values.medium,
              hard: values.hard,
              ...(typeof values.basic === "number" ? { basic: values.basic } : {}),
              ...(typeof values.school === "number" ? { school: values.school } : {}),
            };
          })(),
          totalQuestionsSolved: row.total_questions_solved,
          currentRating: row.current_rating ?? undefined,
          maxRating: row.max_rating ?? undefined,
          rank: row.rank ?? undefined,
          contestCount: Array.isArray(row.profile_stats?.contestHistory)
            ? row.profile_stats.contestHistory.length
            : typeof row.profile_stats?.ratedContests === "number" ? row.profile_stats.ratedContests : undefined,
          stars: typeof row.profile_stats?.stars === "number" ? row.profile_stats.stars : undefined,
          totalActiveDays: typeof row.profile_stats?.totalActiveDays === "number" ? row.profile_stats.totalActiveDays : undefined,
          maxStreak: typeof row.profile_stats?.maxStreak === "number" ? row.profile_stats.maxStreak : undefined,
          badgeCount: Array.isArray(row.profile_stats?.badges) ? row.profile_stats.badges.length : undefined,
          color: platformMeta[row.platform].color,
        }));
        const submissionHeatmap: Record<string, number> = {};
        const topicDistribution: Record<string, number> = {};
        const contests: UserProfileData["contests"] = [];
        const badges: UserProfileData["badges"] = [];
        let hasActivityHistory = false;
        let currentStreak: number | null = null;
        let maxStreak: number | null = null;
        for (const platform of platforms) {
          const stats = platform.profileStats ?? {};
          const activity = stats.activityByDay;
          if (activity && typeof activity === "object" && !Array.isArray(activity)) {
            hasActivityHistory = true;
            for (const [date, rawCount] of Object.entries(activity)) {
              if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || typeof rawCount !== "number" || !Number.isFinite(rawCount) || rawCount < 0) continue;
              submissionHeatmap[date] = (submissionHeatmap[date] ?? 0) + rawCount;
            }
          }
          const topics = stats.topicDistribution;
          if (topics && typeof topics === "object" && !Array.isArray(topics)) {
            for (const [name, rawCount] of Object.entries(topics)) {
              if (typeof rawCount !== "number" || !Number.isFinite(rawCount) || rawCount < 0) continue;
              topicDistribution[name] = (topicDistribution[name] ?? 0) + rawCount;
            }
          }
          if (Array.isArray(stats.contestHistory)) {
            for (const item of stats.contestHistory) {
              if (!ratedContestPlatforms.has(platform.platform)) continue;
              if (!item || typeof item !== "object") continue;
              const row = item as Record<string, unknown>;
              if (typeof row.contestName !== "string" || typeof row.rating !== "number" || typeof row.rank !== "number" || typeof row.contestDate !== "number") continue;
              contests.push({
                contestName: row.contestName,
                platform: platform.platform as UserProfileData["contests"][number]["platform"],
                rating: row.rating,
                rank: row.rank,
                contestDate: row.contestDate,
                ...(typeof row.ratingChange === "number" ? { ratingChange: row.ratingChange } : {}),
              });
            }
          }
          if (Array.isArray(stats.badges)) {
            for (const item of stats.badges) {
              if (!item || typeof item !== "object") continue;
              const row = item as Record<string, unknown>;
              if (typeof row.id !== "string" || typeof row.badgeName !== "string") continue;
              badges.push({
                id: `${platform.platform}:${row.id}`,
                badgeName: row.badgeName,
                platform: platform.name,
                ...(typeof row.icon === "string" ? { icon: row.icon } : {}),
                ...(typeof row.dateEarned === "string" ? { dateEarned: row.dateEarned } : {}),
                ...(typeof row.category === "string" ? { category: row.category } : {}),
              });
            }
          }
          if (typeof stats.currentStreak === "number" && Number.isFinite(stats.currentStreak)) {
            currentStreak = Math.max(currentStreak ?? 0, stats.currentStreak);
          }
          if (typeof stats.maxStreak === "number" && Number.isFinite(stats.maxStreak)) {
            maxStreak = Math.max(maxStreak ?? 0, stats.maxStreak);
          }
        }
        const fallbackName = String(data.profile.display_name || "Member").trim().split(/\s+/);
        const arenaContests: UserProfileData["arenaContests"] = (Array.isArray(data.arenaContests) ? data.arenaContests : [])
          .filter((item: unknown) => {
            if (!item || typeof item !== "object") return false;
            const row = item as Record<string, unknown>;
            return typeof row.contestId === "string" && typeof row.slug === "string" &&
              typeof row.name === "string" && typeof row.endsAt === "string" && Number.isFinite(Date.parse(row.endsAt)) &&
              Number.isSafeInteger(row.rank) && Number(row.rank) > 0 &&
              Number.isSafeInteger(row.solved) && Number(row.solved) >= 0 &&
              typeof row.points === "number" && Number.isFinite(row.points) && row.points >= 0 &&
              Number.isSafeInteger(row.penaltyMinutes) && Number(row.penaltyMinutes) >= 0 &&
              (row.state === "published" || row.state === "archived") &&
              (row.executionMode === undefined || row.executionMode === "participant_local" || row.executionMode === "server_judged");
          })
          .map((item: Record<string, unknown>) => ({
            contestId: item.contestId as string,
            slug: item.slug as string,
            name: item.name as string,
            endsAt: item.endsAt as string,
            rank: item.rank as number,
            solved: item.solved as number,
            points: item.points as number,
            penaltyMinutes: item.penaltyMinutes as number,
            state: item.state as "published" | "archived",
            ...(item.executionMode ? { executionMode: item.executionMode as "participant_local" | "server_judged" } : {}),
          }));
        const arenaContestHistoryStatus = ["available", "partial", "unavailable"].includes(data.arenaContestHistoryStatus)
          ? data.arenaContestHistoryStatus as UserProfileData["arenaContestHistoryStatus"]
          : "unavailable";
        const synced: UserProfileData = {
          ...stored,
          id: data.profile.id || stored.id,
          username: data.profile.handle,
          profileViews: typeof data.profile.views === "number" && Number.isFinite(data.profile.views) ? data.profile.views : null,
          firstName: data.details.first_name || fallbackName[0] || "Member",
          secondName: data.details.second_name || fallbackName.slice(1).join(" "),
          personalDetails: {
            ...stored.personalDetails,
            bio: data.details.bio,
            country: data.details.country,
            college: data.details.college,
            degree: data.details.degree,
            branch: data.details.branch,
            imageUrl: data.details.image_url,
            yearOfGraduation: data.details.year_of_graduation,
            jobPreference: data.details.job_preference,
          },
          platforms,
          contests,
          arenaContests,
          arenaContestHistoryStatus,
          badges,
          submissionHeatmap,
          topicDistribution,
          totalActiveDays: hasActivityHistory ? Object.keys(submissionHeatmap).length : null,
          currentStreak,
          maxStreak,
          problemSolvingTags: Object.entries(topicDistribution).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([tag]) => tag),
          github: (() => {
            const account = platforms.find((platform) => platform.platform === "github");
            const stats = account?.profileStats;
            const repos = Array.isArray(stats?.topRepos) ? stats.topRepos as UserProfileData["github"]["topRepos"] : [];
            const languages = stats?.languages && typeof stats.languages === "object"
              ? stats.languages as Record<string, number>
              : {};
            return {
              ...stored.github,
              githubProfile: account?.userName ?? "",
              publicRepos: typeof stats?.publicRepos === "number" ? stats.publicRepos : undefined,
              followers: typeof stats?.followers === "number" ? stats.followers : undefined,
              following: typeof stats?.following === "number" ? stats.following : undefined,
              totalStars: typeof stats?.totalStars === "number" ? stats.totalStars : undefined,
              sampledRepositories: typeof stats?.sampledRepositories === "number" ? stats.sampledRepositories : undefined,
              recentPublicEvents: typeof stats?.recentPublicEvents === "number" ? stats.recentPublicEvents : null,
              recentPublicPushes: typeof stats?.recentPublicPushes === "number" ? stats.recentPublicPushes : null,
              recentPublicCommits: typeof stats?.recentPublicCommits === "number" ? stats.recentPublicCommits : null,
              recentPublicPullRequests: typeof stats?.recentPublicPullRequests === "number" ? stats.recentPublicPullRequests : null,
              recentPublicIssues: typeof stats?.recentPublicIssues === "number" ? stats.recentPublicIssues : null,
              recentPublicActiveDays: typeof stats?.recentPublicActiveDays === "number" ? stats.recentPublicActiveDays : null,
              publicActivityWindowDays: typeof stats?.publicActivityWindowDays === "number" ? stats.publicActivityWindowDays : null,
              publicActivityEventLimit: typeof stats?.publicActivityEventLimit === "number" ? stats.publicActivityEventLimit : null,
              publicActivityByDay: stats?.publicActivityByDay && typeof stats.publicActivityByDay === "object"
                ? stats.publicActivityByDay as Record<string, number>
                : {},
              publicActivityAvailable: stats?.publicActivityAvailable === true,
              languages,
              topRepos: repos,
            };
          })(),
          totalQuestionsSolved: platforms.reduce<number | null>((total, platform) => platform.totalQuestionsSolved === null
            ? total
            : (total ?? 0) + platform.totalQuestionsSolved, null),
        };
        setProfile(synced);
      })
      .catch((error) => {
        if (!cancelled) setProfileLoadError(error instanceof Error ? error.message : "Profile could not be loaded");
      })
      .finally(() => { if (!cancelled) setIsProfileLoading(false); });
    return () => { cancelled = true; };
  }, [initialUsername, isClerkLoaded, clerkUserId, clerkUsername, clerkFirstName, reloadVersion]);

  const handleTabChange = (tab: ProfileTabKey) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const urlTab = tab === "problemSolving" ? "problemSolving" : tab;
      window.history.replaceState({}, "", `/profile/${encodeURIComponent(profile.username)}/${urlTab}`);
    }
  };

  const handleUpdatePlatforms = (updatedPlatforms: PlatformProfile[]) => {
    const newSolved = updatedPlatforms.reduce<number | null>((acc, p) => p.totalQuestionsSolved === null
      ? acc
      : (acc ?? 0) + p.totalQuestionsSolved, null);
    const updated: UserProfileData = {
      ...profile,
      platforms: updatedPlatforms,
      totalQuestionsSolved: newSolved,
    };
    setProfile(updated);
  };

  const handleSaveProfile = async (updatedProfile: UserProfileData) => {
    const response = await fetch("/api/profile/me", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        firstName: updatedProfile.firstName,
        secondName: updatedProfile.secondName,
        details: {
          ...updatedProfile.personalDetails,
          imageUrl: updatedProfile.personalDetails.imageUrl,
        },
      }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { error?: string } | null;
      throw new Error(body?.error || "Profile could not be saved");
    }
    setProfile(updatedProfile);
  };

  if (isProfileLoading) {
    return <PageLoading variant="profile" label="member profile" embedded />;
  }

  if (profileLoadError) {
    return (
      <div role="alert" className="mx-auto max-w-4xl px-6 py-24 text-center text-sm text-zinc-300">
        <p>{profileLoadError}</p>
        <button
          type="button"
          onClick={() => setReloadVersion((version) => version + 1)}
          className="mt-4 rounded-lg border border-white/15 bg-white/5 px-4 py-2 font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff1018]"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-transparent text-foreground selection:bg-[#ff1018]/30 selection:text-white">
      {/* Main Container sitting above the ambient frosted glass atmosphere */}
      <div className="max-w-[1640px] mx-auto px-3 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* Left Column: Hero Card & Platform Scorecards Sidebar */}
          <ProfileHeroCard
            profile={profile}
            canEdit={isOwner}
            onOpenEdit={() => setIsEditOpen(true)}
            onOpenConnect={() => setIsConnectOpen(true)}
            onOpenCardModal={() => handleTabChange("badgesCard")}
            onOpenShareModal={() => setIsShareOpen(true)}
          />

          {/* Right Column: Tabbed Content Area */}
          <div className="flex-1 min-w-0 w-full space-y-4">
            {/* Nav Tabs */}
            <ProfileNavTabs
              activeTab={activeTab}
              onSelectTab={handleTabChange}
              solvedCount={profile.totalQuestionsSolved ?? 0}
              contestsCount={profile.contests.length + profile.arenaContests.length}
              contributionsCount={profile.github.totalContributions}
              badgesCount={profile.badges.length}
            />

            {/* Active Panel Views */}
            {activeTab === "problemSolving" && (
              <ProblemSolvingPanel
                profile={profile}
                onOpenConnect={() => setIsConnectOpen(true)}
              />
            )}

            {activeTab === "contests" && (
              <ContestRatingsPanel profile={profile} />
            )}

            {activeTab === "development" && (
              <DevelopmentPanel profile={profile} />
            )}

            {activeTab === "badgesCard" && (
              <BadgesAndCardPanel profile={profile} />
            )}

            {activeTab === "about" && (
              <JourneyAboutPanel profile={profile} />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConnectAccountsModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        profile={profile}
        onUpdatePlatforms={handleUpdatePlatforms}
      />

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <ShareProfileModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        profile={profile}
      />
    </div>
  );
}
