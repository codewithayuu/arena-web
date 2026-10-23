import { Suspense } from "react";
import { DeviceLinkClient } from "./device-link-client";

export default async function AdminDeviceLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; callback?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#08090c] p-8 text-white">Loading secure desktop sign-in…</main>}>
      <DeviceLinkClient state={params.state ?? ""} callback={params.callback ?? ""} />
    </Suspense>
  );
}
