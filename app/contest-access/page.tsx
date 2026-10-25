"use client";
import { useState } from "react";
import Link from "next/link";

export default function TemporaryContestAccess() {
 const [key,setKey]=useState("");const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
 return <main className="mx-auto max-w-lg px-6 py-24 text-zinc-100">
  <h1 className="text-2xl font-bold">Temporary contest access</h1>
  <p className="mt-3 text-sm text-zinc-400">Enter your individual access key. Use the separate exam-browser key when signing in inside Safe Exam Browser. Each key can be used once.</p>
  <form className="mt-6 space-y-4" onSubmit={async event=>{
   event.preventDefault();setBusy(true);setMessage("");
   try {
    const response=await fetch("/api/contest-access",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key}),cache:"no-store"});
    const value=await response.json();setKey("");
    if(!response.ok){setMessage(value.code==="INVALID_EXPIRED_OR_USED_KEY"?"This key is invalid, expired, or already used. Ask the organizer for a replacement.":"Sign-in could not finish. Contact the organizer before retrying a used key.");return;}
    const url=new URL(value.sign_in_url);if(url.protocol!=="https:")throw new Error();window.location.assign(url.toString());
   } catch {setMessage("Sign-in could not be confirmed. Contact the organizer for access recovery.");}
   finally {setBusy(false);}
  }}>
   <label className="block text-sm">Access key<input type="password" autoComplete="off" spellCheck={false} required value={key} onChange={e=>setKey(e.target.value)}
    className="mt-2 block w-full rounded-lg border border-white/20 bg-zinc-950 px-3 py-3" /></label>
   <button disabled={busy||!key.trim()} className="rounded-lg bg-red-700 px-5 py-3 disabled:opacity-50">{busy?"Signing in…":"Sign in to contest"}</button>
   <p role="status" className="text-sm text-amber-200">{message}</p>
  </form>
  <Link href="/contests" className="mt-6 inline-block text-sm underline">Back to contests</Link>
 </main>;
}
