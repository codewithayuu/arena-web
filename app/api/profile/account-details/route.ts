import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ensureClerkProfileData } from "@/lib/clerk-profile.server";
import { parseSignupProfileDetails } from "@/lib/signup-profile";
import { updateSignupProfileDetails } from "@/lib/signup-profile-sync.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRIVATE_RESPONSE_HEADERS = { "cache-control": "private, no-store" };

function unavailable() {
  return NextResponse.json(
    { error: "Account details are temporarily unavailable" },
    { status: 503, headers: PRIVATE_RESPONSE_HEADERS },
  );
}

async function getOwnerProfile() {
  const { userId } = await auth();
  if (!userId) return { response: NextResponse.json({ error: "Sign in to access account details" }, { status: 401, headers: PRIVATE_RESPONSE_HEADERS }) };

  const identity = await currentUser();
  if (!identity || identity.id !== userId) {
    return { response: NextResponse.json({ error: "Your Clerk session could not be confirmed" }, { status: 401, headers: PRIVATE_RESPONSE_HEADERS }) };
  }
  const { profile, details } = await ensureClerkProfileData(identity);
  return { identity, profile, details };
}

export async function GET() {
  try {
    const owner = await getOwnerProfile();
    if ("response" in owner) return owner.response;
    return NextResponse.json({
      details: {
        enrollmentNumber: owner.details.enrollment_number ?? "",
        institutionName: owner.details.institution_name ?? "",
        academicProgram: owner.details.academic_program ?? "",
        yearOfStudy: owner.details.year_of_study ?? null,
        gender: owner.details.gender ?? null,
        mobileNumber: owner.details.mobile_number ?? "",
      },
    }, { headers: PRIVATE_RESPONSE_HEADERS });
  } catch {
    return unavailable();
  }
}

export async function PATCH(request: NextRequest) {
  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 4_000) {
      return NextResponse.json({ error: "Account details are too large" }, { status: 413, headers: PRIVATE_RESPONSE_HEADERS });
    }
    input = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid account details" }, { status: 400, headers: PRIVATE_RESPONSE_HEADERS });
  }

  const signupDetails = parseSignupProfileDetails(input);
  if (!signupDetails) {
    return NextResponse.json({ error: "Check the required account details and try again" }, { status: 400, headers: PRIVATE_RESPONSE_HEADERS });
  }

  try {
    const owner = await getOwnerProfile();
    if ("response" in owner) return owner.response;
    await updateSignupProfileDetails(owner.profile.id, signupDetails);
    return NextResponse.json({ success: true }, { headers: PRIVATE_RESPONSE_HEADERS });
  } catch {
    return unavailable();
  }
}
