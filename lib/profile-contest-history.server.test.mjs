import { afterEach, expect, mock, test } from "bun:test";

mock.module("server-only", () => ({}));
const { getProfileContestHistory } = await import("@/lib/profile-contest-history.server");

const originalFetch = globalThis.fetch;
const originalSupabaseUrl = process.env.SUPABASE_URL;
const originalServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const originalGatewayOrigin = process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalSupabaseUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = originalSupabaseUrl;
  if (originalServiceRoleKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  else process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceRoleKey;
  if (originalGatewayOrigin === undefined) delete process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
  else process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = originalGatewayOrigin;
  mock.restore();
});

test("returns only the profile's published contest row and preserves local result provenance", async () => {
  process.env.SUPABASE_URL = "https://supabase.example";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-service-key";
  process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = "https://gateway.example";
  const profileId = "11111111-1111-8111-8111-111111111111";
  const contestId = "22222222-2222-8222-8222-222222222222";
  const profileHandle = "user_0123456789abcdef01234567";

  globalThis.fetch = async (input) => {
    const url = new URL(String(input));
    if (url.origin === "https://supabase.example" && url.pathname.endsWith("/registrations")) {
      return Response.json([{ contest_id: contestId, registration_kind: "individual", team_id: null, status: "registered" }]);
    }
    if (url.origin === "https://supabase.example" && url.pathname.endsWith("/contests")) {
      return Response.json([{
        id: contestId,
        slug: "spring-open",
        name: "Spring Open",
        ends_at: "2026-01-01T00:00:00Z",
        state: "published",
        current_policy_version: 1,
        configuration: { signed_policy_settings: { execution_mode: "participant_local" } },
      }]);
    }
    if (url.origin === "https://supabase.example" && url.pathname.endsWith("/contest_policy_versions")) {
      return Response.json([{ contest_id: contestId, revision: 1, content: { execution_mode: "participant_local" } }]);
    }
    if (url.origin === "https://gateway.example" && url.pathname.endsWith(`/v1/contests/${contestId}/standings`)) {
      return Response.json({
        contest_id: contestId,
        contest_name: "Spring Open",
        state: "published",
        view: "public",
        published_revision: 1,
        snapshot_sha256: "a".repeat(64),
        signature: { algorithm: "Ed25519", key_id: "test-key", value: `${"A".repeat(86)}==` },
        standings: {
          schema_version: 1,
          scoring: { preset: "icpc", version: "icpc-v1", wrong_attempt_penalty_minutes: 20, compilation_error_policy: "ignore" },
          rows: [
            { rank: 4, participant: profileHandle, solved: 2, points: 2, penalty_minutes: 40, hidden_activity: false, problems: {} },
            { rank: 1, participant: "somebody-else", solved: 3, points: 3, penalty_minutes: 10, hidden_activity: false, problems: {} },
          ],
        },
      });
    }
    return new Response("unexpected request", { status: 500 });
  };

  const result = await getProfileContestHistory(profileId, profileHandle);

  expect(result.status).toBe("available");
  expect(result.items).toEqual([{
    contestId,
    slug: "spring-open",
    name: "Spring Open",
    endsAt: "2026-01-01T00:00:00Z",
    rank: 4,
    solved: 2,
    points: 2,
    penaltyMinutes: 40,
    state: "published",
    executionMode: "participant_local",
  }]);
});
