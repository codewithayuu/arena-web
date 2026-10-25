import { clerkClient } from "@clerk/nextjs/server";
import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  adminGatewayRequestWithToken,
  readBoundedJson,
  readBoundedRequestJson,
} from "@/lib/contest-admin.server";
import { enforceApiRateLimit, rateLimitClientIdentity } from "@/lib/api-rate-limit.server";
import {
  provisionTemporaryContestMember,
  type TemporaryClerkUser,
  type TemporaryContestControls,
  type TemporaryMemberProfile,
  type TemporaryMemberProvisionInput,
} from "@/lib/temporary-contest-member";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

class RequestFailure extends Error {
  constructor(readonly status: number) { super("The temporary-member request failed"); }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = /^Bearer ([^\s]{32,16384})$/.exec(value);
  return match?.[1] ?? null;
}

function parseProvisionInput(
  body: Record<string, unknown>,
  contestId: string,
  idempotencyKey: string,
): TemporaryMemberProvisionInput | null {
  const allowed = ["user_id", "email", "display_name", "expires_at", "key_digests", "reason"];
  if (Object.keys(body).sort().join("\0") !== [...allowed].sort().join("\0")) return null;
  if (
    typeof body.user_id !== "string" || !UUID.test(body.user_id)
    || typeof body.email !== "string" || typeof body.display_name !== "string"
    || typeof body.expires_at !== "string" || typeof body.reason !== "string"
    || !Array.isArray(body.key_digests) || body.key_digests.length !== 2
    || body.key_digests.some((value) => typeof value !== "string" || !/^[a-f0-9]{64}$/.test(value))
  ) return null;
  return {
    contest_id: contestId,
    idempotency_key: idempotencyKey,
    user_id: body.user_id,
    email: body.email,
    display_name: body.display_name,
    expires_at: body.expires_at,
    key_digests: body.key_digests as [string, string],
    reason: body.reason,
  };
}

async function readGatewayObject(response: Response): Promise<Record<string, unknown>> {
  if (!response.ok) throw new RequestFailure(response.status);
  return readBoundedJson(response, 1024 * 1024);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string }> },
) {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return NextResponse.json({ code: "ORIGIN_DENIED" }, { status: 403 });
  if (request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() !== "application/json") {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400 });
  }
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 });
  const { contestId } = await params;
  if (!UUID.test(contestId)) return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400 });
  const idempotencyKey = request.headers.get("idempotency-key") ?? "";
  if (!UUID.test(idempotencyKey) || idempotencyKey === "00000000-0000-0000-0000-000000000000") {
    return NextResponse.json({ code: "IDEMPOTENCY_KEY_REQUIRED" }, { status: 400 });
  }

  const limited = await enforceApiRateLimit(request, {
    scope: "temporary-member-provisioning",
    identity: rateLimitClientIdentity(request),
    limit: 5,
    windowSeconds: 60,
  });
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await readBoundedRequestJson(request, 4096);
  } catch {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const input = parseProvisionInput(body, contestId, idempotencyKey);
  if (!input) return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400, headers: { "Cache-Control": "no-store" } });

  try {
    const client = await clerkClient();
    const dependencies = {
      authorizeAdmin: async (targetContestId: string, bearer: string): Promise<TemporaryContestControls> => {
        const response = await adminGatewayRequestWithToken(
          `/v1/admin/contests/${targetContestId}/runtime-controls`, bearer,
          { method: "GET", headers: { "Cache-Control": "no-store" } },
        );
        const value = await readGatewayObject(response);
        if (typeof value.state !== "string" || (value.ends_at !== null && typeof value.ends_at !== "string")) {
          throw new RequestFailure(503);
        }
        return { state: value.state, ends_at: value.ends_at as string | null };
      },
      findClerkUser: async (externalId: string): Promise<TemporaryClerkUser | null> => {
        const response = await client.users.getUserList({ externalId: [externalId], limit: 1 });
        return response.data[0] as TemporaryClerkUser | undefined ?? null;
      },
      createClerkUser: async (value: {
        externalId: string; profileId: string; contestId: string; email: string; displayName: string;
      }): Promise<TemporaryClerkUser> => (await client.users.createUser({
        externalId: value.externalId,
        emailAddress: [value.email],
        emailAddressIdentificationStatus: ["reserved"],
        firstName: value.displayName,
        password: randomBytes(48).toString("base64url"),
        privateMetadata: {
          mindflare_temporary_member: "v1",
          mindflare_temporary_contest_id: value.contestId,
          mindflare_temporary_profile_id: value.profileId,
        },
      })) as unknown as TemporaryClerkUser,
      findProfile: async (clerkUserId: string): Promise<TemporaryMemberProfile | null> => {
        const profileUrl = supabaseRestUrl("profiles");
        profileUrl.search = new URLSearchParams({
          select: "id,clerk_user_id,display_name,membership_kind,temporary_contest_id,membership_expires_at",
          clerk_user_id: `eq.${clerkUserId}`,
          limit: "1",
        }).toString();
        const response = await supabaseRequest(profileUrl, { method: "GET" });
        if (!response.ok) throw new RequestFailure(503);
        const rows = await response.json() as TemporaryMemberProfile[];
        return rows[0] ?? null;
      },
      createProfile: async (profile: TemporaryMemberProfile & { handle: string }): Promise<void> => {
        const profileUrl = supabaseRestUrl("profiles");
        profileUrl.search = new URLSearchParams({ on_conflict: "clerk_user_id" }).toString();
        const response = await supabaseRequest(profileUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates" },
          body: JSON.stringify(profile),
        });
        if (!response.ok) throw new RequestFailure(503);
      },
      issueKeys: async (
        targetContestId: string,
        command: {
          action: "issue_temporary_keys"; user_id: string; clerk_user_id: string;
          key_digests: [string, string]; expires_at: string; reason: string;
        },
        bearer: string,
        key: string,
      ): Promise<{ user_id: string; expires_at: string; key_count: number }> => {
        const response = await adminGatewayRequestWithToken(
          `/v1/admin/contests/${targetContestId}/runtime-controls`, bearer,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "Idempotency-Key": key, "Cache-Control": "no-store" },
            body: JSON.stringify(command),
          },
        );
        const value = await readGatewayObject(response);
        if (typeof value.user_id !== "string" || typeof value.expires_at !== "string" || typeof value.key_count !== "number") {
          throw new RequestFailure(503);
        }
        return { user_id: value.user_id, expires_at: value.expires_at, key_count: value.key_count };
      },
    };
    const receipt = await provisionTemporaryContestMember(input, token, dependencies);
    return NextResponse.json(receipt, { status: 201, headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
  } catch (error) {
    const status = error instanceof RequestFailure ? error.status
      : error instanceof Error && /valid|expire|scheduled|reason|display name|email address|digest|identifier|conflict/.test(error.message)
        ? 400 : 503;
    return NextResponse.json({ code: status === 400 ? "INVALID_TEMPORARY_MEMBER_REQUEST" : "TEMPORARY_ACCESS_PROVISIONING_FAILED" }, {
      status,
      headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
    });
  }
}
