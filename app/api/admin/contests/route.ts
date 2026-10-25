import { adminGatewayRequest } from "@/lib/contest-admin.server";

export const dynamic = "force-dynamic";

export async function GET() {
  return adminGatewayRequest("/v1/admin/contests?limit=50&offset=0");
}
