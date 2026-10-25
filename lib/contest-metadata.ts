export type ContestLifecycleState =
  | "scheduled"
  | "preflight"
  | "admitting"
  | "active"
  | "paused"
  | "finalizing"
  | "review"
  | "published"
  | "archived";

export type ContestSchedulePhase =
  | "upcoming"
  | "preflight"
  | "admission_grace"
  | "contest_window"
  | "ended"
  | "paused"
  | "finalizing"
  | "review"
  | "published"
  | "archived";

export type ContestEligibilityStatus =
  | "registration_required"
  | "registration_inactive"
  | "admin_reentry_required"
  | "contest_not_admitting"
  | "preflight_not_open"
  | "admission_window_closed"
  | "team_incomplete"
  | "eligible_for_preflight";

export type ParticipantContestMetadata = {
  contest_id: string;
  name: string;
  lifecycle_state: ContestLifecycleState;
  lifecycle_version: number;
  phase: ContestSchedulePhase;
  starts_at: string;
  ends_at: string;
  preflight_minutes: number;
  preflight_opens_at: string;
  first_admission_closes_at: string;
  late_join_grace_seconds: number;
  server_time: string;
  registration: {
    mode: "individual" | "team" | null;
    enabled: boolean;
    open: boolean;
    status: string | null;
    kind: "individual" | "team" | null;
    team_size: number | null;
    team_min_size: number | null;
  };
  eligibility: {
    status: ContestEligibilityStatus;
    may_request_preflight: boolean;
  };
};

export type ParticipantContestSummary = {
  contest_id: string;
  name: string;
  lifecycle_state: ContestLifecycleState;
  lifecycle_version: number;
  phase: ContestSchedulePhase;
  starts_at: string;
  ends_at: string;
  preflight_minutes: number;
  preflight_opens_at: string;
  registration: {
    mode: "individual" | "team" | null;
    enabled: boolean;
    open: boolean;
    status: string | null;
    kind: "individual" | "team" | null;
  };
};

export type ParticipantContestDirectory = {
  items: ParticipantContestSummary[];
  limit: number;
  offset: number;
  next_offset: number | null;
  server_time: string;
};

export type PublicContestSummary = {
  contest_id: string;
  name: string;
  lifecycle_state: ContestLifecycleState;
  phase: ContestSchedulePhase;
  starts_at: string;
  ends_at: string;
  preflight_minutes: number;
  preflight_opens_at: string;
  problem_count: number;
  registration_enabled: boolean;
};

export type PublicContestDirectory = {
  items: PublicContestSummary[];
  limit: number;
  offset: number;
  next_offset: number | null;
  server_time: string;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const LIFECYCLE_STATES = new Set<ContestLifecycleState>([
  "scheduled", "preflight", "admitting", "active", "paused", "finalizing", "review", "published", "archived",
]);
const SCHEDULE_PHASES = new Set<ContestSchedulePhase>([
  "upcoming", "preflight", "admission_grace", "contest_window", "ended", "paused", "finalizing", "review", "published", "archived",
]);
const ELIGIBILITY_STATUSES = new Set<ContestEligibilityStatus>([
  "registration_required", "registration_inactive", "admin_reentry_required", "contest_not_admitting",
  "preflight_not_open", "admission_window_closed", "team_incomplete", "eligible_for_preflight",
]);

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function dateTime(value: unknown): value is string {
  return typeof value === "string" && RFC3339.test(value) && Number.isFinite(Date.parse(value));
}

function boundedInteger(value: unknown, minimum: number, maximum: number): value is number {
  return Number.isSafeInteger(value) && (value as number) >= minimum && (value as number) <= maximum;
}

function nullableKind(value: unknown): value is "individual" | "team" | null {
  return value === null || value === "individual" || value === "team";
}

/** Parse a gateway response and return only the caller-safe display fields. */
export function parseParticipantContestMetadata(
  value: unknown,
  expectedContestId: string,
): ParticipantContestMetadata | null {
  const metadata = record(value);
  const registration = record(metadata?.registration);
  const eligibility = record(metadata?.eligibility);
  if (!metadata || !registration || !eligibility || !UUID.test(expectedContestId) ||
      typeof metadata.contest_id !== "string" || metadata.contest_id.toLowerCase() !== expectedContestId.toLowerCase() ||
      typeof metadata.name !== "string" || metadata.name.trim().length === 0 || metadata.name.length > 160 ||
      typeof metadata.lifecycle_state !== "string" || !LIFECYCLE_STATES.has(metadata.lifecycle_state as ContestLifecycleState) ||
      !boundedInteger(metadata.lifecycle_version, 0, Number.MAX_SAFE_INTEGER) ||
      typeof metadata.phase !== "string" || !SCHEDULE_PHASES.has(metadata.phase as ContestSchedulePhase) ||
      !dateTime(metadata.starts_at) || !dateTime(metadata.ends_at) || !dateTime(metadata.preflight_opens_at) ||
      !dateTime(metadata.first_admission_closes_at) || !dateTime(metadata.server_time) ||
      !boundedInteger(metadata.preflight_minutes, 0, 120) ||
      Date.parse(metadata.ends_at) <= Date.parse(metadata.starts_at) ||
      Date.parse(metadata.preflight_opens_at) !== Date.parse(metadata.starts_at) - metadata.preflight_minutes * 60_000 ||
      Date.parse(metadata.first_admission_closes_at) !== Math.min(
        Date.parse(metadata.starts_at) + (boundedInteger(metadata.late_join_grace_seconds, 0, 1800) ? metadata.late_join_grace_seconds : -1) * 1000,
        Date.parse(metadata.ends_at),
      ) || !boundedInteger(metadata.late_join_grace_seconds, 0, 1800) ||
      !nullableKind(registration.mode) || typeof registration.enabled !== "boolean" || typeof registration.open !== "boolean" ||
      !(registration.status === null || (typeof registration.status === "string" && /^[a-z][a-z0-9_]{0,31}$/.test(registration.status))) ||
      !nullableKind(registration.kind) ||
      !(registration.team_size === null || boundedInteger(registration.team_size, 0, 32)) ||
      !(registration.team_min_size === null || boundedInteger(registration.team_min_size, 1, 32)) ||
      typeof eligibility.status !== "string" || !ELIGIBILITY_STATUSES.has(eligibility.status as ContestEligibilityStatus) ||
      typeof eligibility.may_request_preflight !== "boolean" ||
      eligibility.may_request_preflight !== (eligibility.status === "eligible_for_preflight") ||
      (registration.open && (!registration.enabled || registration.mode === null || metadata.lifecycle_state !== "scheduled" ||
        Date.parse(metadata.server_time) >= Date.parse(metadata.starts_at))) ||
      (registration.kind === "team" && registration.mode !== "team")) {
    return null;
  }

  return {
    contest_id: expectedContestId.toLowerCase(),
    name: metadata.name,
    lifecycle_state: metadata.lifecycle_state as ContestLifecycleState,
    lifecycle_version: metadata.lifecycle_version as number,
    phase: metadata.phase as ContestSchedulePhase,
    starts_at: metadata.starts_at,
    ends_at: metadata.ends_at,
    preflight_minutes: metadata.preflight_minutes as number,
    preflight_opens_at: metadata.preflight_opens_at,
    first_admission_closes_at: metadata.first_admission_closes_at,
    late_join_grace_seconds: metadata.late_join_grace_seconds as number,
    server_time: metadata.server_time,
    registration: {
      mode: registration.mode,
      enabled: registration.enabled,
      open: registration.open,
      status: registration.status as string | null,
      kind: registration.kind,
      team_size: registration.team_size as number | null,
      team_min_size: registration.team_min_size as number | null,
    },
    eligibility: {
      status: eligibility.status as ContestEligibilityStatus,
      may_request_preflight: eligibility.may_request_preflight,
    },
  };
}

/** Parse the gateway's no-store discovery page; never accept private fields. */
export function parseParticipantContestDirectory(value: unknown): ParticipantContestDirectory | null {
  const directory = record(value);
  if (!directory || !boundedInteger(directory.limit, 1, 50) ||
      !boundedInteger(directory.offset, 0, 10_000) || !dateTime(directory.server_time) ||
      !Array.isArray(directory.items) || directory.items.length > directory.limit ||
      !(directory.next_offset === null ||
        directory.next_offset === directory.offset + directory.limit &&
        boundedInteger(directory.next_offset, 1, 10_050)) ||
      (directory.next_offset !== null && directory.items.length !== directory.limit)) return null;

  const items: ParticipantContestSummary[] = [];
  const ids = new Set<string>();
  let priorStartMs = Number.NEGATIVE_INFINITY;
  for (const candidate of directory.items) {
    const item = record(candidate);
    const registration = record(item?.registration);
    if (!item || !registration || typeof item.contest_id !== "string" || !UUID.test(item.contest_id) ||
        ids.has(item.contest_id.toLowerCase()) || typeof item.name !== "string" ||
        item.name.trim().length === 0 || item.name.length > 160 ||
        typeof item.lifecycle_state !== "string" || !LIFECYCLE_STATES.has(item.lifecycle_state as ContestLifecycleState) ||
        !boundedInteger(item.lifecycle_version, 0, Number.MAX_SAFE_INTEGER) ||
        typeof item.phase !== "string" || !SCHEDULE_PHASES.has(item.phase as ContestSchedulePhase) ||
        !dateTime(item.starts_at) || !dateTime(item.ends_at) || !dateTime(item.preflight_opens_at) ||
        !boundedInteger(item.preflight_minutes, 0, 120) ||
        Date.parse(item.preflight_opens_at) !== Date.parse(item.starts_at) - item.preflight_minutes * 60_000 ||
        Date.parse(item.ends_at) <= Date.parse(item.starts_at) ||
        Date.parse(item.starts_at) < priorStartMs ||
        !nullableKind(registration.mode) || typeof registration.enabled !== "boolean" ||
        typeof registration.open !== "boolean" ||
        !(registration.status === null || (typeof registration.status === "string" && /^[a-z][a-z0-9_]{0,31}$/.test(registration.status))) ||
        !nullableKind(registration.kind) ||
        (registration.open && (!registration.enabled || registration.mode === null || item.lifecycle_state !== "scheduled" ||
          Date.parse(directory.server_time) >= Date.parse(item.starts_at))) ||
        (registration.kind === "team" && registration.mode !== "team")) return null;
    ids.add(item.contest_id.toLowerCase());
    priorStartMs = Date.parse(item.starts_at);
    items.push({
      contest_id: item.contest_id.toLowerCase(),
      name: item.name,
      lifecycle_state: item.lifecycle_state as ContestLifecycleState,
      lifecycle_version: item.lifecycle_version as number,
      phase: item.phase as ContestSchedulePhase,
      starts_at: item.starts_at,
      ends_at: item.ends_at,
      preflight_minutes: item.preflight_minutes,
      preflight_opens_at: item.preflight_opens_at,
      registration: {
        mode: registration.mode,
        enabled: registration.enabled,
        open: registration.open,
        status: registration.status as string | null,
        kind: registration.kind,
      },
    });
  }

  return {
    items,
    limit: directory.limit,
    offset: directory.offset,
    next_offset: directory.next_offset as number | null,
    server_time: directory.server_time,
  };
}

/** Parse the unauthenticated public schedule projection; it contains no registration or contest content. */
export function parsePublicContestDirectory(value: unknown): PublicContestDirectory | null {
  const directory = record(value);
  if (!directory || !boundedInteger(directory.limit, 1, 50) || !boundedInteger(directory.offset, 0, 10_000) ||
      !dateTime(directory.server_time) || !Array.isArray(directory.items) || directory.items.length > directory.limit ||
      !(directory.next_offset === null || directory.next_offset === directory.offset + directory.limit &&
        boundedInteger(directory.next_offset, 1, 10_050)) ||
      (directory.next_offset !== null && directory.items.length !== directory.limit)) return null;
  const items: PublicContestSummary[] = [];
  const ids = new Set<string>();
  let priorStartMs = Number.NEGATIVE_INFINITY;
  for (const candidate of directory.items) {
    const item = record(candidate);
    if (!item || typeof item.contest_id !== "string" || !UUID.test(item.contest_id) || ids.has(item.contest_id.toLowerCase()) ||
        typeof item.name !== "string" || !item.name.trim() || item.name.length > 160 ||
        typeof item.lifecycle_state !== "string" || !LIFECYCLE_STATES.has(item.lifecycle_state as ContestLifecycleState) ||
        typeof item.phase !== "string" || !SCHEDULE_PHASES.has(item.phase as ContestSchedulePhase) ||
        !dateTime(item.starts_at) || !dateTime(item.ends_at) || !dateTime(item.preflight_opens_at) ||
        !boundedInteger(item.preflight_minutes, 0, 120) ||
        Date.parse(item.ends_at) <= Date.parse(item.starts_at) ||
        Date.parse(item.preflight_opens_at) !== Date.parse(item.starts_at) - item.preflight_minutes * 60_000 ||
        Date.parse(item.starts_at) < priorStartMs || !boundedInteger(item.problem_count, 1, 256) ||
        typeof item.registration_enabled !== "boolean") return null;
    ids.add(item.contest_id.toLowerCase());
    priorStartMs = Date.parse(item.starts_at);
    items.push({ contest_id: item.contest_id.toLowerCase(), name: item.name,
      lifecycle_state: item.lifecycle_state as ContestLifecycleState, phase: item.phase as ContestSchedulePhase,
      starts_at: item.starts_at, ends_at: item.ends_at, preflight_minutes: item.preflight_minutes,
      preflight_opens_at: item.preflight_opens_at, problem_count: item.problem_count,
      registration_enabled: item.registration_enabled });
  }
  return { items, limit: directory.limit, offset: directory.offset, next_offset: directory.next_offset as number | null,
    server_time: directory.server_time };
}
