import "server-only";
import { createHash } from "node:crypto";
import { NextRequest,NextResponse } from "next/server";
import { adminGatewayRequest } from "./contest-admin.server";
import { parseContestZip } from "./contest-package-parser";

export async function importLocalContest(request:NextRequest):Promise<Response> {
 const authorized=await adminGatewayRequest("/v1/admin/contests?limit=1&offset=0");if(!authorized.ok)return authorized;
 if(request.headers.get("origin")!==new URL(request.url).origin)return NextResponse.json({code:"ORIGIN_DENIED"},{status:403});
 if(request.headers.get("content-type")?.split(";")[0]!=="multipart/form-data")
  return NextResponse.json({code:"PROBLEM_ZIPS_REQUIRED",error:"Upload one ZIP per problem."},{status:415});
 const key=request.headers.get("idempotency-key");
 if(!key||!/^[0-9a-f-]{36}$/i.test(key))return NextResponse.json({code:"IDEMPOTENCY_KEY_REQUIRED"},{status:400});
 try {
  const form=await request.formData();const contestName=String(form.get("contest_name")||"").trim();
  const uploads=form.getAll("problem_zip").filter((item):item is File=>item instanceof File);
  if(contestName.length<3||contestName.length>160||uploads.length<1||uploads.length>64)
   return NextResponse.json({code:"INVALID_PROBLEM_ZIP_SET"},{status:400});
  let compressedBytes=0;let extractedBytes=0;const archiveDigests:string[]=[];const problems=[] as Array<Record<string,unknown>>;
  for(let index=0;index<uploads.length;index++){
   const file=uploads[index];compressedBytes+=file.size;
   if(file.size<1||file.size>16*1024*1024||compressedBytes>64*1024*1024)throw new Error();
   const archive=Buffer.from(await file.arrayBuffer());archiveDigests.push(createHash("sha256").update(archive).digest("hex"));
   const parsed=parseContestZip(archive,{includeEvaluationCases:true});
   if(parsed.problems.length!==1)throw new Error();
   const problem=parsed.problems[0];
   const cases=problem.evaluation_cases;
   const caseBytes=cases?Buffer.byteLength(JSON.stringify(cases)):0;
   const totalInputBytes=cases?.reduce((sum,c)=>sum+Buffer.byteLength(c.input),0)??0;
   if(problem.requires_custom_checker || !cases?.length || cases.length>64 || caseBytes>4*1024*1024-4096||totalInputBytes>2*1024*1024
     ||cases.some(c=>Buffer.byteLength(c.input)>65536||Buffer.byteLength(c.output)>32768)
     || problem.time_limit_ms<1||problem.time_limit_ms>120000||problem.memory_limit_mb>2048||problem.memory_limit_mb<1)throw new Error();
   extractedBytes+=Buffer.byteLength(problem.statement_markdown)+Buffer.byteLength(JSON.stringify(cases));
   if(extractedBytes>24*1024*1024)throw new Error();
   const ordinal=index+1;
   const identifier=createHash("sha256").update(`mindflare.arena2.problem.v1:${key}:${ordinal}`).digest().subarray(0,16);
   identifier[6]=(identifier[6]&15)|128;identifier[8]=(identifier[8]&63)|128;
   const hex=identifier.toString("hex");const problemId=`${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
   problems.push({problem_id:problemId,ordinal,title:problem.title,statement_markdown:problem.statement_markdown,
    public_samples:problem.public_samples,time_limit_ms:problem.time_limit_ms,memory_limit_bytes:problem.memory_limit_mb*1024*1024,
    checker:"tokens_v1",cases});
  }
  const sourceSha256=createHash("sha256").update(JSON.stringify(archiveDigests)).digest("hex");
  const payload=JSON.stringify({name:contestName,source_sha256:sourceSha256,problems,reason:"Create an output-checked contest from individually uploaded problem archives"});
  if(Buffer.byteLength(payload)>28*1024*1024)throw new Error();
  return adminGatewayRequest("/v1/admin/contests/import-local",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":key},
   body:payload});
 }catch{return NextResponse.json({code:"PROBLEM_ZIP_IMPORT_REJECTED",error:"Each ZIP must contain exactly one static problem with complete input/output pairs. The archive set exceeded supported case, size or checker limits."},{status:422});}
}
