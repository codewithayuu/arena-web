import { clerkClient } from "@clerk/nextjs/server";
import { createHash } from "node:crypto";
import { NextRequest,NextResponse } from "next/server";
import { readBoundedRequestJson,requireSameOrigin } from "@/lib/contest-admin.server";
import { enforceApiRateLimit,rateLimitClientIdentity } from "@/lib/api-rate-limit.server";
import { supabaseRequest,supabaseRpcUrl } from "@/lib/supabase-rest.server";

export async function POST(request:NextRequest) {
 const denied=requireSameOrigin(request);if(denied)return denied;
 const limited=await enforceApiRateLimit(request,{scope:"temporary-contest-login",identity:rateLimitClientIdentity(request),limit:5,windowSeconds:60});
 if(limited)return limited;
 try {
  const input=await readBoundedRequestJson(request,2048);
  if(typeof input.key!=="string" || !/^mf_[A-Za-z0-9_-]{43}$/.test(input.key.trim()))return NextResponse.json({code:"INVALID_ACCESS_KEY"},{status:400});
  const keyDigest=createHash("sha256").update(input.key.trim()).digest("hex");
  const response=await supabaseRequest(supabaseRpcUrl("resolve_contest_temporary_key"),{method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({p_key_sha256:keyDigest})});
  if(!response.ok)return NextResponse.json({code:response.status>=500?"TEMPORARY_SIGN_IN_UNAVAILABLE":"INVALID_EXPIRED_OR_USED_KEY"},{status:response.status>=500?503:403,headers:{"Cache-Control":"no-store"}});
  const value=await response.json();
  const client=await clerkClient();
  const signIn=await client.signInTokens.createSignInToken({userId:value.clerk_user_id,expiresInSeconds:60});
  const consumed=await supabaseRequest(supabaseRpcUrl("consume_contest_temporary_key"),{method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({p_key_sha256:keyDigest})});
  if(!consumed.ok)return NextResponse.json({code:consumed.status>=500?"TEMPORARY_SIGN_IN_UNAVAILABLE":"INVALID_EXPIRED_OR_USED_KEY"},{status:consumed.status>=500?503:403,headers:{"Cache-Control":"no-store"}});
  const url=new URL(signIn.url);
  if(url.protocol!=="https:")throw new Error();
  url.searchParams.set("redirect_url",new URL(`/contests/${value.contest_id}`,request.url).toString());
  return NextResponse.json({sign_in_url:url.toString()},{headers:{"Cache-Control":"no-store","Referrer-Policy":"no-referrer"}});
 } catch {return NextResponse.json({code:"TEMPORARY_SIGN_IN_UNAVAILABLE"},{status:503,headers:{"Cache-Control":"no-store"}});}
}
