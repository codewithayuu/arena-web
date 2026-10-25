import { adminGatewayRequest,requireSameOrigin } from "@/lib/contest-admin.server";
import { NextResponse } from "next/server";
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function GET(_request:Request,{params}:{params:Promise<{contestId:string}>}) {
 const {contestId}=await params;if(!UUID.test(contestId))return NextResponse.json({code:"INVALID_CONTEST"},{status:400});
 return adminGatewayRequest(`/v1/admin/contests/${contestId}/runtime-controls`);
}
export async function POST(request:Request,{params}:{params:Promise<{contestId:string}>}) {
 const denied=requireSameOrigin(request);if(denied)return denied;
 const {contestId}=await params;if(!UUID.test(contestId))return NextResponse.json({code:"INVALID_CONTEST"},{status:400});
 const body=await request.text();if(Buffer.byteLength(body)>16384)return NextResponse.json({code:"REQUEST_TOO_LARGE"},{status:413});
 return adminGatewayRequest(`/v1/admin/contests/${contestId}/runtime-controls`,{method:"POST",body,
  headers:{"Content-Type":"application/json","Idempotency-Key":request.headers.get("idempotency-key")||""}});
}
