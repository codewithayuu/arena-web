"use client";

import { ContestSubmissionError, contestGatewayUrl, isParticipantContestProblem, type ContestSubmissionInput, type ParticipantContestProblem } from "./contest-submissions";
import { cancelLocalExecution, ensureLocalToolchain, getRuntimeStatus, RuntimeBridgeError, type ContestAdmission, type RuntimeSession, type ContestLocalRunContext } from "./runtime-bridge";

export const LOCAL_EVALUATION_NOTICE = "Submissions are evaluated on your device. Evaluation data is delivered to your device and may be recovered. Results are client-reported and are not independently verified by the server.";
export type LocalEvaluationReport = { verdict: "AC"|"WA"|"CE"|"RE"|"TLE"|"MLE"|"OLE"; cases_passed: number; toolchain_sha256: string; duration_ms: number; peak_memory_bytes: number };
type EvaluationGrant = { grant_id: string; source_sha256: string; package_sha256: string; payload_json: string; expires_at: string; issued_at: string; result_origin: "CLIENT_REPORTED" };
type LocalEvaluationPackage = {schema_version:1;contest_id:string;problem_id:string;policy_revision:number;checker:"exact_bytes_v1"|"tokens_v1";time_limit_ms:number;memory_limit_bytes:number;cases:Array<{input:string;output:string}>};
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
  if(!record(value)||!onlyKeys(value,["schema_version","contest_id","problem_id","policy_revision","checker","time_limit_ms","memory_limit_bytes","cases"])
    ||value.schema_version!==1||value.contest_id!==contestId||value.problem_id!==problemId||value.policy_revision!==policyRevision
    ||!(value.checker==="exact_bytes_v1"||value.checker==="tokens_v1")||!Number.isInteger(value.time_limit_ms)||Number(value.time_limit_ms)<1||Number(value.time_limit_ms)>120000
    ||!Number.isSafeInteger(value.memory_limit_bytes)||Number(value.memory_limit_bytes)<1048576||Number(value.memory_limit_bytes)>2147483648
    ||!Array.isArray(value.cases)||value.cases.length<1||value.cases.length>64)return null;
  let totalInput=0;
  for(const item of value.cases){
    if(!record(item)||!onlyKeys(item,["input","output"])||typeof item.input!=="string"||typeof item.output!=="string")return null;
    const inputBytes=new TextEncoder().encode(item.input).byteLength,outputBytes=new TextEncoder().encode(item.output).byteLength;
    if(inputBytes>65536||outputBytes>32768)return null;totalInput+=inputBytes;if(totalInput>2*1024*1024)return null;
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
  const value=await boundedJson(response,action==="package"||action==="grants"?10*1024*1024:5*1024*1024);
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
  if(value.result_origin!=="CLIENT_REPORTED" || !Array.isArray(value.problems) || !value.problems.length
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
  args.onProgress("Requesting a source-bound local evaluation grant…");
  const rawGrant=await authority(args.contestId,"grants",args.accessToken,{lease:lease(args.admission),problem_id:args.problemId,
    language:args.language,source:args.source,idempotency_key:args.idempotencyKey,notice_accepted:true});
  const pins=args.context.contestPolicy.policy.local_evaluation_packages as Record<string,unknown>|undefined;
  if(typeof rawGrant.grant_id!=="string"||typeof rawGrant.source_sha256!=="string"||typeof rawGrant.package_sha256!=="string"
    ||typeof rawGrant.payload_json!=="string"||typeof rawGrant.expires_at!=="string"||typeof rawGrant.issued_at!=="string"
    ||rawGrant.result_origin!=="CLIENT_REPORTED")throw new Error("INVALID_EVALUATION_GRANT");
  const grant=rawGrant as unknown as EvaluationGrant;
  const digest=await sha256(grant.payload_json),sourceDigest=await sha256(args.source);
  const evaluationPackage=parsePinnedPackage(grant.payload_json,args.contestId,args.problemId,args.admission.policy_revision,digest);
  const issuedAt=Date.parse(grant.issued_at),expiresAt=Date.parse(grant.expires_at);
  if(!UUID.test(grant.grant_id)||!SHA.test(grant.source_sha256)||grant.source_sha256!==sourceDigest||!SHA.test(grant.package_sha256)
    ||grant.package_sha256!==digest||pins?.[args.problemId]!==digest||!evaluationPackage||!Number.isFinite(issuedAt)||!Number.isFinite(expiresAt)
    ||issuedAt>Date.now()+120000||expiresAt<=Date.now()||expiresAt<=issuedAt||expiresAt-issuedAt>15*60*1000)throw new Error("INVALID_EVALUATION_GRANT");
  const recoveryKey=`mindflare-local-report-v1:${args.contestId}:${args.admission.session_id}:${args.idempotencyKey}`;
  let report:LocalEvaluationReport|null=null;
  let existing:string|null;try{existing=localStorage.getItem(recoveryKey)}catch{throw new Error("LOCAL_REPORT_RECOVERY_UNAVAILABLE");}
  if(existing) {
    if(new TextEncoder().encode(existing).byteLength>4096)throw new Error("INVALID_LOCAL_RECOVERY");
    let cached:unknown;try{cached=JSON.parse(existing)}catch{throw new Error("INVALID_LOCAL_RECOVERY");}
    if(!record(cached)||!onlyKeys(cached,["grant_id","source_sha256","report"])||cached.grant_id!==grant.grant_id
      ||cached.source_sha256!==grant.source_sha256||!validReport(cached.report,evaluationPackage.cases.length))throw new Error("INVALID_LOCAL_RECOVERY");
    report=cached.report;
  }
  if(!report) {
    let capability=(await getRuntimeStatus())?.capabilities.find(c=>c.language===args.language);
    if(capability && !capability.available && capability.reason==="TOOLCHAIN_MISSING" && capability.toolchain_version) {
      await ensureLocalToolchain(args.session,args.language,capability.toolchain_version);
      capability=(await getRuntimeStatus())?.capabilities.find(c=>c.language===args.language);
    }
    if(!capability?.available || !capability.toolchain_version) throw new RuntimeBridgeError("TOOLCHAIN_MISSING","A verified compiler and sandbox are required.");
    const executionId=crypto.randomUUID(); args.onProgress("Evaluating on this device…",executionId);
    let response:Response;
    try {
      response=await fetch("http://127.0.0.1:48731/v1/execution/evaluate",{method:"POST",credentials:"omit",cache:"no-store",redirect:"error",
        headers:{Authorization:`Bearer ${args.session.sessionToken}`,"Content-Type":"application/json"},
        body:JSON.stringify({payload_json:grant.payload_json,execution:{protocol_version:1,execution_id:executionId,mode:"CONTEST_SAMPLE_LOCAL",
          language:args.language,source:args.source,toolchain_version:capability.toolchain_version,stdin:"",problem_id:args.problemId,
          contest_policy:args.context.contestPolicy,test_bundle_id:null}}),signal:AbortSignal.timeout(600000)});
    } catch(error) {await cancelLocalExecution(args.session,executionId).catch(()=>undefined);throw error;}
    const value=await boundedJson(response,16384);
    if(!response.ok || !validReport(value,evaluationPackage.cases.length)) throw new Error("LOCAL_EVALUATION_FAILED");
    report=value;
    const serialized=JSON.stringify({grant_id:grant.grant_id,source_sha256:grant.source_sha256,report});
    try{localStorage.setItem(recoveryKey,serialized);if(localStorage.getItem(recoveryKey)!==serialized)throw new Error();}
    catch{throw new Error("LOCAL_REPORT_PERSISTENCE_FAILED");}
  }
  args.onProgress("Local evaluation finished. Recording the client report with the contest service…");
  const receipt=await authority(args.contestId,"reports",args.accessToken,{lease:lease(args.admission),grant_id:grant.grant_id,report});
  const submissionId=receipt.submission_id;
  if(typeof submissionId!=="string" || !UUID.test(submissionId) || receipt.status!=="judged" || receipt.result_origin!=="CLIENT_REPORTED") throw new Error("INVALID_AUTHORITY_RESPONSE");
  try{localStorage.removeItem(recoveryKey)}catch{/* The receipt is already durable; a stale local cache is not an official result. */}
  return submissionId;
}

function validReport(value:unknown,totalCases:number):value is LocalEvaluationReport {
  return record(value)&&onlyKeys(value,["verdict","cases_passed","toolchain_sha256","duration_ms","peak_memory_bytes"])
    &&["AC","WA","CE","RE","TLE","MLE","OLE"].includes(String(value.verdict))
    &&Number.isInteger(value.cases_passed)&&Number(value.cases_passed)>=0&&Number(value.cases_passed)<=totalCases
    &&typeof value.toolchain_sha256==="string"&&SHA.test(value.toolchain_sha256)&&value.toolchain_sha256!==ZERO_SHA
    &&Number.isSafeInteger(value.duration_ms)&&Number(value.duration_ms)>=0&&Number(value.duration_ms)<=3600000
    &&Number.isSafeInteger(value.peak_memory_bytes)&&Number(value.peak_memory_bytes)>=0&&Number(value.peak_memory_bytes)<=2147483648
    &&((value.verdict==="AC")===(value.cases_passed===totalCases));
}
