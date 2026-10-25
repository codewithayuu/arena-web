"use client";
import { useCallback,useEffect,useRef,useState } from "react";
import Link from "next/link";
import { SignIn,useAuth,useReverification } from "@clerk/nextjs";

type Contest={id:string;name:string;state:string;lifecycle_version:number};
type Participant={user_id:string;display_name:string;membership_kind:"permanent"|"temporary";registration_status:string;
 blocked:boolean;session_state:string|null;last_heartbeat_at:string|null;submission_count:number;camera_event_count?:number;latest_camera_event?:string|null};
type Controls={contest_id:string;execution_mode:"server_judged"|"participant_local";lifecycle_version:number;mode_locked:boolean;settings_locked:boolean;
 starts_at:string|null;ends_at:string|null;server_time:string;participants:Participant[];state:string;late_join_grace_seconds:number;
 configuration:{directory_visibility?:"public"|"registered_only";signed_policy_settings?:{browser_camera?:{enabled:boolean;required:boolean;face_indicators:boolean}}}};
type IssuedKeys={user_id:string;login_key:string;exam_browser_key:string;expires_at:string};
const field="rounded-lg border border-white/20 bg-zinc-950 px-3 py-2 text-sm";

export function ContestControlDashboard() {
 const {isLoaded,isSignedIn}=useAuth();
 const verifyAdmin=useReverification(async()=>fetch("/api/admin/device-link/reauth",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}",cache:"no-store"}));
 const [contests,setContests]=useState<Contest[]>([]),[selected,setSelected]=useState("");
 const [controls,setControls]=useState<Controls|null>(null),[message,setMessage]=useState("Loading contest administration…");
 const [reason,setReason]=useState(""),[busy,setBusy]=useState(false),[name,setName]=useState(""),[email,setEmail]=useState("");
 const [keys,setKeys]=useState<IssuedKeys|null>(null);
 const [archives,setArchives]=useState<File[]>([]),[contestName,setContestName]=useState(""),[start,setStart]=useState(""),[end,setEnd]=useState(""),[lateGrace,setLateGrace]=useState(5);
 const importKey=useRef("");const publicationKey=useRef("");const selectedRef=useRef(selected);selectedRef.current=selected;
 const [pending,setPending]=useState<{key:string;command:Record<string,unknown>}|null>(null);
 useEffect(()=>{let active=true;void fetch("/api/admin/contests",{cache:"no-store"}).then(async response=>{
  const value=await response.json();if(!response.ok)throw new Error(value.code||"ADMIN_ACCESS_REQUIRED");
  if(active){setContests(value.items);setSelected(value.items[0]?.id||"");setMessage(value.items.length?"":"No contests have been created yet.");}
 }).catch(error=>{if(active)setMessage(error.message==="UNAUTHORIZED"?"Sign in with an administrator account.":"Administrator access with MFA is required, and the contest service must be available.");});return()=>{active=false};},[]);
 const refresh=useCallback(async()=>{
  if(!selected)return;
  const response=await fetch(`/api/admin/contests/${selected}/runtime-controls`,{cache:"no-store"});
  const value=await response.json();if(!response.ok)throw new Error(value.code||"ADMIN_ACCESS_REQUIRED");
  if(selectedRef.current===selected)setControls(value);
 },[selected]);
 useEffect(()=>{
  setControls(null);setKeys(null);setPending(null);let active=true,inFlight=false;
  async function update(){if(inFlight||!active||document.visibilityState!=="visible")return;inFlight=true;
   try{await refresh();}catch{if(active)setMessage("Live contest status could not be refreshed. The last confirmed snapshot is shown.");}finally{inFlight=false;}}
  void update();const timer=window.setInterval(update,10000);return()=>{active=false;window.clearInterval(timer)};
 },[refresh]);
 useEffect(()=>{
  if(!controls)return;
  const localInput=(value:string|null,fallback:number)=>{
   const date=new Date(value||fallback);return new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);
  };
  setStart(localInput(controls.starts_at,Date.now()+86400000));setEnd(localInput(controls.ends_at,Date.now()+86400000+7200000));
  setLateGrace(controls.late_join_grace_seconds/60);publicationKey.current=crypto.randomUUID();
 },[controls?.contest_id]);
 async function importArchive() {
  if(!archives.length||busy||contestName.trim().length<3)return;setBusy(true);if(!importKey.current)importKey.current=crypto.randomUUID();
  try {
   const form=new FormData();form.set("contest_name",contestName.trim());for(const archive of archives)form.append("problem_zip",archive,archive.name);
   const response=await fetch("/api/admin/contests/import",{method:"POST",headers:{"Idempotency-Key":importKey.current},body:form});
   const value=await response.json();if(!response.ok){setMessage(value.error||`Import failed: ${value.code}.`);return;}
   const list=await fetch("/api/admin/contests",{cache:"no-store"});if(list.ok)setContests((await list.json()).items);
   setSelected(value.contest_id);setMessage("The contest draft and individually uploaded problems were saved. Set visibility and schedule before publishing.");
   setArchives([]);setContestName("");importKey.current="";
  }catch{setMessage("Import is unconfirmed. Keep the same problem ZIPs and contest name selected, then retry to recover its receipt.");}
  finally{setBusy(false);}
 }
 async function publishLocal() {
  if(!controls||busy||reason.trim().length<8){setMessage("Enter a publication reason of at least eight characters.");return;}
  setBusy(true);
  try {
   const response=await fetch(`/api/admin/contests/${selected}/local-publication`,{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":publicationKey.current||crypto.randomUUID()},
    body:JSON.stringify({starts_at:new Date(start).toISOString(),ends_at:new Date(end).toISOString(),late_join_grace_seconds:lateGrace*60,expected_version:controls.lifecycle_version,reason})});
   const value=await response.json();if(!response.ok){setMessage(`Publication has not completed: ${value.code||response.status}. Retry after resolving the reported configuration.`);return;}
   setControls(value);setMessage("The contest schedule and signed local-evaluation policy are published.");
  }catch{setMessage("Publication is unconfirmed. Retry to resume the existing publication workflow.");}
  finally{setBusy(false);}
 }
 async function command(commandValue?:Record<string,unknown>) {
  const attempt=pending??(commandValue?{key:crypto.randomUUID(),command:{...commandValue,reason}}:null);
  if(!attempt||busy)return;
  if(String(attempt.command.reason||"").trim().length<8){setMessage("Enter a reason of at least eight characters.");return;}
  setPending(attempt);setBusy(true);
  try {
   const response=await fetch(`/api/admin/contests/${selected}/runtime-controls`,{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":attempt.key},body:JSON.stringify(attempt.command)});
   const value=await response.json();
   if(!response.ok){setMessage(`The contest service rejected this action: ${value.code||response.status}.`);if(response.status<500)setPending(null);return;}
   setPending(null);setMessage("The contest service recorded the action.");await refresh();
  }catch{setMessage("The action is unconfirmed. Retry the same pending action to recover its receipt.");}
  finally{setBusy(false);}
 }
 async function temporaryAccess(userId?:string) {
  setBusy(true);setKeys(null);
  try {
   const response=await fetch(`/api/admin/contests/${selected}/temporary-access`,{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify(userId?{user_id:userId}:{email,display_name:name})});
   const value=await response.json();if(!response.ok)throw new Error();
   setKeys(value);setMessage("Temporary access was issued. Share each key only with this participant; keys are shown once.");await refresh();
  }catch{setMessage("Temporary access could not be confirmed. Refresh the roster; reissue keys for an existing temporary participant instead of creating a duplicate account.");}
  finally{setBusy(false);}
 }
 return <main className="mx-auto max-w-6xl space-y-6 px-6 py-12 text-zinc-100">
  <header><h1 className="text-3xl font-bold">Contest operations</h1><p className="mt-2 text-zinc-400">Manage evaluation, participant access, and live progress.</p></header>
  <p role="status" aria-live="polite" className="text-sm text-amber-100">{message}</p>
  {isLoaded&&!isSignedIn&&<SignIn fallbackRedirectUrl="/operations/contest-management" />}
  {isSignedIn&&<button className={field} disabled={busy} onClick={async()=>{const response=await verifyAdmin();if(response instanceof Response&&response.ok)window.location.reload();}}>Verify administrator session</button>}
  <section className="space-y-3 rounded-xl border border-white/15 p-5"><h2 className="font-semibold">Create a contest from problem ZIPs</h2>
   <p className="text-sm text-zinc-400">Add one ZIP per problem. Each package must contain one static problem with complete input/output pairs, up to 64 cases, 64 KiB per input, 32 KiB per expected output, and 2 MiB total input. Inputs are inspectable on participant devices; expected outputs stay in the contest database.</p>
   <label className="block text-sm">Contest name<input className={`${field} mt-1 block w-full`} maxLength={160} value={contestName} onChange={event=>{setContestName(event.target.value);importKey.current=crypto.randomUUID();}} /></label>
   <input type="file" aria-label="Problem ZIP archive" accept=".zip" disabled={busy} onChange={event=>{
    const file=event.target.files?.[0];if(file){setArchives(current=>[...current,file]);importKey.current=crypto.randomUUID();}event.currentTarget.value="";
   }} />
   <ul className="space-y-1 text-sm">{archives.map((file,index)=><li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3">
    <span>{index+1}. {file.name} · {(file.size/1024/1024).toFixed(1)} MiB</span>
    <button type="button" className={field} disabled={busy} onClick={()=>{setArchives(current=>current.filter((_,item)=>item!==index));importKey.current=crypto.randomUUID();}}>Remove</button>
   </li>)}</ul>
   <button className={field} disabled={archives.length===0||contestName.trim().length<3||busy} onClick={()=>void importArchive()}>Generate contest draft</button>
  </section>
  <div className="flex flex-wrap items-center gap-3"><label>Contest <select className={field} value={selected} onChange={e=>setSelected(e.target.value)} disabled={busy||!!pending}>
   <option value="">Select a contest</option>{contests.map(contest=><option key={contest.id} value={contest.id}>{contest.name} · {contest.state}</option>)}</select></label>
   <Link href="/contests" className="text-sm underline">Participant view</Link></div>
  {controls&&<>
   {!controls.mode_locked&&<section className="space-y-3 rounded-xl border border-white/15 p-5"><h2 className="font-semibold">Contest visibility</h2>
    <p className="text-sm text-zinc-400">Public contests appear in the public and registered-user schedules. Registered-only contests appear only to participants registered for that contest.</p>
    <select aria-label="Contest visibility" className={field} disabled={busy||!!pending} value={controls.configuration.directory_visibility||"public"}
     onChange={e=>void command({action:"set_visibility",visibility:e.target.value,expected_version:controls.lifecycle_version})}>
     <option value="public">Public</option><option value="registered_only">Registered users only</option>
    </select>
   </section>}
   <section className="space-y-3 rounded-xl border border-white/15 p-5"><h2 className="font-semibold">Evaluation flow</h2>
    <p className="text-sm">{controls.execution_mode==="participant_local"?"Dry runs and submissions execute on the participant device. Submission stdout is compared with expected outputs held by the contest service.":"This draft uses a legacy server-judged policy. Create a new Arena2 contest to use the current local output-comparison flow."}</p>
    <p className="text-xs text-zinc-400">The participant can inspect or forge outputs on an owned machine. The result records a server-side comparison but does not verify that source code produced those outputs.</p>
    <label className="flex gap-2 text-sm"><input type="checkbox" disabled={busy||controls.mode_locked||controls.settings_locked||!!pending}
      checked={controls.configuration.signed_policy_settings?.browser_camera?.enabled===true} onChange={event=>void command({action:"set_browser_camera",
        enabled:event.target.checked,face_indicators:event.target.checked,required:event.target.checked,expected_version:controls.lifecycle_version})}/>
      Camera preview and consented local indicators, with metadata for human admin review</label>
    <label className="block text-sm">Reason for the next action<input className={`${field} mt-2 block w-full`} value={reason} maxLength={1000} onChange={e=>setReason(e.target.value)} /></label>
    {pending&&<button disabled={busy} className={field} onClick={()=>void command()}>Retry pending action</button>}
   </section>
   {controls.execution_mode==="participant_local"&&!controls.mode_locked&&<section className="space-y-3 rounded-xl border border-white/15 p-5">
    <h2 className="font-semibold">Schedule and publish</h2><p className="text-sm text-zinc-400">Preparation opens five minutes before the scheduled start. Publication requires the configured policy signing key and a superadmin account with MFA.</p>
    <div className="flex flex-wrap gap-3"><label className="text-sm">Starts at<input className={`${field} block`} type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} disabled={busy||controls.state==="validating"}/></label>
     <label className="text-sm">Ends at<input className={`${field} block`} type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} disabled={busy||controls.state==="validating"}/></label>
     <label className="text-sm">Late-join grace (minutes)<input className={`${field} block w-24`} type="number" min={0} max={30} value={lateGrace} onChange={e=>setLateGrace(Number(e.target.value))} disabled={busy||controls.state==="validating"}/></label></div>
    <button className={field} disabled={busy||!!pending} onClick={()=>void publishLocal()}>Publish contest</button>
   </section>}
   <section className="space-y-3 rounded-xl border border-white/15 p-5"><h2 className="font-semibold">Temporary participant</h2>
    <form className="flex flex-wrap gap-3" onSubmit={e=>{e.preventDefault();void temporaryAccess()}}>
     <input aria-label="Participant name" placeholder="Participant name" className={field} required maxLength={80} value={name} onChange={e=>setName(e.target.value)} />
     <input aria-label="Participant email" placeholder="Participant email" className={field} type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
     <button className={field} disabled={busy||!!pending||!controls.ends_at}>Issue access keys</button>
    </form>
    {keys&&<div className="space-y-2 rounded-lg bg-zinc-900 p-4 text-sm">
     <p>Expires: {new Date(keys.expires_at).toLocaleString()}</p>
     <label className="block">Regular browser key<input readOnly className={`${field} mt-1 w-full font-mono`} value={keys.login_key}/></label>
     <label className="block">Safe Exam Browser key<input readOnly className={`${field} mt-1 w-full font-mono`} value={keys.exam_browser_key}/></label>
     <p>Each key is individual and single use. Lost or consumed keys require a replacement.</p>
     <button className={field} onClick={()=>setKeys(null)}>Hide keys</button>
    </div>}
   </section>
   <section className="overflow-x-auto rounded-xl border border-white/15 p-5"><h2 className="font-semibold">Live participants</h2>
    <p className="my-3 text-xs text-zinc-400">Snapshot: {new Date(controls.server_time).toLocaleString()}. Blocking revokes future service access; it does not prove a process stopped on the device.</p>
    <table className="w-full text-left text-sm"><thead><tr><th className="p-2">Participant</th><th className="p-2">Access</th><th className="p-2">Session</th><th className="p-2">Submissions</th><th className="p-2">Camera metadata</th><th className="p-2">Actions</th></tr></thead>
     <tbody>{controls.participants.map(person=><tr key={person.user_id} className="border-t border-white/10"><td className="p-2">{person.display_name}<span className="block text-xs text-zinc-400">{person.membership_kind}</span></td>
      <td className="p-2">{person.blocked?"Blocked":person.registration_status}</td><td className="p-2">{person.session_state||"Not admitted"}<span className="block text-xs text-zinc-400">{person.last_heartbeat_at?new Date(person.last_heartbeat_at).toLocaleTimeString():"No heartbeat"}</span></td>
      <td className="p-2">{person.submission_count}</td><td className="p-2">{person.camera_event_count||0} indicator events<span className="block text-xs text-zinc-400">{person.latest_camera_event||"No metadata"}</span></td><td className="space-x-2 p-2"><button disabled={busy||!!pending} className={field}
       onClick={()=>void command({action:person.blocked?"unblock":"block",user_id:person.user_id})}>{person.blocked?"Unblock access":"Block access"}</button>
       {person.membership_kind==="temporary"&&<button disabled={busy||!!pending} className={field} onClick={()=>void temporaryAccess(person.user_id)}>Reissue keys</button>}</td></tr>)}</tbody>
    </table>{!controls.participants.length&&<p className="mt-4 text-sm text-zinc-400">No registered participants.</p>}
   </section>
  </>}
 </main>;
}
