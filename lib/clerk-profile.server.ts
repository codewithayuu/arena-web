import "server-only";

import { createHash } from "node:crypto";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

const CLERK_USER_ID = /^user_[A-Za-z0-9_-]{1,250}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface ClerkProfileIdentity {
  id: string;
  externalId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  imageUrl?: string | null;
}

export interface ProfileRecord {
  id: string;
  handle: string;
  display_name: string;
  clerk_user_id?: string | null;
}

export interface ProfileDetailsRecord {
  first_name: string;
  second_name: string;
  bio: string;
  country: string;
  college: string;
  degree: string;
  branch: string;
  image_url: string;
  year_of_graduation: number;
  job_preference: number;
  signup_username?: string | null;
  enrollment_number?: string | null;
  institution_name?: string | null;
  academic_program?: string | null;
  year_of_study?: number | null;
  gender?: "male" | "female" | null;
  mobile_number?: string | null;
}

const PROFILE_DETAIL_FIELDS = "first_name,second_name,bio,country,college,degree,branch,image_url,year_of_graduation,job_preference,signup_username,enrollment_number,institution_name,academic_program,year_of_study,gender,mobile_number";

function makeProfileId(identity: ClerkProfileIdentity): string {
  const legacyId = identity.externalId?.trim();
  if (legacyId && UUID_PATTERN.test(legacyId)) return legacyId.toLowerCase();
  const bytes = createHash("sha256")
    .update("mindflare.clerk-profile.v1\0", "utf8")
    .update(identity.id, "utf8")
    .digest()
    .subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x80;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function makeProfileHandle(clerkUserId: string): string {
  return `user_${createHash("sha256").update(clerkUserId).digest("hex").slice(0, 24)}`;
}

function cleanName(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim().slice(0, 80) : "";
}

function profileDisplayName(identity: ClerkProfileIdentity): string {
  const fullName = [cleanName(identity.firstName), cleanName(identity.lastName)].filter(Boolean).join(" ").slice(0, 120);
  if (fullName) return fullName;
  const username = typeof identity.username === "string" ? identity.username.trim() : "";
  return (username || "Arena learner").slice(0, 120);
}

async function readProfile(clerkUserId: string): Promise<ProfileRecord | null> {
  const url = supabaseRestUrl("profiles");
  url.search = new URLSearchParams({
    select: "id,handle,display_name,clerk_user_id",
    clerk_user_id: `eq.${clerkUserId}`,
    limit: "2",
  }).toString();
  const response = await supabaseRequest(url, { method: "GET" });
  if (!response.ok) throw new Error("Profile lookup failed");
  const rows = (await response.json()) as ProfileRecord[];
  if (rows.length > 1) throw new Error("Clerk identity has multiple profile rows");
  return rows[0] ?? null;
}

async function readProfileById(profileId: string): Promise<ProfileRecord | null> {
  const url = supabaseRestUrl("profiles");
  url.search = new URLSearchParams({
    select: "id,handle,display_name,clerk_user_id",
    id: `eq.${profileId}`,
    limit: "2",
  }).toString();
  const response = await supabaseRequest(url, { method: "GET" });
  if (!response.ok) throw new Error("Legacy profile lookup failed");
  const rows = (await response.json()) as ProfileRecord[];
  if (rows.length > 1) throw new Error("Profile UUID has multiple rows");
  return rows[0] ?? null;
}

async function attachLegacyProfile(profile: ProfileRecord, clerkUserId: string): Promise<void> {
  if (profile.clerk_user_id === clerkUserId) return;
  if (profile.clerk_user_id) throw new Error("Legacy profile is already linked to another Clerk identity");

  const url = supabaseRestUrl("profiles");
  url.search = new URLSearchParams({ id: `eq.${profile.id}`, clerk_user_id: "is.null" }).toString();
  const response = await supabaseRequest(url, {
    method: "PATCH",
    headers: { "content-type": "application/json", prefer: "return=minimal" },
    body: JSON.stringify({ clerk_user_id: clerkUserId }),
  });
  if (!response.ok) throw new Error("Legacy profile link failed");
  const linked = await readProfile(clerkUserId);
  if (!linked || linked.id !== profile.id) throw new Error("Legacy profile link was not confirmed");
}

async function readProfileDetails(profileId: string): Promise<ProfileDetailsRecord | null> {
  const url = supabaseRestUrl("profile_details");
  url.search = new URLSearchParams({
    select: PROFILE_DETAIL_FIELDS,
    profile_id: `eq.${profileId}`,
    limit: "2",
  }).toString();
  const response = await supabaseRequest(url, { method: "GET" });
  if (!response.ok) throw new Error("Profile details lookup failed");
  const rows = (await response.json()) as ProfileDetailsRecord[];
  if (rows.length > 1) throw new Error("Profile has multiple details rows");
  return rows[0] ?? null;
}

function initialProfileDetails(identity: ClerkProfileIdentity): ProfileDetailsRecord {
  let imageUrl = "";
  if (typeof identity.imageUrl === "string") {
    try {
      const parsed = new URL(identity.imageUrl);
      if (parsed.protocol === "https:") imageUrl = parsed.toString().slice(0, 2048);
    } catch {
      // Invalid or non-HTTPS Clerk image URLs are not persisted.
    }
  }
  return {
    first_name: cleanName(identity.firstName),
    second_name: cleanName(identity.lastName),
    bio: "",
    country: "",
    college: "",
    degree: "",
    branch: "",
    image_url: imageUrl,
    year_of_graduation: 0,
    job_preference: 0,
  };
}

/**
 * Resolve the authenticated Clerk user to its Supabase profile and create only
 * missing profile records. Existing profile details are never overwritten by
 * identity-provider data.
 */
export async function ensureClerkProfileData(identity: ClerkProfileIdentity): Promise<{
  profile: ProfileRecord;
  details: ProfileDetailsRecord;
}> {
  if (!CLERK_USER_ID.test(identity.id)) throw new Error("Invalid Clerk user identity");

  let profile = await readProfile(identity.id);
  if (!profile) {
    const legacyId = identity.externalId?.trim();
    const legacyProfile = legacyId && UUID_PATTERN.test(legacyId)
      ? await readProfileById(legacyId.toLowerCase())
      : null;
    if (legacyProfile) {
      await attachLegacyProfile(legacyProfile, identity.id);
      profile = await readProfile(identity.id);
    } else {
      const profilesUrl = supabaseRestUrl("profiles");
      profilesUrl.search = "on_conflict=clerk_user_id";
      const createResponse = await supabaseRequest(profilesUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          prefer: "resolution=ignore-duplicates,return=minimal",
        },
        body: JSON.stringify({
          id: makeProfileId(identity),
          clerk_user_id: identity.id,
          handle: makeProfileHandle(identity.id),
          display_name: profileDisplayName(identity),
        }),
      });
      if (!createResponse.ok) throw new Error("Profile provisioning failed");
      profile = await readProfile(identity.id);
    }
    if (!profile) throw new Error("Profile provisioning did not create a linked profile");
  }

  let details = await readProfileDetails(profile.id);
  if (!details) {
    const detailsUrl = supabaseRestUrl("profile_details");
    detailsUrl.search = "on_conflict=profile_id";
    const createDetailsResponse = await supabaseRequest(detailsUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({ profile_id: profile.id, ...initialProfileDetails(identity) }),
    });
    if (!createDetailsResponse.ok) throw new Error("Profile details provisioning failed");
    details = await readProfileDetails(profile.id);
    if (!details) throw new Error("Profile details provisioning did not create a details row");
  }

  return { profile, details };
}
