import { redirect } from "next/navigation";
import { adminGatewayRequest } from "@/lib/contest-admin.server";
import { ContestControlDashboard } from "@/app/admin/contests/contest-control-dashboard";

export const dynamic = "force-dynamic";

export default async function ContestManagementPage() {
  const access = await adminGatewayRequest("/v1/admin/contests?limit=1&offset=0");
  if (access.status === 401) redirect("/sign-in?redirect_url=%2Foperations%2Fcontest-management");
  if (access.status >= 500) return <main className="mx-auto max-w-3xl px-6 py-16"><h1 className="text-2xl font-semibold">Contest management is unavailable</h1><p className="mt-3">The contest authority could not confirm administrator access. Try again when it is available.</p></main>;
  return <ContestControlDashboard />;
}
