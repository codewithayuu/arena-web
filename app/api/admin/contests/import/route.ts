import { NextRequest } from "next/server";
import { importLocalContest } from "@/lib/local-contest-import.server";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  return importLocalContest(request);
}
