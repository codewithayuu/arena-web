import { clerkClient } from "@clerk/nextjs/server";
import { createHash,randomBytes,randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { adminGatewayRequest,readBoundedRequestJson,requireSameOrigin } from "@/lib/contest-admin.server";
import { supabaseRequest,supabaseRestUrl } from "@/lib/supabase-rest.server";

export async function POST(request:Request,{params}:{params:Promise<{contestId:string}>}) {
 const denied=requireSameOrigin(request);if(denied)return denied;
 const {contestId}=await params;
 const authorized=await adminGatewayRequest(`/v1/admin/contests/${contestId}/runtime-controls`);
 if(!authorized.ok)return authorized;
 const controls=await authorized.json();
 const end=Date.parse(controls.ends_at);
 if(!Number.isFinite(end)||end<=Date.now())return NextResponse.json({code:"SCHEDULE_REQUIRED"},{status:409});
 let newlyCreated:string|null=null;
 try {
  const input=await readBoundedRequestJson(request,4096);
  const client=await clerkClient();
  let profileId:string;let clerkId:string;
  let expiresAt:string;
  if(input.user_id!==undefined) {
   if(typeof input.user_id!=="string"||!/^[0-9a-f-]{36}$/i.test(input.user_id))throw new Error();
   const url=supabaseRestUrl("profiles");url.search=new URLSearchParams({select:"id,clerk_user_id,membership_kind,temporary_contest_id,membership_expires_at",id:`eq.${input.user_id}`,limit:"1"}).toString();
   const response=await supabaseRequest(url,{method:"GET"});if(!response.ok)throw new Error();
   const [profile]=await response.json();
   if(!profile||profile.membership_kind!=="temporary"||profile.temporary_contest_id!==contestId)throw new Error();
   profileId=profile.id;clerkId=profile.clerk_user_id;
   const memberExpiry=Date.parse(profile.membership_expires_at);
   if(!Number.isFinite(memberExpiry)||memberExpiry<=Date.now())throw new Error();
   expiresAt=new Date(Math.min(end,Date.now()+7*86400000,memberExpiry)).toISOString();
  } else {
   if(typeof input.email!=="string"||input.email.length>254||!/^\S+@\S+\.\S+$/.test(input.email)
    ||typeof input.display_name!=="string"||!input.display_name.trim()||input.display_name.length>80)throw new Error();
   profileId=randomUUID();
   expiresAt=new Date(Math.min(end,Date.now()+7*86400000)).toISOString();
   const user=await client.users.createUser({externalId:profileId,emailAddress:[input.email.trim()],emailAddressIdentificationStatus:["reserved"],
    firstName:input.display_name.trim(),password:randomBytes(48).toString("base64url"),privateMetadata:{temporary_contest_id:contestId}});
   newlyCreated=user.id;clerkId=user.id;
   const profileUrl=supabaseRestUrl("profiles");profileUrl.search="on_conflict=clerk_user_id";
   const response=await supabaseRequest(profileUrl,{method:"POST",headers:{"Content-Type":"application/json",Prefer:"resolution=merge-duplicates"},
    body:JSON.stringify({id:profileId,clerk_user_id:clerkId,handle:`guest_${profileId.replaceAll("-","")}`,display_name:input.display_name.trim(),
     membership_kind:"temporary",membership_expires_at:expiresAt,temporary_contest_id:contestId})});
   if(!response.ok)throw new Error();
  }
  const keys=[`mf_${randomBytes(32).toString("base64url")}`,`mf_${randomBytes(32).toString("base64url")}`];
  const issued=await adminGatewayRequest(`/v1/admin/contests/${contestId}/runtime-controls`,{method:"POST",
   headers:{"Content-Type":"application/json","Idempotency-Key":randomUUID()},body:JSON.stringify({action:"issue_temporary_keys",user_id:profileId,
    clerk_user_id:clerkId,key_digests:keys.map(key=>createHash("sha256").update(key).digest("hex")),expires_at:expiresAt,reason:"Issue individual temporary participant login keys"})});
  if(!issued.ok)throw new Error();
  return NextResponse.json({user_id:profileId,login_key:keys[0],exam_browser_key:keys[1],expires_at:expiresAt},
   {status:201,headers:{"Cache-Control":"no-store","Referrer-Policy":"no-referrer"}});
 } catch {
  if(newlyCreated)await (await clerkClient()).users.deleteUser(newlyCreated).catch(()=>undefined);
  return NextResponse.json({code:"TEMPORARY_ACCESS_PROVISIONING_FAILED"},{status:503,headers:{"Cache-Control":"no-store"}});
 }
}
