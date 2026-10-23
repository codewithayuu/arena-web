import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Authoritative Aura stats are not available yet" },
    { status: 503 },
  );
}
