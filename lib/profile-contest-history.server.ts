import "server-only";

import { getPublicContestStandings } from "@/lib/contest-submissions";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HISTORY_LIMIT = 1000;
const STANDINGS_CONCURRENCY = 6;

export type ProfileContestExecutionMode = "participant_local" | "server_judged";

export interface ProfileContestResult {
  contestId: string;
  slug: string;
  name: string;
  endsAt: string;
  rank: number;
  solved: number;
  points: number;
  penaltyMinutes: number;
  state: "published" | "archived";
  executionMode?: ProfileContestExecutionMode;
}

export type ProfileContestHistoryStatus = "available" | "partial" | "unavailable";

export interface ProfileContestHistory {
  items: ProfileContestResult[];
  status: ProfileContestHistoryStatus;
}

interface RegistrationRow {
  contest_id: string;
  registration_kind: "individual" | "team";
  team_id: string | null;
  status: string;
}

interface ContestRow {
  id: string;
  slug: string;
  name: string;
  ends_at: string;
  state: string;
  current_policy_version: number;
  configuration: unknown;
}

interface TeamRow {
  id: string;
  contest_id: string;
  name: string;
}

interface PolicyRow {
  contest_id: string;
  revision: number;
  content: unknown;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function listFilter(values: string[]): string | null {
  const unique = [...new Set(values)];
  if (!unique.length || unique.some((value) => !UUID.test(value))) return null;
  return `in.(${unique.join(",")})`;
}

async function queryRows<T>(table: string, params: Record<string, string>): Promise<T[]> {
  const url = supabaseRestUrl(table);
  url.search = new URLSearchParams(params).toString();
  const response = await supabaseRequest(url, { method: "GET" });
  if (!response.ok) throw new Error("Profile contest history lookup failed");
  return await response.json() as T[];
}

function configuredExecutionMode(contest: ContestRow, policyRows: PolicyRow[]): ProfileContestExecutionMode | undefined {
  const policy = policyRows.find((row) => row.contest_id === contest.id && row.revision === contest.current_policy_version);
  const policyContent = asRecord(policy?.content);
  const configuration = asRecord(contest.configuration);
  const policySettings = asRecord(configuration?.signed_policy_settings);
  const mode = policyContent?.execution_mode ?? policySettings?.execution_mode;
  return mode === "participant_local" || mode === "server_judged" ? mode : undefined;
}

async function mapConcurrent<T, R>(items: T[], concurrency: number, mapper: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index]);
    }
  }));
  return results;
}

/**
 * Return only this profile's rows from contests whose public standings have
 * already been published. Live/review standings and hidden activity are never
 * copied into a member profile.
 */
export async function getProfileContestHistory(profileId: string, profileHandle: string): Promise<ProfileContestHistory> {
  if (!UUID.test(profileId) || !/^[A-Za-z0-9_.-]{1,80}$/.test(profileHandle)) {
    return { items: [], status: "unavailable" };
  }

  try {
    const registrations = await queryRows<RegistrationRow>("registrations", {
      select: "contest_id,registration_kind,team_id,status",
      user_id: `eq.${profileId}`,
      status: "eq.registered",
      limit: String(HISTORY_LIMIT),
    });
    const registered = registrations.filter((row) =>
      UUID.test(row.contest_id) && row.status === "registered" &&
      (row.registration_kind === "individual" || row.registration_kind === "team"),
    );
    const contestFilter = listFilter(registered.map((row) => row.contest_id));
    if (!contestFilter) return { items: [], status: "available" };

    const contests = await queryRows<ContestRow>("contests", {
      select: "id,slug,name,ends_at,state,current_policy_version,configuration",
      id: contestFilter,
      state: "in.(published,archived)",
      order: "ends_at.desc",
      limit: String(HISTORY_LIMIT),
    });
    const finalContests = contests.filter((contest) =>
      UUID.test(contest.id) && (contest.state === "published" || contest.state === "archived") &&
      Number.isFinite(Date.parse(contest.ends_at)) && Date.parse(contest.ends_at) <= Date.now(),
    );
    if (!finalContests.length) return { items: [], status: "available" };

    const contestIds = listFilter(finalContests.map((contest) => contest.id));
    const teamIds = listFilter(registered
      .filter((row) => row.registration_kind === "team" && row.team_id)
      .map((row) => row.team_id as string));
    const [teams, policyRows] = await Promise.all([
      teamIds
        ? queryRows<TeamRow>("contest_teams", { select: "id,contest_id,name", id: teamIds, limit: String(HISTORY_LIMIT) })
        : Promise.resolve([] as TeamRow[]),
      contestIds
        ? queryRows<PolicyRow>("contest_policy_versions", {
          select: "contest_id,revision,content",
          contest_id: contestIds,
          order: "revision.desc",
          limit: String(HISTORY_LIMIT),
        }).catch(() => [] as PolicyRow[])
        : Promise.resolve([] as PolicyRow[]),
    ]);
    const teamByEntry = new Map(teams.map((team) => [`${team.contest_id}:${team.id}`, team.name]));
    const contestById = new Map(finalContests.map((contest) => [contest.id, contest]));
    const registrationsByContest = new Map<string, RegistrationRow[]>();
    for (const registration of registered) {
      const group = registrationsByContest.get(registration.contest_id) ?? [];
      group.push(registration);
      registrationsByContest.set(registration.contest_id, group);
    }

    let standingsUnavailable = false;
    const rows = await mapConcurrent(finalContests, STANDINGS_CONCURRENCY, async (contest) => {
      try {
        const standings = await getPublicContestStandings(contest.id, { revalidateSeconds: 60 });
        if (standings.state !== "published" && standings.state !== "archived") return [];
        const candidates = registrationsByContest.get(contest.id) ?? [];
        const expectedNames = new Set(candidates.flatMap((registration) => {
          if (registration.registration_kind === "individual") return [profileHandle];
          if (!registration.team_id) return [];
          const teamName = teamByEntry.get(`${contest.id}:${registration.team_id}`);
          return teamName ? [teamName] : [];
        }));
        const ownRows = standings.rows.filter((row) => expectedNames.has(row.participant));
        const mode = configuredExecutionMode(contestById.get(contest.id)!, policyRows);
        return ownRows.map((row) => ({
          contestId: contest.id,
          slug: contest.slug,
          name: contest.name,
          endsAt: contest.ends_at,
          rank: row.rank,
          solved: row.solved,
          points: row.points,
          penaltyMinutes: row.penalty_minutes,
          state: contest.state as "published" | "archived",
          ...(mode ? { executionMode: mode } : {}),
        } satisfies ProfileContestResult));
      } catch {
        standingsUnavailable = true;
        return [];
      }
    });

    const items = rows.flat().sort((left, right) => Date.parse(right.endsAt) - Date.parse(left.endsAt));
    return { items, status: standingsUnavailable ? "partial" : "available" };
  } catch {
    return { items: [], status: "unavailable" };
  }
}
