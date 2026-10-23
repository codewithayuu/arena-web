import assert from "node:assert/strict";
import test from "node:test";
import { parseParticipantContestDirectory, parseParticipantContestMetadata } from "@/lib/contest-metadata";

const contestId = "71000000-0000-4000-8000-000000000001";

function fixture() {
  return {
    contest_id: contestId,
    name: "Spring Open",
    lifecycle_state: "scheduled",
    lifecycle_version: 4,
    phase: "upcoming",
    starts_at: "2030-01-02T03:04:05Z",
    ends_at: "2030-01-02T04:04:05Z",
    preflight_opens_at: "2030-01-02T02:49:05Z",
    first_admission_closes_at: "2030-01-02T03:09:05Z",
    late_join_grace_seconds: 300,
    server_time: "2030-01-02T02:00:00Z",
    registration: {
      mode: "individual",
      enabled: true,
      open: true,
      status: "registered",
      kind: "individual",
      team_size: null,
      team_min_size: null,
    },
    eligibility: { status: "preflight_not_open", may_request_preflight: false },
  };
}

test("contest metadata accepts the database snapshot and removes unrecognized fields", () => {
  const value = { ...fixture(), user_id: "private", private_bundle: { object_key: "private" } };
  const parsed = parseParticipantContestMetadata(value, contestId);
  assert.ok(parsed);
  assert.equal(parsed.phase, "upcoming");
  assert.equal(parsed.registration.status, "registered");
  assert.equal(parsed.eligibility.may_request_preflight, false);
  assert.equal("user_id" in parsed, false);
  assert.equal("private_bundle" in parsed, false);
});

test("contest metadata rejects a mismatched contest, malformed server time, or inconsistent eligibility", () => {
  assert.equal(parseParticipantContestMetadata(fixture(), "72000000-0000-4000-8000-000000000001"), null);

  const malformedTime = fixture();
  malformedTime.server_time = "not a timestamp";
  assert.equal(parseParticipantContestMetadata(malformedTime, contestId), null);

  const inconsistentEligibility = fixture();
  inconsistentEligibility.eligibility = { status: "eligible_for_preflight", may_request_preflight: false };
  assert.equal(parseParticipantContestMetadata(inconsistentEligibility, contestId), null);
});

test("contest metadata validates schedule windows and bounded late-join grace", () => {
  const badWindow = fixture();
  badWindow.first_admission_closes_at = "2030-01-02T03:20:00Z";
  assert.equal(parseParticipantContestMetadata(badWindow, contestId), null);

  const tooMuchGrace = fixture();
  tooMuchGrace.late_join_grace_seconds = 1801;
  assert.equal(parseParticipantContestMetadata(tooMuchGrace, contestId), null);
});

function directoryFixture(): {
  items: Array<{
    contest_id: string;
    name: string;
    lifecycle_state: string;
    lifecycle_version: number;
    phase: string;
    starts_at: string;
    ends_at: string;
    registration: {
      mode: "individual" | "team" | null;
      enabled: boolean;
      open: boolean;
      status: string | null;
      kind: "individual" | "team" | null;
    };
    [key: string]: unknown;
  }>;
  limit: number;
  offset: number;
  next_offset: number | null;
  server_time: string;
} {
  return {
    items: [{
      contest_id: contestId,
      name: "Spring Open",
      lifecycle_state: "scheduled",
      lifecycle_version: 4,
      phase: "upcoming",
      starts_at: "2030-01-02T03:04:05Z",
      ends_at: "2030-01-02T04:04:05Z",
      registration: { mode: "individual", enabled: true, open: true, status: null, kind: null },
      private_bundle: "must be discarded",
    }],
    limit: 20,
    offset: 0,
    next_offset: null,
    server_time: "2030-01-02T02:00:00Z",
  };
}

test("participant directory returns only validated, ordered public rows and server snapshot", () => {
  const parsed = parseParticipantContestDirectory(directoryFixture());
  assert.ok(parsed);
  assert.equal(parsed.server_time, "2030-01-02T02:00:00Z");
  assert.equal(parsed.items[0].registration.open, true);
  assert.equal("private_bundle" in parsed.items[0], false);
});

test("participant directory rejects malformed pagination, duplicate rows, and unsafe registration state", () => {
  const invalidPage = directoryFixture();
  invalidPage.next_offset = 20;
  assert.equal(parseParticipantContestDirectory(invalidPage), null);

  const duplicate = directoryFixture();
  duplicate.items.push({ ...duplicate.items[0] });
  assert.equal(parseParticipantContestDirectory(duplicate), null);

  const unsafeRegistration = directoryFixture();
  unsafeRegistration.items[0].registration.open = true;
  unsafeRegistration.items[0].registration.enabled = false;
  assert.equal(parseParticipantContestDirectory(unsafeRegistration), null);

  const privateShape = directoryFixture();
  (privateShape.items[0] as typeof privateShape.items[0] & { invite_code: string }).invite_code = "secret";
  const safeShape = parseParticipantContestDirectory(privateShape);
  assert.ok(safeShape);
  assert.equal("invite_code" in safeShape.items[0], false);
});
