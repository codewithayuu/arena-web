"use client";
import { useAuth } from "@clerk/nextjs";
import { useEffect,useRef,useState } from "react";
import { contestGatewayUrl } from "@/lib/contest-submissions";
import type { ContestAdmission } from "@/lib/runtime-bridge";
import { initializeFaceLandmarker,observeFaceFromVideo,releaseFaceLandmarker } from "@/lib/proctoring/face-detector";

type CameraPolicy={enabled:true;required:boolean;face_indicators:boolean;notice_version:1;notice_body:string;notice_sha256:string};
type Indicator={event_id:string;event_type:"CAMERA_READY"|"CAMERA_UNAVAILABLE"|"FACE_NOT_DETECTED"|"MULTIPLE_FACES"|"GAZE_AWAY";face_count?:number;observed_duration_seconds:number};
const eventTypes=new Set<Indicator["event_type"]>(["CAMERA_READY","CAMERA_UNAVAILABLE","FACE_NOT_DETECTED","MULTIPLE_FACES","GAZE_AWAY"]);
function isIndicator(value:unknown):value is Indicator {
 if(!value||typeof value!=="object"||Array.isArray(value))return false;
 const item=value as Record<string,unknown>,keys=Object.keys(item);
 return keys.every(key=>["event_id","event_type","face_count","observed_duration_seconds"].includes(key))
  &&keys.includes("event_id")&&keys.includes("event_type")&&keys.includes("observed_duration_seconds")
  &&typeof item.event_id==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.event_id)
  &&typeof item.event_type==="string"&&eventTypes.has(item.event_type as Indicator["event_type"])
  &&(item.face_count===undefined||(Number.isInteger(item.face_count)&&Number(item.face_count)>=0&&Number(item.face_count)<=3))
  &&Number.isInteger(item.observed_duration_seconds)&&Number(item.observed_duration_seconds)>=0&&Number(item.observed_duration_seconds)<=300;
}

export function ContestCamera({contestId,policy,revision,digest,admission,active,onReady,endsAt}:{contestId:string;policy:CameraPolicy;
 revision:number;digest:string;admission:ContestAdmission|null;active:boolean;onReady:(ready:boolean)=>void;endsAt:string}) {
 const {getToken,userId}=useAuth();const [consented,setConsented]=useState(false),[busy,setBusy]=useState(false),[ready,setReady]=useState(false);
 const [message,setMessage]=useState("Camera is off. Read the notice before enabling it."),[modelReady,setModelReady]=useState(false);
 const [delivery,setDelivery]=useState("No indicators have been sent.");
 const stream=useRef<MediaStream|null>(null),video=useRef<HTMLVideoElement|null>(null),pending=useRef<Indicator[]>([]);
 const mounted=useRef(true),latest=useRef({admission,active,getToken,userId});latest.current={admission,active,getToken,userId};
 const storeKey=admission&&userId?`mindflare-camera-metadata-v1:${userId}:${contestId}:${admission.session_id}`:null;
 const storeKeyRef=useRef(storeKey);storeKeyRef.current=storeKey;
 function persist(){try{if(storeKeyRef.current)localStorage.setItem(storeKeyRef.current,JSON.stringify(pending.current));}catch{setDelivery("Indicator recovery storage is unavailable; pending metadata remains in memory.");}}
 function queue(event_type:Indicator["event_type"],face_count?:number,duration=0){
  if(!latest.current.admission||!latest.current.active)return;
  pending.current=[...pending.current,{event_id:crypto.randomUUID(),event_type,face_count,observed_duration_seconds:duration}].slice(-100);persist();
 }
 function stop(){for(const track of stream.current?.getTracks()||[]){track.onended=null;track.stop();}stream.current=null;setReady(false);onReady(false);}
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;for(const track of stream.current?.getTracks()||[]){track.onended=null;track.stop();}stream.current=null;releaseFaceLandmarker();};},[]);
 useEffect(()=>{if(!active)stop();},[active]);
 useEffect(()=>{const remaining=Date.parse(endsAt)-Date.now();if(!Number.isFinite(remaining))return;
  const timer=window.setTimeout(()=>{stop();setMessage("The scheduled contest window has ended. Camera is off.");},Math.max(0,remaining));
  return()=>window.clearTimeout(timer);
 },[endsAt]);
 useEffect(()=>{
  if(!storeKey)return;
  try{const raw=localStorage.getItem(storeKey)||"[]";if(new TextEncoder().encode(raw).byteLength>32768)throw new Error();const cached=JSON.parse(raw);
   if(Array.isArray(cached)&&cached.length<=100&&cached.every(isIndicator))pending.current=cached;
   else throw new Error();
  }catch{setDelivery("Saved indicator metadata could not be recovered.");}
 },[storeKey]);
 useEffect(()=>{if(ready&&admission)queue("CAMERA_READY");},[ready,admission?.session_id]);
 async function post(action:string,body:unknown){
  const origin=contestGatewayUrl(),token=await latest.current.getToken({skipCache:true});if(!origin||!token)throw new Error();
  const response=await fetch(new URL(`/v1/contests/${contestId}/browser-camera/${action}`,origin),{method:"POST",credentials:"omit",cache:"no-store",redirect:"error",
   headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(8000)});
  const value=await response.json();if(!response.ok)throw new Error();return value;
 }
 async function start(){
  if(!consented||busy||!active)return;setBusy(true);
  try{
   const expected=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(policy.notice_body))),b=>b.toString(16).padStart(2,"0")).join("");
   if(expected!==policy.notice_sha256)throw new Error();
   const receipt=await post("consent",{accepted:true,policy_revision:revision,policy_sha256:digest});
   if(receipt.accepted!==true||receipt.policy_sha256!==digest)throw new Error();
   const captured=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:false});
   if(!mounted.current||!latest.current.active){captured.getTracks().forEach(track=>track.stop());return;}
   stream.current=captured;if(video.current){video.current.srcObject=captured;await video.current.play();}
   for(const track of captured.getVideoTracks())track.onended=()=>{setReady(false);onReady(false);queue("CAMERA_UNAVAILABLE");setMessage("Camera stopped. Restore the camera to continue.");};
   setReady(true);onReady(true);setMessage("Camera preview is active on this device. Indicators remain uncertain and require human review.");
   if(policy.face_indicators){const loaded=await initializeFaceLandmarker();if(mounted.current){setModelReady(loaded);if(!loaded)setMessage("Camera preview is active. The face/gaze model is unavailable; no model findings are being reported.");}}
  }catch{if(mounted.current){stop();setMessage("Camera readiness could not be completed. Check permissions and the contest preparation window, then retry or contact the organizer.");}}
  finally{if(mounted.current)setBusy(false);}
 }
 useEffect(()=>{
  if(!ready||!modelReady||!admission||!active)return;
  let previous="",count=0,lastSent=0;
  const timer=window.setInterval(()=>{
   if(!video.current)return;const observation=observeFaceFromVideo(video.current);if(!observation)return;
   const type=observation.face_count===0?"FACE_NOT_DETECTED":observation.face_count>1?"MULTIPLE_FACES":observation.gaze_away?"GAZE_AWAY":"";
   if(type!==previous){count=0;previous=type;}else count++;
   if(type&&count>=3&&Date.now()-lastSent>=15000){queue(type,observation.face_count,Math.min(count+1,300));lastSent=Date.now();}
  },1000);return()=>window.clearInterval(timer);
 },[ready,modelReady,admission?.session_id,active]);
 useEffect(()=>{
  if(!admission||!active)return;let sending=false,cancelled=false;
  const timer=window.setInterval(async()=>{
   if(sending||!pending.current.length||!navigator.onLine)return;sending=true;const item=pending.current[0];
   try{const lease=latest.current.admission;if(!lease)return;
    const receipt=await post("events",{lease:{session_id:lease.session_id,device_id:lease.device_id,device_epoch:lease.device_epoch,lease_token:lease.lease_token},event:item});
    if(receipt.recorded!==true||receipt.event_id!==item.event_id||receipt.result_origin!=="CLIENT_REPORTED")throw new Error();
    pending.current=pending.current.filter(event=>event.event_id!==item.event_id);persist();if(!cancelled)setDelivery("The contest service acknowledged the latest client-reported indicator metadata.");
   }catch{if(!cancelled)setDelivery("Indicator delivery is pending. Metadata is queued for retry.");}finally{sending=false;}
  },2000);return()=>{cancelled=true;window.clearInterval(timer)};
 },[admission?.session_id,active]);
 return <section className="mt-4 space-y-3 rounded-xl border border-white/20 p-4" aria-label="Contest camera readiness">
  <h4 className="font-semibold">Camera preview and local indicators</h4><p className="text-sm text-zinc-300">{policy.notice_body}</p>
  <video ref={video} autoPlay muted playsInline className="aspect-video w-full max-w-sm rounded-lg bg-black" aria-label="Your local camera preview"/>
  {!ready&&<><label className="flex gap-2 text-sm"><input type="checkbox" checked={consented} disabled={busy||!active} onChange={e=>setConsented(e.target.checked)}/>I consent to the camera processing and metadata described above.</label>
   <button type="button" disabled={!consented||busy||!active} onClick={()=>void start()} className="rounded-lg border border-white/25 px-4 py-2 disabled:opacity-50">{busy?"Preparing camera…":"Enable camera"}</button></>}
  {ready&&<button type="button" className="text-sm underline" onClick={()=>{queue("CAMERA_UNAVAILABLE");stop();setMessage("Camera is off.");}}>Stop camera</button>}
  <p role="status" className="text-sm text-amber-100">{message}</p><p className="text-xs text-zinc-400">{delivery}</p>
 </section>;
}
