import "server-only";

import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";
import type { SignupProfileDetails, SignupProfileMetadata } from "@/lib/signup-profile";

function toDatabaseDetails(profileId: string, signupProfile: SignupProfileDetails, timestamp: string) {
  return {
    profile_id: profileId,
    enrollment_number: signupProfile.enrollmentNumber,
    institution_name: signupProfile.institutionName || null,
    academic_program: signupProfile.academicProgram,
    year_of_study: signupProfile.yearOfStudy,
    gender: signupProfile.gender,
    mobile_number: signupProfile.mobileNumber,
    college: signupProfile.institutionName || "",
    branch: signupProfile.academicProgram || "",
    updated_at: timestamp,
  };
}

export async function syncSignupProfileDetails(
  profileId: string,
  signupProfile: SignupProfileMetadata,
): Promise<void> {
  const detailUrl = supabaseRestUrl("profile_details");
  detailUrl.search = "?on_conflict=profile_id";
  const timestamp = new Date().toISOString();
  const profileDetails = {
    ...toDatabaseDetails(profileId, signupProfile, timestamp),
    first_name: signupProfile.firstName,
    second_name: signupProfile.lastName,
    signup_username: signupProfile.username,
    signup_profile_synced_at: timestamp,
  };

  const insertResponse = await supabaseRequest(detailUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify(profileDetails),
  });
  if (!insertResponse.ok) throw new Error("Signup profile synchronization failed");

  const updateUrl = new URL(detailUrl);
  updateUrl.search = new URLSearchParams({
    profile_id: `eq.${profileId}`,
    signup_profile_synced_at: "is.null",
  }).toString();
  const updateResponse = await supabaseRequest(updateUrl, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify(profileDetails),
  });
  if (!updateResponse.ok) throw new Error("Signup profile synchronization failed");
}

export async function updateSignupProfileDetails(
  profileId: string,
  signupProfile: SignupProfileDetails,
): Promise<void> {
  const detailsUrl = supabaseRestUrl("profile_details");
  detailsUrl.search = new URLSearchParams({ profile_id: `eq.${profileId}` }).toString();
  const response = await supabaseRequest(detailsUrl, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify(toDatabaseDetails(profileId, signupProfile, new Date().toISOString())),
  });
  if (!response.ok) throw new Error("Signup profile update failed");
}
