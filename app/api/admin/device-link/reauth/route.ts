import { auth, reverificationErrorResponse } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Sign in to Mindflare first." }, { status: 401 });
  }

  const fva = (session.sessionClaims as Record<string, unknown> | null)?.fva;
  const secondFactorAge = Array.isArray(fva) && Number.isInteger(fva[1]) ? fva[1] as number : -1;
  if (secondFactorAge < 0 || secondFactorAge > 5) {
    const response = reverificationErrorResponse("strict_mfa");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
