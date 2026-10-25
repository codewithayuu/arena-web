import "server-only";
import { createHash } from "node:crypto";
import { NextRequest,NextResponse } from "next/server";
import { adminGatewayRequest } from "./contest-admin.server";
import { parseContestZip } from "./contest-package-parser";

export async function importLocalContest(request:NextRequest):Promise<Response> {
 const authorized=await adminGatewayRequest("/v1/admin/contests?limit=1&offset=0");if(!authorized.ok)return authorized;
 if(request.headers.get("origin")!==new URL(request.url).origin)return NextResponse.json({code:"ORIGIN_DENIED"},{status:403});
 if(!["application/zip","application/octet-stream"].includes(request.headers.get("content-type")?.split(";")[0]||""))
  return NextResponse.json({code:"ZIP_UPLOAD_REQUIRED"},{status:415});
 const key=request.headers.get("idempotency-key");
 if(!key||!/^[0-9a-f-]{36}$/i.test(key))return NextResponse.json({code:"IDEMPOTENCY_KEY_REQUIRED"},{status:400});
 const reader=request.body?.getReader();if(!reader)return NextResponse.json({code:"EMPTY_UPLOAD"},{status:400});
 try {
  const chunks:Uint8Array[]=[];let size=0;
  for(;;){const next=await reader.read();if(next.done)break;size+=next.value.byteLength;
   if(size>16*1024*1024)return NextResponse.json({code:"ARCHIVE_TOO_LARGE"},{status:413});chunks.push(next.value);}
  const archive=Buffer.concat(chunks);const parsed=parseContestZip(archive,{includeEvaluationCases:true});
  if(!parsed.problems.length||parsed.problems.length>64)throw new Error();
  const problems=parsed.problems.map(problem=>{
   const cases=problem.evaluation_cases;
   if(problem.requires_custom_checker || !cases?.length || cases.length>64 || cases.some(c=>Buffer.byteLength(c.input)>65536||Buffer.byteLength(c.output)>32768)
     || problem.time_limit_ms<1||problem.time_limit_ms>120000||problem.memory_limit_mb>2048||problem.memory_limit_mb<1)throw new Error();
   const identifier=createHash("sha256").update(`mindflare.local-import.problem.v1:${key}:${problem.ordinal}`).digest().subarray(0,16);
   identifier[6]=(identifier[6]&15)|128;identifier[8]=(identifier[8]&63)|128;
   const hex=identifier.toString("hex");const problemId=`${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
   return {problem_id:problemId,ordinal:problem.ordinal,title:problem.title,statement_markdown:problem.statement_markdown,
    public_samples:problem.public_samples,time_limit_ms:problem.time_limit_ms,memory_limit_bytes:problem.memory_limit_mb*1024*1024,
    checker:"tokens_v1",cases};
  });
  return adminGatewayRequest("/v1/admin/contests/import-local",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":key},
   body:JSON.stringify({name:parsed.name,source_sha256:createHash("sha256").update(archive).digest("hex"),problems,reason:"Import static local evaluation contest archive"})});
 }catch{return NextResponse.json({code:"LOCAL_IMPORT_REQUIRES_COMPLETE_STATIC_TEST_PAIRS",error:"Use complete input/output pairs for 1–64 cases per problem. Custom checkers and interactive problems require the server-judge import pipeline."},{status:422});}
 finally {await reader.cancel().catch(()=>undefined);reader.releaseLock();}
}
