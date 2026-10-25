import { Suspense } from "react";
import { DeviceLinkClient } from "./device-link-client";
import { PageLoading } from "@/components/ui/page-loading";

export default async function AdminDeviceLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; callback?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<PageLoading variant="device-link" label="secure desktop sign-in" />}>
      <DeviceLinkClient state={params.state ?? ""} callback={params.callback ?? ""} />
    </Suspense>
  );
}
