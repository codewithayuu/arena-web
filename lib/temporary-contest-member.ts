export type TemporaryContestControls = {
  state: string;
  ends_at: string | null;
};

export type TemporaryClerkUser = {
  id: string;
  externalId: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
  privateMetadata: Record<string, unknown>;
};

export type TemporaryMemberProfile = {
  id: string;
  clerk_user_id: string;
  display_name: string;
  membership_kind: string;
  temporary_contest_id: string | null;
  membership_expires_at: string;
};

export type TemporaryMemberProvisionInput = {
  contest_id: string;
  idempotency_key: string;
  user_id: string;
  email: string;
  display_name: string;
  expires_at: string;
  key_digests: [string, string];
  reason: string;
};

export type TemporaryMemberProvisionReceipt = {
  user_id: string;
  clerk_user_id: string;
  expires_at: string;
  key_count: 2;
  replayed: boolean;
};

export type TemporaryMemberDependencies = {
  now?: () => number;
  authorizeAdmin(contestId: string, token: string): Promise<TemporaryContestControls>;
  findClerkUser(externalId: string): Promise<TemporaryClerkUser | null>;
  createClerkUser(input: {
    externalId: string;
    profileId: string;
    contestId: string;
    email: string;
    displayName: string;
  }): Promise<TemporaryClerkUser>;
  findProfile(clerkUserId: string): Promise<TemporaryMemberProfile | null>;
  createProfile(profile: TemporaryMemberProfile & { handle: string }): Promise<void>;
  issueKeys(
    contestId: string,
    command: {
      action: "issue_temporary_keys";
      user_id: string;
      clerk_user_id: string;
      key_digests: [string, string];
      expires_at: string;
      reason: string;
    },
    token: string,
    idempotencyKey: string,
  ): Promise<{ user_id: string; expires_at: string; key_count: number }>;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const DIGEST = /^[a-f0-9]{64}$/;

function validateInput(input: TemporaryMemberProvisionInput): void {
  if (!UUID.test(input.contest_id) || !UUID.test(input.idempotency_key) || !UUID.test(input.user_id)) {
    throw new Error("Invalid temporary member request identifier");
  }
  if (input.email.length > 254 || !/^\S+@\S+\.\S+$/.test(input.email) || input.email !== input.email.trim()) {
    throw new Error("Enter a valid email address");
  }
  if (!input.display_name.trim() || input.display_name.length > 80 || input.display_name !== input.display_name.trim()) {
    throw new Error("Enter a display name from 1 to 80 characters");
  }
  if (!input.expires_at.endsWith("Z") || !Number.isFinite(Date.parse(input.expires_at))) {
    throw new Error("Temporary membership expiry must be an RFC3339 UTC timestamp ending in Z");
  }
  if (!Array.isArray(input.key_digests) || input.key_digests.length !== 2 || input.key_digests.some((value) => !DIGEST.test(value))) {
    throw new Error("Two SHA-256 login-code digests are required");
  }
  if (input.reason.trim().length < 8 || input.reason.trim().length > 1000) {
    throw new Error("Enter an administrative reason from 8 to 1,000 characters");
  }
}

function externalUserId(contestId: string, idempotencyKey: string): string {
  return `mindflare-temp-v1-${contestId.replaceAll("-", "")}-${idempotencyKey.replaceAll("-", "")}`;
}

function verifyClerkUser(
  user: TemporaryClerkUser,
  input: TemporaryMemberProvisionInput,
  externalId: string,
): void {
  const metadata = user.privateMetadata;
  if (
    user.externalId !== externalId
    || metadata.mindflare_temporary_member !== "v1"
    || metadata.mindflare_temporary_contest_id !== input.contest_id
    || metadata.mindflare_temporary_profile_id !== input.user_id
    || !user.emailAddresses.some((item) => item.emailAddress.toLowerCase() === input.email.toLowerCase())
  ) {
    throw new Error("Temporary member recovery data conflicts with the existing Clerk identity");
  }
}

function verifyProfile(
  profile: TemporaryMemberProfile,
  user: TemporaryClerkUser,
  input: TemporaryMemberProvisionInput,
): void {
  if (
    profile.id !== input.user_id
    || profile.clerk_user_id !== user.id
    || profile.display_name !== input.display_name
    || profile.membership_kind !== "temporary"
    || profile.temporary_contest_id !== input.contest_id
    || Date.parse(profile.membership_expires_at) !== Date.parse(input.expires_at)
  ) {
    throw new Error("Temporary member profile conflicts with the saved retry request");
  }
}

/**
 * Idempotently provisions a Clerk identity/profile, then asks the gateway to
 * register that member and issue the two digest-only contest login codes.
 * Codes themselves remain in the encrypted native admin operation journal.
 */
export async function provisionTemporaryContestMember(
  input: TemporaryMemberProvisionInput,
  token: string,
  dependencies: TemporaryMemberDependencies,
): Promise<TemporaryMemberProvisionReceipt> {
  validateInput(input);
  if (typeof token !== "string" || token.length < 32 || /\s/.test(token)) {
    throw new Error("A fresh administrator session is required");
  }
  const now = (dependencies.now ?? Date.now)();
  const controls = await dependencies.authorizeAdmin(input.contest_id, token);
  const contestEnd = controls.ends_at ? Date.parse(controls.ends_at) : Number.NaN;
  const expiry = Date.parse(input.expires_at);
  if (
    !["scheduled", "preflight", "admitting", "active"].includes(controls.state)
    || !Number.isFinite(contestEnd) || contestEnd <= now
    || expiry <= now || expiry > contestEnd || expiry > now + 7 * 24 * 60 * 60 * 1000
  ) {
    throw new Error("The contest must be scheduled and the temporary membership must expire within its end time and seven days");
  }

  const stableExternalId = externalUserId(input.contest_id, input.idempotency_key);
  let clerkUser = await dependencies.findClerkUser(stableExternalId);
  const replayed = clerkUser !== null;
  if (!clerkUser) {
    try {
      clerkUser = await dependencies.createClerkUser({
        externalId: stableExternalId,
        profileId: input.user_id,
        contestId: input.contest_id,
        email: input.email,
        displayName: input.display_name,
      });
    } catch (error) {
      // A second request with the same idempotency key may have won the Clerk
      // create race. Recover only that exact external ID; otherwise surface a
      // retryable error without creating a second identity.
      clerkUser = await dependencies.findClerkUser(stableExternalId);
      if (!clerkUser) throw error;
    }
  }
  verifyClerkUser(clerkUser, input, stableExternalId);

  const expectedProfile: TemporaryMemberProfile = {
    id: input.user_id,
    clerk_user_id: clerkUser.id,
    display_name: input.display_name,
    membership_kind: "temporary",
    temporary_contest_id: input.contest_id,
    membership_expires_at: input.expires_at,
  };
  let profile = await dependencies.findProfile(clerkUser.id);
  if (profile) {
    verifyProfile(profile, clerkUser, input);
  } else {
    await dependencies.createProfile({
      ...expectedProfile,
      handle: `guest_${input.user_id.replaceAll("-", "")}`,
    });
    profile = await dependencies.findProfile(clerkUser.id);
    if (!profile) throw new Error("Temporary identity was created, but its profile is not yet available; retry the same action");
    verifyProfile(profile, clerkUser, input);
  }

  const issued = await dependencies.issueKeys(input.contest_id, {
    action: "issue_temporary_keys",
    user_id: input.user_id,
    clerk_user_id: clerkUser.id,
    key_digests: input.key_digests,
    expires_at: input.expires_at,
    reason: input.reason,
  }, token, input.idempotency_key);
  if (issued.user_id !== input.user_id || issued.key_count !== 2 || Date.parse(issued.expires_at) !== expiry) {
    throw new Error("The gateway returned an inconsistent temporary-member receipt");
  }

  return {
    user_id: input.user_id,
    clerk_user_id: clerkUser.id,
    expires_at: input.expires_at,
    key_count: 2,
    replayed,
  };
}
