import assert from "node:assert/strict";
import test from "node:test";
import {
  provisionTemporaryContestMember,
  type TemporaryClerkUser,
  type TemporaryMemberDependencies,
  type TemporaryMemberProfile,
  type TemporaryMemberProvisionInput,
} from "./temporary-contest-member";

const contestId = "11111111-1111-4111-8111-111111111111";
const operationId = "22222222-2222-4222-8222-222222222222";
const profileId = "33333333-3333-4333-8333-333333333333";
const clerkId = "user_abcde12345";
const now = Date.parse("2026-10-25T12:00:00.000Z");
const expiresAt = "2026-10-25T13:00:00.000Z";
const email = "guest@example.test";
const displayName = "Temporary Guest";
const token = "test-clerk-session-token-123456789012345";

function input(overrides: Partial<TemporaryMemberProvisionInput> = {}): TemporaryMemberProvisionInput {
  return {
    contest_id: contestId,
    idempotency_key: operationId,
    user_id: profileId,
    email,
    display_name: displayName,
    expires_at: expiresAt,
    key_digests: ["a".repeat(64), "b".repeat(64)],
    reason: "Create temporary contest member",
    ...overrides,
  };
}

function makeDependencies() {
  let user: TemporaryClerkUser | null = null;
  let profile: TemporaryMemberProfile | null = null;
  const calls: string[] = [];
  let issueFailure: Error | null = null;
  const dependencies: TemporaryMemberDependencies = {
    now: () => now,
    authorizeAdmin: async () => {
      calls.push("authorize");
      return { state: "scheduled", ends_at: "2026-10-25T14:00:00.000Z" };
    },
    findClerkUser: async (externalId) => {
      calls.push("find-clerk-user");
      return user?.externalId === externalId ? user : null;
    },
    createClerkUser: async (value) => {
      calls.push("create-clerk-user");
      user = {
        id: clerkId,
        externalId: value.externalId,
        emailAddresses: [{ emailAddress: value.email }],
        privateMetadata: {
          mindflare_temporary_member: "v1",
          mindflare_temporary_contest_id: value.contestId,
          mindflare_temporary_profile_id: value.profileId,
        },
      };
      return user;
    },
    findProfile: async () => {
      calls.push("find-profile");
      return profile;
    },
    createProfile: async (value) => {
      calls.push("create-profile");
      profile = {
        id: value.id,
        clerk_user_id: value.clerk_user_id,
        display_name: value.display_name,
        membership_kind: value.membership_kind,
        temporary_contest_id: value.temporary_contest_id,
        membership_expires_at: value.membership_expires_at,
      };
    },
    issueKeys: async (_contestId, command, bearer, key) => {
      calls.push("issue-keys");
      assert.equal(bearer, token);
      assert.equal(key, operationId);
      assert.deepEqual(command.key_digests, ["a".repeat(64), "b".repeat(64)]);
      if (issueFailure) throw issueFailure;
      return { user_id: profileId, expires_at: expiresAt, key_count: 2 };
    },
  };
  return {
    dependencies,
    calls,
    setIssueFailure(value: Error | null) { issueFailure = value; },
  };
}

test("provisions Clerk identity and profile, then issues digest-only codes through the gateway", async () => {
  const fake = makeDependencies();
  const receipt = await provisionTemporaryContestMember(input(), token, fake.dependencies);
  assert.deepEqual(receipt, {
    user_id: profileId,
    clerk_user_id: clerkId,
    expires_at: expiresAt,
    key_count: 2,
    replayed: false,
  });
  assert.deepEqual(fake.calls, ["authorize", "find-clerk-user", "create-clerk-user", "find-profile", "create-profile", "find-profile", "issue-keys"]);
});

test("same idempotency key recovers the existing Clerk user and profile", async () => {
  const fake = makeDependencies();
  await provisionTemporaryContestMember(input(), token, fake.dependencies);
  fake.calls.length = 0;
  const receipt = await provisionTemporaryContestMember(input(), token, fake.dependencies);
  assert.equal(receipt.replayed, true);
  assert.deepEqual(fake.calls, ["authorize", "find-clerk-user", "find-profile", "issue-keys"]);
});

test("authorization, schedule, and expiry checks run before creating an identity", async () => {
  const fake = makeDependencies();
  fake.dependencies.authorizeAdmin = async () => {
    fake.calls.push("authorize");
    return { state: "draft", ends_at: null };
  };
  await assert.rejects(provisionTemporaryContestMember(input(), token, fake.dependencies), /scheduled/);
  assert.deepEqual(fake.calls, ["authorize"]);

  const tooLate = makeDependencies();
  await assert.rejects(
    provisionTemporaryContestMember(input({ expires_at: "2026-10-25T14:01:00.000Z" }), token, tooLate.dependencies),
    /expire within/,
  );
  assert.deepEqual(tooLate.calls, ["authorize"]);
});

test("retry after gateway failure does not create a duplicate Clerk user or profile", async () => {
  const fake = makeDependencies();
  fake.setIssueFailure(new Error("gateway unavailable"));
  await assert.rejects(provisionTemporaryContestMember(input(), token, fake.dependencies), /gateway unavailable/);
  fake.setIssueFailure(null);
  fake.calls.length = 0;
  const receipt = await provisionTemporaryContestMember(input(), token, fake.dependencies);
  assert.equal(receipt.clerk_user_id, clerkId);
  assert.equal(receipt.replayed, true);
  assert.equal(fake.calls.includes("create-clerk-user"), false);
  assert.equal(fake.calls.includes("create-profile"), false);
});

test("an existing external ID with different member metadata is rejected", async () => {
  const fake = makeDependencies();
  const valid = await provisionTemporaryContestMember(input(), token, fake.dependencies);
  assert.equal(valid.clerk_user_id, clerkId);
  fake.dependencies.findClerkUser = async () => ({
    id: clerkId,
    externalId: "mindflare-temp-v1-other",
    emailAddresses: [{ emailAddress: email }],
    privateMetadata: {},
  });
  await assert.rejects(provisionTemporaryContestMember(input(), token, fake.dependencies), /conflicts/);
});
