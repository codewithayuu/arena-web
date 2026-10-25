import { adminGatewayRequest,requireSameOrigin } from "@/lib/contest-admin.server";
import { NextResponse } from "next/server";
export async function POST(request:Request,{params}:{params:Promise<{contestId:string}>}) {
 const denied=requireSameOrigin(request);if(denied)return denied;
 const {contestId}=await params;const body=await request.text();
 if(Buffer.byteLength(body)>8192)return NextResponse.json({code:"REQUEST_TOO_LARGE"},{status:413});
 return adminGatewayRequest(`/v1/admin/contests/${contestId}/local-publication`,{method:"POST",body,
  headers:{"Content-Type":"application/json","Idempotency-Key":request.headers.get("idempotency-key")||""}});
}
