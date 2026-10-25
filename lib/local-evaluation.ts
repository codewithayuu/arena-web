"use client";

import { ContestSubmissionError, contestGatewayUrl, isParticipantContestProblem, type ContestSubmissionInput, type ParticipantContestProblem } from "./contest-submissions";
import { cancelLocalExecution, ensureLocalToolchain, getRuntimeStatus, RuntimeBridgeError, type ContestAdmission, type RuntimeSession, type ContestLocalRunContext } from "./runtime-bridge";

export const LOCAL_EVALUATION_NOTICE = "Your source runs on this device. Test inputs and locally produced outputs can be inspected or altered by its owner. The service compares the outputs it receives with expected outputs kept on the service. It cannot verify that those outputs came from your submitted source.";
type OutputCheckRunResult = {cases:Array<{stdout:string;exit_code:number|null;compile_exit_code:number|null}>;toolchain_sha256:string};
type LocalEvaluationPackage = {schema_version:1;contest_id:string;problem_id:string;policy_revision:number;time_limit_ms:number;memory_limit_bytes:number;cases:Array<{input:string}>};
type OutputCheckReceipt = {submission_id:string;status:"judged";result_origin:"CLIENT_EXECUTION_SERVER_OUTPUT_CHECKED";verdict:"AC"|"WA"|"CE"|"RE";cases_passed:number;cases_total:number};
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SHA=/^[a-f0-9]{64}$/;
const ZERO_SHA="0".repeat(64);

function record(value:unknown):value is Record<string,unknown> {
  return value!==null&&typeof value==="object"&&!Array.isArray(value);
}
function onlyKeys(value:Record<string,unknown>,keys:string[]):boolean {
  return Object.keys(value).length===keys.length&&Object.keys(value).every(key=>keys.includes(key));
}
async function sha256(value:string):Promise<string> {
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,"0")).join("");
}
function parsePinnedPackage(payloadJson:string,contestId:string,problemId:string,policyRevision:number,expectedSha:string):LocalEvaluationPackage|null {
  if(new TextEncoder().encode(payloadJson).byteLength>4*1024*1024||!UUID.test(contestId)||!UUID.test(problemId)||!SHA.test(expectedSha))return null;
  let value:unknown;try{value=JSON.parse(payloadJson)}catch{return null;}
  if(!record(value)||!onlyKeys(value,["schema_version","contest_id","problem_id","policy_revision","time_limit_ms","memory_limit_bytes","cases"])
    ||value.schema_version!==1||value.contest_id!==contestId||value.problem_id!==problemId||value.policy_revision!==policyRevision
    ||!Number.isInteger(value.time_limit_ms)||Number(value.time_limit_ms)<1||Number(value.time_limit_ms)>120000
    ||!Number.isSafeInteger(value.memory_limit_bytes)||Number(value.memory_limit_bytes)<1048576||Number(value.memory_limit_bytes)>2147483648
    ||!Array.isArray(value.cases)||value.cases.length<1||value.cases.length>64)return null;
  let totalInput=0;
  for(const item of value.cases){
    if(!record(item)||!onlyKeys(item,["input"])||typeof item.input!=="string")return null;
    const inputBytes=new TextEncoder().encode(item.input).byteLength;
    if(inputBytes>65536)return null;totalInput+=inputBytes;if(totalInput>2*1024*1024)return null;
  }
  return value as LocalEvaluationPackage;
}

export function contestExecutionMode(policy: Record<string,unknown>): "server_judged"|"participant_local" {
  if (policy.execution_mode===undefined || policy.execution_mode==="server_judged") return "server_judged";
  if (policy.execution_mode==="participant_local") return "participant_local";
  throw new Error("UNSUPPORTED_EXECUTION_MODE");
}

function lease(admission: ContestAdmission) {
  return { session_id:admission.session_id,device_id:admission.device_id,device_epoch:admission.device_epoch,lease_token:admission.lease_token };
}

async function boundedJson(response: Response, limit=5*1024*1024): Promise<unknown> {
  const reader=response.body?.getReader();
  if (!reader) throw new Error("INVALID_AUTHORITY_RESPONSE");
  const chunks: Uint8Array[]=[]; let size=0;
  try {
    for (;;) { const next=await reader.read(); if (next.done) break; size+=next.value.byteLength;
      if(size>limit) throw new Error("INVALID_AUTHORITY_RESPONSE"); chunks.push(next.value); }
    const bytes=new Uint8Array(size); let offset=0;
    for(const chunk of chunks) {bytes.set(chunk,offset);offset+=chunk.byteLength;}
    return JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes));
  } finally { await reader.cancel().catch(()=>undefined); reader.releaseLock(); }
}

async function authority(contestId:string, action:string, accessToken:string, body:unknown): Promise<Record<string,unknown>> {
  const origin=contestGatewayUrl();
  if(!origin || !UUID.test(contestId) || !accessToken) throw new ContestSubmissionError(503,"CONTEST_AUTHORITY_UNAVAILABLE");
  const response=await fetch(new URL(`/v1/contests/${contestId}/local-evaluation/${action}`,origin),{
    method:"POST",headers:{Authorization:`Bearer ${accessToken}`,"Content-Type":"application/json"},
    body:JSON.stringify(body),credentials:"omit",cache:"no-store",redirect:"error",signal:AbortSignal.timeout(15000),
  });
  const value=await boundedJson(response,action==="package"?5*1024*1024:5*1024*1024);
  if(!response.ok) throw new ContestSubmissionError(response.status,
    value && typeof value==="object" && "code" in value && typeof value.code==="string" ? value.code : "LOCAL_EVALUATION_REJECTED");
  if(!record(value))throw new Error("INVALID_AUTHORITY_RESPONSE");
  return value;
}

export async function acceptLocalEvaluationNotice(contestId:string,accessToken:string,revision:number,digest:string) {
  const value=await authority(contestId,"consent",accessToken,{accepted:true,policy_revision:revision,policy_sha256:digest});
  if(value.accepted!==true || value.notice_version!==1 || value.policy_sha256!==digest) throw new Error("INVALID_AUTHORITY_RESPONSE");
}

export async function getLocalEvaluationProblems(contestId:string,accessToken:string,admission:ContestAdmission):Promise<ParticipantContestProblem[]> {
  const value=await authority(contestId,"problems",accessToken,lease(admission));
  if(value.result_origin!=="CLIENT_EXECUTION_SERVER_OUTPUT_CHECKED" || !Array.isArray(value.problems) || !value.problems.length
    || value.problems.length>256 || !value.problems.every(isParticipantContestProblem)) throw new Error("INVALID_AUTHORITY_RESPONSE");
  return value.problems;
}

export async function getLocalEvaluationPackage(contestId:string,accessToken:string,admission:ContestAdmission,problemId:string,
  policyRevision:number,expectedSha:string):Promise<string> {
  const value=await authority(contestId,"package",accessToken,{lease:lease(admission),problem_id:problemId});
  if(typeof value.payload_json!=="string" || typeof value.package_sha256!=="string" || value.package_sha256!==expectedSha
    ||await sha256(value.payload_json)!==expectedSha||!parsePinnedPackage(value.payload_json,contestId,problemId,policyRevision,expectedSha))
    throw new Error("INVALID_AUTHORITY_RESPONSE");
  return value.payload_json;
}

export async function submitLocalEvaluation(args:{contestId:string;accessToken:string;admission:ContestAdmission;session:RuntimeSession;
  problemId:string;language:ContestSubmissionInput["language"];source:string;idempotencyKey:string;context:ContestLocalRunContext;
  onProgress:(message:string,executionId?:string)=>void}):Promise<string> {
  args.onProgress("Loading the test inputs for this submission…");
  const payloadJson=await getLocalEvaluationPackage(args.contestId,args.accessToken,args.admission,args.problemId,
    args.admission.policy_revision,String((args.context.contestPolicy.policy.local_evaluation_packages as Record<string,unknown>|undefined)?.[args.problemId]||""));
  const pins=args.context.contestPolicy.policy.local_evaluation_packages as Record<string,unknown>|undefined;
  const expectedSha=String(pins?.[args.problemId]||"");
  if(!SHA.test(expectedSha)||await sha256(payloadJson)!==expectedSha)throw new Error("INVALID_OUTPUT_CHECK_PACKAGE");
  const evaluationPackage=parsePinnedPackage(payloadJson,args.contestId,args.problemId,args.admission.policy_revision,expectedSha);
  if(!evaluationPackage)throw new Error("INVALID_OUTPUT_CHECK_PACKAGE");
  let capability=(await getRuntimeStatus())?.capabilities.find(c=>c.language===args.language);
  if(capability && !capability.available && capability.reason==="TOOLCHAIN_MISSING" && capability.toolchain_version) {
    await ensureLocalToolchain(args.session,args.language,capability.toolchain_version);
    capability=(await getRuntimeStatus())?.capabilities.find(c=>c.language===args.language);
  }
  if(!capability?.available || !capability.toolchain_version) throw new RuntimeBridgeError("TOOLCHAIN_MISSING","A verified compiler and sandbox are required.");
  const executionId=crypto.randomUUID(); args.onProgress("Running the submission locally…",executionId);
  let response:Response;
  try {
    response=await fetch("http://127.0.0.1:48731/v1/execution/evaluate",{method:"POST",credentials:"omit",cache:"no-store",redirect:"error",
      headers:{Authorization:`Bearer ${args.session.sessionToken}`,"Content-Type":"application/json"},
      body:JSON.stringify({payload_json:payloadJson,execution:{protocol_version:1,execution_id:executionId,mode:"CONTEST_SAMPLE_LOCAL",
        language:args.language,source:args.source,toolchain_version:capability.toolchain_version,stdin:"",problem_id:args.problemId,
        contest_policy:args.context.contestPolicy,test_bundle_id:null}}),signal:AbortSignal.timeout(600000)});
  } catch(error) {await cancelLocalExecution(args.session,executionId).catch(()=>undefined);throw error;}
  // The bounded stdout batch can expand to about 12 MiB in JSON when control
  // characters are escaped. Keep the response reader aligned with the gateway.
  const value=await boundedJson(response,14*1024*1024);
  if(!response.ok||!validOutputCheckResult(value,evaluationPackage.cases.length))throw new Error("LOCAL_OUTPUT_CHECK_RUN_FAILED");
  args.onProgress("Sending local outputs for comparison with server-held expected outputs…");
  const receiptValue=await authority(args.contestId,"outputs",args.accessToken,{lease:lease(args.admission),problem_id:args.problemId,
    language:args.language,idempotency_key:args.idempotencyKey,source_sha256:await sha256(args.source),outputs:value.cases,
    toolchain_sha256:value.toolchain_sha256});
  const receipt=receiptValue as unknown as OutputCheckReceipt;
  if(!UUID.test(receipt.submission_id)||receipt.status!=="judged"||receipt.result_origin!=="CLIENT_EXECUTION_SERVER_OUTPUT_CHECKED"
    ||!["AC","WA","CE","RE"].includes(receipt.verdict)||!Number.isInteger(receipt.cases_passed)
    ||receipt.cases_passed<0||receipt.cases_passed>evaluationPackage.cases.length||receipt.cases_total!==evaluationPackage.cases.length)
    throw new Error("INVALID_AUTHORITY_RESPONSE");
  return receipt.submission_id;
}

function validOutputCheckResult(value:unknown,totalCases:number):value is OutputCheckRunResult {
  if(!record(value)||!onlyKeys(value,["cases","toolchain_sha256"])||typeof value.toolchain_sha256!=="string"
    ||!SHA.test(value.toolchain_sha256)||value.toolchain_sha256===ZERO_SHA||!Array.isArray(value.cases)||value.cases.length!==totalCases)return false;
  let totalBytes=0;
  for(const item of value.cases){
    if(!record(item)||!onlyKeys(item,["stdout","exit_code","compile_exit_code"])||typeof item.stdout!=="string"||item.stdout.includes("\0")
      ||(item.exit_code!==null&&!Number.isInteger(item.exit_code))||(item.compile_exit_code!==null&&!Number.isInteger(item.compile_exit_code)))return false;
    const size=new TextEncoder().encode(item.stdout).byteLength;
    if(size>32768)return false;totalBytes+=size;if(totalBytes>2*1024*1024)return false;
  }
  return true;
}
