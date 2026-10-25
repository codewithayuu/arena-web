import "server-only";
import { auth, reverificationErrorResponse } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isIP } from "node:net";

export async function adminGatewayRequest(path:string,init:RequestInit={}):Promise<Response> {
  const session=await auth();
  if(!session.userId) return NextResponse.json({code:"UNAUTHORIZED"},{status:401});
  const token=await session.getToken();
  if(!token) return NextResponse.json({code:"UNAUTHORIZED"},{status:401});
  return adminGatewayRequestWithToken(path,token,init);
}

/** The native Admin Companion supplies its short-lived Clerk session token in memory.
 * The gateway still verifies the token, AAL2 freshness, and server-owned admin role. */
export async function adminGatewayRequestWithToken(path:string,token:string,init:RequestInit={}):Promise<Response> {
  if(typeof token!=="string"||token.length<32||token.length>16384||/\s/.test(token))
    return NextResponse.json({code:"UNAUTHORIZED"},{status:401});
  let base:URL;
  try {
    base=new URL(process.env.MINDFLARE_GATEWAY_ORIGIN||"");
    if(base.protocol!=="https:" || base.username || base.password || base.pathname!=="/" || base.search || base.hash
      || isIP(base.hostname) || base.hostname.endsWith(".localhost") || base.hostname==="localhost") throw new Error();
    if(!/^\/v1\/admin\/contests(?:\/(?:import-local|[0-9a-f-]{36}(?:\/[a-z0-9/-]+)?))?(?:\?[a-z0-9=&]+)?$/i.test(path)) throw new Error();
  } catch {return NextResponse.json({code:"ADMIN_AUTHORITY_UNAVAILABLE"},{status:503});}
  try {
    const headers=new Headers(init.headers);headers.set("Authorization",`Bearer ${token}`);headers.set("Accept","application/json");
    const response=await fetch(new URL(path,base),{...init,headers,cache:"no-store",redirect:"error",signal:AbortSignal.timeout(60000)});
    const value=await readBoundedJson(response,1024*1024);
    if(response.status===403 && value.code==="MFA_REQUIRED") return reverificationErrorResponse("strict_mfa");
    return NextResponse.json(response.ok?value:{code:typeof value.code==="string"?value.code:"ADMIN_REQUEST_REJECTED"},
      {status:response.status,headers:{"Cache-Control":"no-store"}});
  } catch {return NextResponse.json({code:"ADMIN_AUTHORITY_UNAVAILABLE"},{status:503,headers:{"Cache-Control":"no-store"}});}
}

export async function readBoundedJson(response:Response,maxBytes:number):Promise<Record<string,unknown>> {
  const reader=response.body?.getReader();if(!reader)throw new Error("Missing JSON body");
  const chunks:Uint8Array[]=[];let size=0;
  try {
    for(;;){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>maxBytes)throw new Error("JSON body is too large");chunks.push(part.value);}
  } finally {await reader.cancel().catch(()=>undefined);reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  const value:unknown=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes));
  if(value===null||typeof value!=="object"||Array.isArray(value))throw new Error("Invalid JSON object");
  return value as Record<string,unknown>;
}

export async function readBoundedRequestJson(request:Request,maxBytes:number):Promise<Record<string,unknown>> {
  const reader=request.body?.getReader();if(!reader)throw new Error("Missing request body");
  const chunks:Uint8Array[]=[];let size=0;
  try {
    for(;;){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>maxBytes)throw new Error("JSON body is too large");chunks.push(part.value);}
  } finally {await reader.cancel().catch(()=>undefined);reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  const value:unknown=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes));
  if(value===null||typeof value!=="object"||Array.isArray(value))throw new Error("Invalid JSON object");
  return value as Record<string,unknown>;
}

export function requireSameOrigin(request:Request):NextResponse|null {
  if(request.headers.get("origin")!==new URL(request.url).origin || request.headers.get("content-type")?.split(";")[0]!=="application/json")
    return NextResponse.json({code:"ORIGIN_DENIED"},{status:403});
  return null;
}
