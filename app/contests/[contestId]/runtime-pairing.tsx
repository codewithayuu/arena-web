"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { watchContestHeartbeat } from "@/lib/contest-heartbeat";
import {
  clearConfirmedSubmission, findConfirmedSubmission, persistSubmissionAttempt,
  readSubmissionRecovery, type PendingContestSubmission,
} from "@/lib/contest-submission-recovery";
import { MonacoCodeEditor } from "@/components/practice/monaco-code-editor";
import { ContestStatement, resolveDeclaredContestAssetPath } from "@/components/contest/contest-statement";
import { ContestProblemStandings } from "./contest-standings";
import {
  clearContestAdmissionHandoff,
  loadContestAdmissionHandoff,
  storeContestAdmissionHandoff,
  type ContestHandoffStorage,
} from "@/lib/contest-admission-handoff";
import {
  boundContestDrafts,
  isBoundedContestSource,
  isContestDraftReady,
  readContestDrafts,
  writeContestDrafts,
  type ContestDraftStorage,
} from "@/lib/contest-drafts";
import {
  completeRuntimePairingWithRunningLauncher,
  getLocalPreflightEvidence,
  confirmLocalContestCompletion,
  cancelLocalExecution,
  getLauncherPairingBinding,
  getContestAdmission,
  getRuntimeStatus,
  localExecutionMatchesSample,
  isContestSampleFallbackEligible,
  prepareRuntimePairingChallenge,
  runLocalInput,
  getLocalContestProblems,
  recoverLocalCacheCleanup,
  getLocalContestAsset,
  RuntimeBridgeError,
  type AdmissionHandoff,
  type ContestAdmission,
  type RuntimePairingChallenge,
  type RuntimeSession,
  type RuntimeStatus,
} from "@/lib/runtime-bridge";
import { consumeContestPreflight, ContestPreflightError, issueContestPreflightChallenge, type ContestPreflightChallenge } from "@/lib/contest-preflight";
import {
  ContestSubmissionError,
  getContestSubmissionStatus,
  getContestSubmissionHistory,
  heartbeatContestAdmission,
  completeContestAdmission,
  newContestIdempotencyKey,
  recoverContestPairingAdmission,
  requireMatchingPairingAdmission,
  runContestPublicSamplesOnServer,
  submitContestSource,
  type ContestSampleRunResult,
  type ContestSubmissionHistoryItem,
  type ContestSubmissionHistoryCursor,
  type ContestSubmissionStatus,
  type ParticipantContestProblem,
} from "@/lib/contest-submissions";

type PairingState = "checking" | "disconnected" | "pairing" | "waiting" | "launch_ready" | "preflight" | "admitted" | "completed" | "recovery_exit" | "blocked" | "error";
type ExamPolicy = {
  revision: number;
  digest: string;
  policyEnvelope: {
    policy: Record<string, unknown>;
    sha256: string;
    signature: string;
    key_id: string;
    algorithm: string;
  };
  requiresLockdown: boolean;
  requiredCapture: string[];
  languages: string[];
};

export function ContestRuntimePairing({ contestId, policy, launchRequestId }: {
  contestId: string;
  policy: ExamPolicy;
  launchRequestId: string | null;
}) {
  const { isLoaded, isSignedIn, getToken, userId } = useAuth();
  const [state, setState] = useState<PairingState>("checking");
  const preparedPreflight = useRef<{ challenge: ContestPreflightChallenge; appVersion: string; evidence?: Record<string, unknown> } | null>(null);
  const [runtime, setRuntime] = useState<RuntimeStatus | null>(null);
  const [session, setSession] = useState<RuntimeSession | null>(null);
  const [pendingLauncherChallenge, setPendingLauncherChallenge] = useState<RuntimePairingChallenge | null>(null);
  const [admission, setAdmission] = useState<ContestAdmission | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [completionPending, setCompletionPending] = useState(false);
  const [exitReason, setExitReason] = useState<"completed" | "recovery" | null>(null);
  const [launchIntentExpired, setLaunchIntentExpired] = useState(false);
  const [cleanupConfirmed, setCleanupConfirmed] = useState<boolean | null>(null);
  const [exitNavigating, setExitNavigating] = useState(false);
  const [leaseState, setLeaseState] = useState<"healthy" | "retrying" | "blocked">("healthy");
  const [pairingRecoveryPending, setPairingRecoveryPending] = useState(false);
  const [pairingRecoveryRequired, setPairingRecoveryRequired] = useState(false);
  const [admittedClerkUserId, setAdmittedClerkUserId] = useState<string | null>(null);
  const [problems, setProblems] = useState<ParticipantContestProblem[]>([]);
  const [message, setMessage] = useState("Checking the local Mindflare runtime…");
  const currentClerkUserId = useRef<string | null>(userId ?? null);

  useEffect(() => {
    currentClerkUserId.current = userId ?? null;
  }, [userId]);

  useEffect(() => () => { currentClerkUserId.current = null; }, []);

  useEffect(() => {
    if (!isLoaded || !admittedClerkUserId || userId === admittedClerkUserId) return;
    setAdmission(null);
    setSession(null);
    setProblems([]);
    setAdmittedClerkUserId(null);
    setPairingRecoveryRequired(true);
    setLeaseState("blocked");
    setState("error");
    clearPendingHandoff(contestId);
    setMessage("The signed-in account changed after pairing. Contest access is paused; sign in with the account that started pairing, or restart pairing from this contest page.");
  }, [admittedClerkUserId, contestId, isLoaded, userId]);

  useEffect(() => {
    let active = true;
    void getRuntimeStatus().then((status) => {
      if (!active) return;
      setRuntime(status);
      setState("disconnected");
      setMessage(status
        ? "Mindflare runtime is ready. Connect it to this signed-in exam session when you are ready."
        : "Mindflare runtime is not running. Use the contest launch link first so the launcher can start and verify it before SEB opens.");
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!admission || completedAt || completionPending || leaseState === "blocked") return;
    return watchContestHeartbeat({
      renew: async () => {
        const accessToken = await getToken({ skipCache: true });
        if (!accessToken) throw new Error("AUTH_SESSION_UNAVAILABLE");
        return heartbeatContestAdmission({ contestId, accessToken, admission });
      },
      onRenewed: (renewed) => {
        setLeaseState("healthy");
        setAdmission((current) => current ? { ...current, expires_at: renewed.expires_at } : null);
        setMessage("The server confirmed the current admission lease. Contest controls are available.");
      },
      onUnavailable: () => {
        setLeaseState("retrying");
        setMessage("Connection interrupted. Your draft and pending submission receipt are preserved. Run and Submit are paused while the same server lease is rechecked; no new admission is created.");
      },
      onRejected: () => {
        const rejectedSession = session;
        setLeaseState("blocked");
        setPairingRecoveryPending(true);
        setPairingRecoveryRequired(true);
        setState("error");
        setPendingLauncherChallenge(null);
        setAdmission(null);
        setProblems([]);
        clearPendingHandoff(contestId);
        setMessage("The server rejected this admission lease. Local access is blocked while the launcher rechecks it; drafts and pending receipts are preserved.");
        // The browser cannot order revocation/cleanup. Ask the launcher to
        // independently revalidate its current grant; only its definitive
        // gateway result may invalidate keys and queue cleanup audits.
        void (async () => {
          if (rejectedSession) {
            try { await getLocalContestProblems(rejectedSession, contestId); }
            catch { /* Transient local/gateway errors keep cache inaccessible and retryable. */ }
          }
          setAdmission(null);
          setSession(null);
          setAdmittedClerkUserId(null);
          setProblems([]);
          setPairingRecoveryPending(false);
          setMessage("The previous admission is no longer valid. Start a fresh pairing from this Clerk-signed-in page; drafts and pending submission receipts remain preserved.");
        })();
      },
      onCompleted: () => {
        // Only the distinct authenticated gateway response is terminal. Do
        // not infer completion from local time, a timeout, or a generic 410.
        setLeaseState("blocked");
        setCompletionPending(true);
        setAdmission(null);
        setSession(null);
        setAdmittedClerkUserId(null);
        setProblems([]);
        setState("completed");
        setMessage("The server confirmed contest completion. Closing local access and cleaning up…");
        setExitReason("completed");
        setCleanupConfirmed(null);
        clearPendingHandoff(contestId);
        void (async () => {
          let launcherConfirmed = false;
          if (session) {
            try {
              await confirmLocalContestCompletion(session, contestId);
              launcherConfirmed = true;
            } catch { /* Supervised exit/startup recovery still owns local cleanup. */ }
          }
          setCompletionPending(false);
          setCleanupConfirmed(launcherConfirmed);
          setSession(null);
          setAdmission(null);
          setAdmittedClerkUserId(null);
          setProblems([]);
          setMessage(launcherConfirmed
            ? "The server confirmed completion and the launcher confirmed terminal cache cleanup."
            : "The server confirmed completion. The launcher did not confirm cleanup in this request; its supervised exit or startup recovery remains responsible, and cleanup is not reported as successful.");
        })();
      },
    });
  }, [admission, completedAt, completionPending, contestId, getToken, leaseState, session]);

  useEffect(() => {
    if (!session || !admission || state !== "admitted" || completedAt || completionPending || exitNavigating) return;
    let active = true;
    let navigating = false;
    const checkLauncherShutdown = async () => {
      const status = await getRuntimeStatus();
      if (!active || navigating || status?.shutdown_requested !== true) return;
      navigating = true;
      setExitReason("recovery");
      setAdmission(null);
      setSession(null);
      setProblems([]);
      setExitNavigating(true);
      setMessage("The launcher requested shutdown. Contest access is disabled; returning through SEB’s configured exit URL.");
      window.location.assign(`/contests/${encodeURIComponent(contestId)}/seb-exit`);
    };
    const timer = window.setInterval(() => { void checkLauncherShutdown(); }, 500);
    void checkLauncherShutdown();
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [admission, completedAt, completionPending, contestId, exitNavigating, session, state]);

  async function recoverCleanupAfterPairing(paired: RuntimeSession) {
    try {
      await recoverLocalCacheCleanup(paired);
    } catch {
      // Cleanup is local-first and the launcher keeps encrypted retries. An
      // unavailable recovery call must never block an otherwise valid contest.
    }
  }

  async function verifyCurrentBrowserPairing(
    challenge: RuntimePairingChallenge,
    paired: RuntimeSession,
  ): Promise<ContestAdmission> {
    const expectedUserId = userId;
    if (!expectedUserId) {
      throw new RuntimeBridgeError("AUTH_SESSION_UNAVAILABLE", "Sign in again before recovering contest admission.");
    }
    const authenticatedLease = await (async () => {
      while (Date.parse(paired.expiresAt) > Date.now()) {
        if (currentClerkUserId.current !== expectedUserId) {
          throw new RuntimeBridgeError("PAIRING_ACCOUNT_MISMATCH", "The account changed; restart browser pairing.");
        }
        const accessToken = await getToken({ skipCache: true });
        if (!accessToken) throw new RuntimeBridgeError("AUTH_SESSION_UNAVAILABLE", "Sign in again before admission.");
        try {
          return await recoverContestPairingAdmission({
            requestId: challenge.requestId, contestId: challenge.contestId ?? "",
            accessToken, policyRevision: policy.revision, policyDigest: policy.digest,
          });
        } catch (error) {
          if (!(error instanceof ContestSubmissionError)
              || !["CONTEST_NOT_STARTED", "CONTEST_READINESS_PENDING"].includes(error.code)) throw error;
          setState("waiting");
          setMessage(error.code === "CONTEST_NOT_STARTED"
            ? "Launcher pairing and preflight are prepared. Waiting for the server to open admission at contest start."
            : "Preparation is retained. Waiting for the administrator's contest readiness checks; no admission was granted.");
          await new Promise((resolve) => window.setTimeout(resolve, 5000));
        }
      }
      throw new RuntimeBridgeError("PAIRING_EXPIRED", "Preparation expired. Start a fresh browser pairing.");
    })();
    if (currentClerkUserId.current !== expectedUserId) {
      throw new RuntimeBridgeError("PAIRING_ACCOUNT_MISMATCH", "The signed-in account changed during pairing. Restart pairing from this contest page.");
    }
    const localLease = await getContestAdmission(paired);
    if (currentClerkUserId.current !== expectedUserId) {
      throw new RuntimeBridgeError("PAIRING_ACCOUNT_MISMATCH", "The signed-in account changed during pairing. Restart pairing from this contest page.");
    }
    return requireMatchingPairingAdmission(challenge.contestId ?? "", localLease, authenticatedLease);
  }

  async function finishPairing(
    challenge: RuntimePairingChallenge,
    paired: RuntimeSession,
    successMessage: string,
  ) {
    const expectedUserId = userId;
    const prepared = preparedPreflight.current;
    if (prepared) {
      const token = await getToken({ skipCache: true });
      if (!token || !expectedUserId || currentClerkUserId.current !== expectedUserId) {
        throw new RuntimeBridgeError("PAIRING_ACCOUNT_MISMATCH", "Sign in with the account that started this launcher.");
      }
      const evidence = prepared.evidence ?? await getLocalPreflightEvidence(paired, prepared.challenge);
      prepared.evidence = evidence;
      await consumeContestPreflight({ contestId, accessToken: token, challenge: prepared.challenge,
        appVersion: prepared.appVersion, os: "windows", evidence });
      preparedPreflight.current = null;
    }
    const lease = await verifyCurrentBrowserPairing(challenge, paired);
    if (!expectedUserId || currentClerkUserId.current !== expectedUserId) {
      throw new RuntimeBridgeError("PAIRING_ACCOUNT_MISMATCH", "The signed-in account changed during pairing. Restart pairing from this contest page.");
    }

    // Pairing and admission are already server confirmed. Retain their
    // memory-only credentials while public content loads so a transient
    // launcher outage retries content instead of consuming the one-use ticket.
    setPendingLauncherChallenge(null);
    setSession(paired);
    setAdmission(lease);
    setAdmittedClerkUserId(expectedUserId);
    setLeaseState("healthy");
    setPairingRecoveryRequired(false);

    await recoverCleanupAfterPairing(paired);
    const publicProblems = await getLocalContestProblems(paired, contestId);
    if (currentClerkUserId.current !== expectedUserId) {
      throw new RuntimeBridgeError("PAIRING_ACCOUNT_MISMATCH", "The signed-in account changed during pairing. Restart pairing from this contest page.");
    }
    setProblems(publicProblems);
    setRuntime(await getRuntimeStatus());
    setState("admitted");
    setMessage(successMessage);
  }

  function clearPairingForBrowserRecovery() {
    preparedPreflight.current = null;
    setAdmission(null);
    setSession(null);
    setAdmittedClerkUserId(null);
    setPendingLauncherChallenge(null);
    setProblems([]);
    setPairingRecoveryPending(false);
    setPairingRecoveryRequired(true);
    setLeaseState("blocked");
    clearPendingHandoff(contestId);
  }

  function handleExpiredLaunchIntent(error: unknown): boolean {
    if (!(error instanceof RuntimeBridgeError && error.code === "LAUNCH_INTENT_EXPIRED")) return false;
    clearPairingForBrowserRecovery();
    setLaunchIntentExpired(true);
    setExitReason("recovery");
    setState("recovery_exit");
    setMessage("This one-use launcher authorization expired before pairing. Exit SEB, return to the normal browser, and start a fresh launcher handoff from contest details. No admission was granted.");
    return true;
  }

  async function connect() {
    if (!isLoaded || !isSignedIn || state === "pairing" || state === "waiting" || state === "preflight" || state === "admitted") return;
    if (!launchRequestId) {
      setState("blocked");
      setMessage("Open this contest through the registered Mindflare Launcher link in official SEB. The gateway needs the redeemed launch reference to verify that the SEB Clerk account matches the account that started the launcher.");
      return;
    }
    if (pendingLauncherChallenge && Date.parse(pendingLauncherChallenge.expiresAt) > Date.now()) {
      const launcherChallenge = pendingLauncherChallenge;
      setState("pairing");
      setMessage("Completing the one-time pairing with the already running Mindflare runtime…");
      try {
        // The contest launch intent started the runtime before opening SEB.
        // Pair in place; dispatching a second OS URL from inside SEB is unnecessary.
        const paired = await completeRuntimePairingWithRunningLauncher(launcherChallenge);
        await finishPairing(launcherChallenge, paired,
          "The gateway confirmed this pairing belongs to the currently signed-in Clerk account. Public problem data is loaded, and the website renews the lease while this page remains open.");
      } catch (error) {
        if (handleExpiredLaunchIntent(error)) return;
        if (pairingNeedsBrowserRecovery(error)) clearPairingForBrowserRecovery();
        setState("error");
        setMessage(safeMessage(error));
      }
      return;
    }
    if (pendingLauncherChallenge) setPendingLauncherChallenge(null);
    setState("pairing");
    setMessage("Checking runtime readiness and contest admission…");
    try {
      if (session && admission) {
        if (!userId || userId !== admittedClerkUserId) {
          throw new RuntimeBridgeError("PAIRING_ACCOUNT_MISMATCH", "The signed-in account no longer matches the account that paired this launcher. Restart pairing from this contest page.");
        }
        await recoverCleanupAfterPairing(session);
        setProblems(await getLocalContestProblems(session, contestId));
        setLeaseState("healthy");
        setPairingRecoveryRequired(false);
        setState("admitted");
        setMessage("The server admission lease is active. Public problem data is loaded; contest submissions go directly to the server judge.");
        return;
      }
      const pending = loadPendingHandoff(contestId, policy);
      if (pending) {
        const binding = await getLauncherPairingBinding();
        if (pending.device_id === binding.device_id) {
          const launcherChallenge = await prepareRuntimePairingChallenge("contest", contestId, pending, binding, launchRequestId);
          setPendingLauncherChallenge(launcherChallenge);
          setState("launch_ready");
          setMessage("Pairing is prepared. Click Connect Mindflare runtime to complete the one-time server challenge.");
          return;
        }
        clearPendingHandoff(contestId);
      }

      const status = await getRuntimeStatus();
      setRuntime(status);
      if (!status || !isSemver(status.version)) {
        setState("blocked");
        setMessage("The Mindflare runtime is not ready. Return to the contest launch page and use its launcher link first; preflight will not start before runtime readiness.");
        return;
      }
      if (policy.requiredCapture.length > 0) {
        setState("blocked");
        setMessage(`This build has no capture adapter for the required ${policy.requiredCapture.join(", ")} capability. No consent, preflight report, or admission lease was fabricated.`);
        return;
      }
      const os = detectOperatingSystem();
      if (!os) {
        setState("blocked");
        setMessage("Contests currently require the Windows Mindflare launcher. Preflight and admission were not requested.");
        return;
      }

      setState("preflight");
      setMessage("Checking the active contest policy and recording server-authoritative preflight…");
      const accessToken = await getToken({ skipCache: true });
      if (!accessToken) throw new Error("AUTH_SESSION_UNAVAILABLE");
      const challenge = await issueContestPreflightChallenge({
        contestId,
        accessToken,
        policyRevision: policy.revision,
        policyDigest: policy.digest,
      });
      preparedPreflight.current = { challenge, appVersion: status.version };

      const binding = await getLauncherPairingBinding();
      const handoff: AdmissionHandoff = {
        challenge_id: challenge.challenge_id,
        policy_revision: challenge.policy_revision,
        policy_digest: challenge.policy_digest,
        device_id: binding.device_id,
        idempotency_key: crypto.randomUUID(),
      };
      storePendingHandoff(contestId, handoff);
      const launcherChallenge = await prepareRuntimePairingChallenge("contest", contestId, handoff, binding, launchRequestId);
      setPendingLauncherChallenge(launcherChallenge);
      setMessage("Pairing the running launcher and verifying its policy-bound preflight observations…");
      const paired = await completeRuntimePairingWithRunningLauncher(launcherChallenge);
      await finishPairing(launcherChallenge, paired, "Server admission is active. Verified public content is available through the paired launcher.");
    } catch (error) {
      if (handleExpiredLaunchIntent(error)) return;
      if (pairingNeedsBrowserRecovery(error)) clearPairingForBrowserRecovery();
      setState("error");
      setMessage(safeMessage(error));
    }
  }

  async function openLauncherFallback() {
    const challenge = pendingLauncherChallenge;
    if (!challenge || !isLoaded || !isSignedIn || Date.parse(challenge.expiresAt) <= Date.now()) return;
    // Keep this navigation directly inside the user's click so browsers can
    // show the registered-app prompt. The app completes the same nonce flow;
    // this page only recovers the resulting lease from the authenticated API.
    window.location.assign(challenge.launchUri);
    setState("pairing");
    setMessage("Waiting for the launcher to complete the pairing. This page will recover the server lease when it is ready…");
    try {
      const paired = await completeRuntimePairingWithRunningLauncher(challenge);
      await finishPairing(challenge, paired,
        "The launcher verified and delivered the active public contest package over its paired local runtime. The browser never received a download grant or package URL.");
    } catch (error) {
      if (handleExpiredLaunchIntent(error)) return;
      if (pairingNeedsBrowserRecovery(error)) clearPairingForBrowserRecovery();
      setState("error");
      setMessage(safeMessage(error));
    }
  }

  const canRetry = state !== "waiting" && state !== "admitted" && state !== "completed" && state !== "recovery_exit" && state !== "pairing" && state !== "preflight";
  function exitToSeb() {
    if (exitNavigating || !exitReason) return;
    setExitNavigating(true);
    window.location.assign(`/contests/${encodeURIComponent(contestId)}/seb-exit`);
  }
  return (
    <section id="runtime-pairing" aria-labelledby="runtime-pairing-heading" className="mt-6 scroll-mt-6 rounded-lg border border-white/10 bg-black/20 p-5">
      <h3 id="runtime-pairing-heading" className="font-semibold">Mindflare runtime and exam readiness</h3>
      <p className="mt-2 text-sm text-zinc-300" role="status" aria-live="polite">{message}</p>
      {runtime && <p className="mt-2 text-xs text-zinc-500">Runtime {runtime.version} · protocol {runtime.protocol_version}</p>}
      {admission && <p className={`mt-2 text-xs ${leaseState === "healthy" ? "text-emerald-300" : "text-amber-300"}`}>Last server lease expiry {new Date(admission.expires_at).toLocaleTimeString()} · {leaseState === "healthy" ? "checked every 20 seconds" : leaseState === "retrying" ? "rechecking connection; execution paused" : "server recovery required"}</p>}
      {completedAt && <p className="mt-3 text-sm text-emerald-300">The server confirmed this contest session ended at {new Date(completedAt).toLocaleTimeString()}.</p>}
      {state === "admitted" && admission && (
        <>
          <a href="#contest-workspace" className="mt-4 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
            Admission confirmed — continue to contest workspace
          </a>
          <ContestWorkspace contestId={contestId} languages={policy.languages} policyEnvelope={policy.policyEnvelope} session={session} admission={admission} problems={problems}
          accessPaused={leaseState !== "healthy"}
          onCompletionPending={setCompletionPending}
          onRecoveryExit={() => {
            setExitReason("recovery");
            setCleanupConfirmed(null);
            setState("recovery_exit");
            setMessage("Recovery exit requested. This does not mark the contest complete; the launcher supervisor owns cleanup during SEB exit.");
          }}
          onCompleted={(timestamp, launcherConfirmed) => {
            setCompletedAt(timestamp);
            setCompletionPending(false);
            setExitReason("completed");
            setCleanupConfirmed(launcherConfirmed);
            setAdmission(null);
            setSession(null);
            setAdmittedClerkUserId(null);
            clearPendingHandoff(contestId);
            setState("completed");
            setMessage(launcherConfirmed
              ? "The server confirmed completion, and the launcher confirmed terminal cache cleanup."
              : "The server confirmed completion. The launcher did not confirm cleanup in this request; its supervised exit or startup recovery remains responsible, and cleanup is not reported as successful.");
          }} />
        </>
      )}
      {state === "completed" && exitReason === "completed" && (
        <section className="mt-5 rounded-lg border border-emerald-300/25 bg-emerald-300/5 p-4" aria-labelledby="contest-completed-heading">
          <h4 id="contest-completed-heading" className="text-lg font-semibold text-emerald-200">Contest session completed</h4>
          <p className="mt-2 text-sm text-zinc-200">Completion was confirmed by the contest server. Local Run and contest access are disabled. Official verdicts and standings remain server-owned.</p>
          <p className="mt-2 text-sm text-zinc-300" role="status" aria-live="polite">
            {completionPending ? "The launcher is revoking local content access and cleaning the encrypted cache…"
              : cleanupConfirmed === true ? "Launcher cleanup was confirmed. The cleanup audit is queued independently of this page."
                : "Launcher cleanup was not confirmed here. The cache remains inaccessible; supervised exit or startup recovery will retry. Cleanup is not reported as successful."}
          </p>
          <button type="button" onClick={exitToSeb} disabled={exitNavigating || completionPending}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {exitNavigating ? "Opening SEB exit…" : "Exit Secure Exam Browser and return to launcher"}
          </button>
        </section>
      )}
      {state === "recovery_exit" && exitReason === "recovery" && (
        <section className="mt-5 rounded-lg border border-amber-300/25 bg-amber-300/5 p-4" aria-labelledby="contest-recovery-exit-heading">
          <h4 id="contest-recovery-exit-heading" className="text-lg font-semibold text-amber-200">{launchIntentExpired ? "Launcher authorization expired" : "Exit for recovery"}</h4>
          <p className="mt-2 text-sm text-zinc-200">{launchIntentExpired
            ? "This is not contest completion and no admission was granted. Exit orderly to the normal browser, then request a fresh one-use launcher authorization from contest details."
            : "This is not contest completion and does not create an official verdict. The launcher will disable the session, clean its cache and queue the metadata-only audit as SEB exits. Unconfirmed submissions remain recoverable from server history."}</p>
          <button type="button" onClick={exitToSeb} disabled={exitNavigating}
            className="mt-4 rounded-lg border border-amber-200/30 px-4 py-2 text-sm font-semibold text-amber-100 disabled:opacity-50">
            {exitNavigating ? "Opening SEB recovery exit…" : launchIntentExpired ? "Exit SEB to request a fresh launch" : "Exit Secure Exam Browser for recovery"}
          </button>
        </section>
      )}
      {canRetry && (
        <button
          type="button"
          onClick={() => void connect()}
          disabled={!isLoaded || !isSignedIn || !launchRequestId || pairingRecoveryPending}
          className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pendingLauncherChallenge ? "Connect Mindflare runtime" : pairingRecoveryRequired ? "Start new browser pairing" : state === "error" || state === "blocked" ? "Retry readiness check" : "Check runtime and exam readiness"}
        </button>
      )}
      {pendingLauncherChallenge && state === "error" && Date.parse(pendingLauncherChallenge.expiresAt) > Date.now() && (
        <button type="button" onClick={() => void openLauncherFallback()} disabled={!isLoaded || !isSignedIn}
          className="mt-3 ml-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          Open launcher to finish pairing
        </button>
      )}
      <p className="mt-3 text-xs leading-5 text-amber-300">
        Client capability reports are indicators, not remote attestation. Pairing or a preflight receipt alone never grants access; only the server admission lease authorizes contest APIs.
      </p>
    </section>
  );
}

function detectOperatingSystem(): "windows" | null {
  const platform = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
  if (platform.includes("windows")) return "windows";
  return null;
}

function pairingNeedsBrowserRecovery(error: unknown): boolean {
  return (error instanceof RuntimeBridgeError &&
    (error.code === "PAIRING_EXPIRED" || error.code === "PAIRING_ACCOUNT_MISMATCH")) ||
    (error instanceof ContestSubmissionError && error.code === "PAIRING_ACCOUNT_MISMATCH");
}

function storePendingHandoff(contestId: string, handoff: AdmissionHandoff) {
  storeContestAdmissionHandoff(browserSessionStorage(), contestId, handoff);
}
function clearPendingHandoff(contestId: string) {
  clearContestAdmissionHandoff(browserSessionStorage(), contestId);
}
function loadPendingHandoff(contestId: string, policy: ExamPolicy): AdmissionHandoff | null {
  return loadContestAdmissionHandoff(browserSessionStorage(), contestId, {
    revision: policy.revision,
    digest: policy.digest,
  });
}

function browserSessionStorage(): ContestHandoffStorage | null {
  try { return window.sessionStorage; } catch { return null; }
}

function isSemver(value: string): boolean {
  return /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/.test(value);
}

function safeMessage(error: unknown): string {
  const code = error instanceof RuntimeBridgeError || error instanceof ContestPreflightError
    ? error.code
    : error instanceof Error && "code" in error
      ? String((error as Error & { code?: unknown }).code ?? "")
      : error instanceof Error && /^[A-Z0-9_]{1,80}$/.test(error.message)
        ? error.message
        : "";
  const known: Record<string, string> = {
    AUTH_SESSION_UNAVAILABLE: "Your sign-in session is unavailable. Sign in again and retry.",
    CONTEST_AUTHORITY_UNAVAILABLE: "Contest authority is temporarily unavailable. Retry from this exam page.",
    PREFLIGHT_REJECTED: "Contest authority rejected preflight. Retry or contact the organizer.",
    INVALID_PREFLIGHT: "Preflight data did not match the current contest policy. Reload the contest page and retry.",
    INVALID_AUTHORITY_RESPONSE: "Contest authority returned an invalid response. No admission was granted.",
    PAIRING_EXPIRED: "This launcher handoff is expired or belongs to a different signed-in account. Sign in with the account that started pairing, or restart pairing from this contest page.",
    LAUNCH_INTENT_EXPIRED: "This one-use launcher authorization expired. Exit SEB and start a fresh launcher handoff from the contest page.",
    PAIRING_ACCOUNT_MISMATCH: "This launcher handoff belongs to a different signed-in account. Sign in with the account that started pairing, or restart pairing from this contest page.",
    RUNTIME_PAIRING_UNAVAILABLE: "The launcher could not complete pairing. Confirm it is available and retry.",
    RUNTIME_UNAVAILABLE: "The local runtime could not be reached. Retry through the contest launcher link.",
  };
  return known[code] ?? "Contest preflight or launcher pairing failed. No admission was granted; retry or contact the organizer.";
}

type ContestLanguage = "cpp17" | "cpp20" | "java" | "python" | "javascript";
const CONTEST_LANGUAGES = new Set<ContestLanguage>(["cpp17", "cpp20", "java", "python", "javascript"]);

type WorkspaceRunResult = Omit<ContestSampleRunResult, "sample_matches"> & {
  sample_matches: boolean | null;
  peak_memory_bytes?: number;
  origin: "local" | "server";
  inputKind: "sample" | "custom";
};

function isContestLanguage(value: string): value is ContestLanguage {
  return CONTEST_LANGUAGES.has(value as ContestLanguage);
}

function ContestWorkspace({
  contestId,
  languages,
  policyEnvelope,
  session,
  admission,
  problems,
  accessPaused,
  onCompletionPending,
  onRecoveryExit,
  onCompleted,
}: {
  contestId: string;
  languages: string[];
  policyEnvelope: ExamPolicy["policyEnvelope"];
  session: RuntimeSession | null;
  admission: ContestAdmission;
  problems: ParticipantContestProblem[];
  accessPaused: boolean;
  onCompletionPending: (pending: boolean) => void;
  onRecoveryExit: () => void;
  onCompleted: (completedAt: string, launcherConfirmed: boolean) => void;
}) {
  const { getToken, userId } = useAuth();
  const allowedLanguages = useMemo(() => languages.filter(isContestLanguage), [languages]);
  const [selectedProblemId, setSelectedProblemId] = useState(problems[0]?.problem_id ?? "");
  const [language, setLanguage] = useState<ContestLanguage>(allowedLanguages[0] ?? "cpp17");
  const [source, setSource] = useState("");
  const [runResults, setRunResults] = useState<WorkspaceRunResult[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [runKind, setRunKind] = useState<"sample" | "custom">("sample");
  const customInputTooLarge = new TextEncoder().encode(customInput).byteLength > 64 * 1024;
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [pendingSubmission, setPendingSubmission] = useState<PendingContestSubmission | null>(null);
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null);
  const [submissionHistory, setSubmissionHistory] = useState<ContestSubmissionHistoryItem[]>([]);
  const [historyCursor, setHistoryCursor] = useState<ContestSubmissionHistoryCursor | null>(null);
  const [historyHasMore, setHistoryHasMore] = useState(false);
  const [historyLoadingMore, setHistoryLoadingMore] = useState(false);
  const [historyPageError, setHistoryPageError] = useState(false);
  const [historyStatuses, setHistoryStatuses] = useState<Record<string, ContestSubmissionStatus>>({});
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyUnavailable, setHistoryUnavailable] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(null);
  const accessPausedRef = useRef(accessPaused);
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const storageKey = useMemo(() => userId
    ? `mindflare:contest-drafts:v1:${encodeURIComponent(userId)}:${contestId}`
    : null, [contestId, userId]);
  const recoveryKey = storageKey ? `${storageKey}:pending-submission:v1` : null;
  const recoveryKeyRef = useRef(recoveryKey);
  recoveryKeyRef.current = recoveryKey;
  const [loadedRecoveryKey, setLoadedRecoveryKey] = useState<string | null>(null);
  const [recoveryBlocked, setRecoveryBlocked] = useState(false);
  const recoveryReady = recoveryKey !== null && loadedRecoveryKey === recoveryKey && !recoveryBlocked;
  const draftKey = `${selectedProblemId}:${language}`;
  const [draftStore, setDraftStore] = useState<{ key: string | null; values: Record<string, string> }>({ key: null, values: {} });
  const [activeDraftKey, setActiveDraftKey] = useState("");
  const [draftSaved, setDraftSaved] = useState<boolean | null>(null);
  const draftStoreReady = storageKey !== null && draftStore.key === storageKey;
  const selectedDraftReady = isContestDraftReady(draftStore.key, storageKey, activeDraftKey, draftKey);
  const selected = problems.find((problem) => problem.problem_id === selectedProblemId) ?? problems[0] ?? null;

  useEffect(() => {
    setLoadedRecoveryKey(null);
    setPendingSubmission(null);
    setLastSubmissionId(null);
    setSubmissionHistory([]);
    setHistoryStatuses({});
    if (!recoveryKey) return;
    const recovery = readSubmissionRecovery(browserContestDraftStorage(), recoveryKey);
    setPendingSubmission(recovery.pending);
    setRecoveryBlocked(recovery.state !== "ready");
    setLoadedRecoveryKey(recoveryKey);
    if (recovery.pending) setSubmissionMessage("Recovered an unconfirmed submission. Check server history or restore this attempt and retry with its original key; do not create a second submission.");
    else if (recovery.state !== "ready") setSubmissionMessage("Submission recovery storage is unavailable or invalid. Submit is paused to avoid losing an unconfirmed attempt; keep the page open and contact the organizer.");
  }, [recoveryKey]);

  useEffect(() => {
    if (!pendingSubmission || !recoveryReady || !recoveryKey) return;
    let active = true;
    void findConfirmedSubmission(pendingSubmission, submissionHistory).then((confirmed) => {
      if (!active || !confirmed) return;
      if (!clearConfirmedSubmission(browserContestDraftStorage(), recoveryKey, pendingSubmission)) {
        setSubmissionMessage(`Submission ${confirmed.submission_id} is confirmed in server history, but the local recovery record could not be cleared. Retry recovery before creating a new attempt.`);
        return;
      }
      setPendingSubmission(null);
      setLastSubmissionId(confirmed.submission_id);
      setSubmissionMessage(`Recovered server receipt ${confirmed.submission_id}. No duplicate submission was sent.`);
    }).catch(() => {
      // Hash/storage failures leave the exact attempt intact; never resend automatically.
    });
    return () => { active = false; };
  }, [pendingSubmission, recoveryKey, recoveryReady, submissionHistory]);

  useEffect(() => {
    accessPausedRef.current = accessPaused;
    if (accessPaused && activeExecutionId && session) {
      // Cancellation remains best-effort; the runner also enforces its own
      // resource deadline and independently revalidates the admission grant.
      void cancelLocalExecution(session, activeExecutionId).catch(() => undefined);
    }
  }, [accessPaused, activeExecutionId, session]);

  useEffect(() => {
    let active = true;
    const created: string[] = [];
    setAssetUrls({});
    if (!session || !selected?.assets?.length) return () => undefined;
    void Promise.all(selected.assets.map(async (asset) => {
      try {
        const blob = await getLocalContestAsset(session, contestId, asset.path);
        if (!active) return;
        const objectUrl = URL.createObjectURL(blob);
        created.push(objectUrl);
        setAssetUrls((current) => ({ ...current, [asset.path]: objectUrl }));
      } catch {
        // A missing or revoked asset is rendered as unavailable; no remote fallback is used.
      }
    }));
    return () => {
      active = false;
      for (const url of created) URL.revokeObjectURL(url);
    };
  }, [contestId, selected?.assets, selected?.problem_id, session]);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const accessToken = await getToken({ skipCache: true });
        if (!accessToken) throw new Error("AUTH_SESSION_UNAVAILABLE");
        const history = await getContestSubmissionHistory({ contestId, accessToken });
        if (active) {
          setSubmissionHistory((current) => {
            const merged = new Map(history.items.map((item) => [item.submission_id, item]));
            for (const item of current) merged.set(item.submission_id, item);
            return [...merged.values()].sort((left, right) => compareHistory(left, right)).slice(0, 50);
          });
          setHistoryCursor(history.next_cursor);
          setHistoryHasMore(history.next_cursor !== null);
          setHistoryUnavailable(false);
        }
      } catch {
        if (active) setHistoryUnavailable(true);
      } finally {
        if (active) setHistoryLoading(false);
      }
    })();
    return () => { active = false; };
  }, [contestId, getToken, historyRefresh, userId]);

  useEffect(() => {
    if (!storageKey) {
      setDraftStore({ key: null, values: {} });
      return;
    }
    const storage = browserContestDraftStorage();
    const values = readContestDrafts(storage, storageKey);
    setDraftStore({ key: storageKey, values });
    setSource(values[draftKey] ?? "");
    setActiveDraftKey(draftKey);
    setDraftSaved(storage !== null);
  // Hydrate only when the signed-in user or contest changes. Problem/language
  // changes are handled by the effect below using the already-loaded draft map.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (draftStoreReady) {
      setSource(draftStore.values[draftKey] ?? "");
      setActiveDraftKey(draftKey);
    }
  }, [draftKey, draftStore.values, draftStoreReady]);

  useEffect(() => {
    if (!storageKey || !draftStoreReady || activeDraftKey !== draftKey) return;
    if (!isBoundedContestSource(source)) {
      setDraftSaved(false);
      return;
    }
    if ((draftStore.values[draftKey] ?? "") === source) return;
    const nextValues = { ...draftStore.values };
    delete nextValues[draftKey];
    nextValues[draftKey] = source;
    const saved = writeContestDrafts(browserContestDraftStorage(), storageKey, nextValues);
    const boundedValues = boundContestDrafts(nextValues);
    setDraftSaved(saved);
    setDraftStore({ key: storageKey, values: boundedValues });
  }, [activeDraftKey, draftKey, draftStore.values, draftStoreReady, source, storageKey]);

  useEffect(() => {
    if (!selectedProblemId && problems[0]) setSelectedProblemId(problems[0].problem_id);
  }, [problems, selectedProblemId]);
  useEffect(() => {
    if (!allowedLanguages.includes(language) && allowedLanguages[0]) setLanguage(allowedLanguages[0]);
  }, [allowedLanguages, language]);

  async function runPublicSamples() {
    if (!selected || !selectedDraftReady || accessPaused || running || submitting || completing || selected.public_samples.length === 0) return;
    if (!session || !admission) {
      setSubmissionMessage("An admitted paired launcher session is required before running public samples.");
      return;
    }
    setRunning(true);
    setRunKind("sample");
    setSubmissionMessage("");
    setRunResults([]);
    try {
      const results: WorkspaceRunResult[] = [];
      try {
        for (const sample of selected.public_samples) {
          if (accessPausedRef.current) throw new RuntimeBridgeError("ADMISSION_RECHECK_REQUIRED", "Admission revalidation is pending.");
          const executionId = crypto.randomUUID();
          setActiveExecutionId(executionId);
          const result = await runLocalInput(session, source, language, sample.input, executionId, undefined, {
            problemId: selected.problem_id,
            contestPolicy: policyEnvelope,
          });
          results.push({
            stdout: result.stdout,
            stderr: result.stderr,
            exit_code: result.exit_code,
            compile_exit_code: result.compile_exit_code ?? null,
            sample_matches: localExecutionMatchesSample(result, sample.output),
            duration_ms: result.duration_ms,
            peak_memory_bytes: result.peak_memory_bytes,
            origin: "local",
            inputKind: "sample",
          });
        }
      } catch (error) {
        if (!isContestSampleFallbackEligible(error)) throw error;
        const accessToken = await getToken({ skipCache: true });
        if (!accessToken) throw new Error("AUTH_SESSION_UNAVAILABLE");
        const serverResults = await runContestPublicSamplesOnServer({
          contestId,
          problemId: selected.problem_id,
          accessToken,
          admission,
          language,
          source,
        });
        setRunResults(serverResults.map((result) => ({ ...result, origin: "server" as const, inputKind: "sample" as const })));
        setSubmissionMessage("Local containment is unavailable here; the gateway's separate isolated worker ran only this admitted problem's visible samples. No official submission or verdict was created.");
        return;
      }
      setRunResults(results);
    } catch (error) {
      setActiveExecutionId(null);
      if (error instanceof RuntimeBridgeError && error.code === "EXECUTION_CANCELLED") {
        setSubmissionMessage("The local public-sample run was cancelled. No contest submission or verdict was created.");
        return;
      }
      setSubmissionMessage("Public-sample execution failed. No official submission or verdict was created; official server submission remains separate.");
    } finally {
      setActiveExecutionId(null);
      setRunning(false);
    }
  }

  async function runCustomInput() {
    if (!selected || !selectedDraftReady || accessPaused || running || submitting || completing || !source ||
        customInputTooLarge || !allowedLanguages.includes(language)) return;
    if (!session || session.purpose !== "contest" || session.contestId !== contestId ||
        admission.contest_id !== contestId) {
      setSubmissionMessage("An admitted paired contest launcher is required for custom input.");
      return;
    }
    setRunning(true);
    setRunKind("custom");
    setRunResults([]);
    setSubmissionMessage("");
    const executionId = crypto.randomUUID();
    setActiveExecutionId(executionId);
    try {
      const result = await runLocalInput(session, source, language, customInput, executionId, undefined, {
        problemId: selected.problem_id,
        contestPolicy: policyEnvelope,
      });
      setRunResults([{
        stdout: result.stdout,
        stderr: result.stderr,
        exit_code: result.exit_code,
        compile_exit_code: result.compile_exit_code ?? null,
        duration_ms: result.duration_ms,
        peak_memory_bytes: result.peak_memory_bytes,
        sample_matches: null,
        origin: "local",
        inputKind: "custom",
      }]);
    } catch (error) {
      setSubmissionMessage(error instanceof RuntimeBridgeError && error.code === "EXECUTION_CANCELLED"
        ? "Custom-input run cancelled. No official submission was created."
        : "Custom-input execution failed. A verified local toolchain and sandbox are required; custom input is never sent to the server sample fallback. No official submission was created.");
    } finally {
      setActiveExecutionId(null);
      setRunning(false);
    }
  }

  async function cancelLocalRun() {
    if (!activeExecutionId || !session) return;
    try {
      await cancelLocalExecution(session, activeExecutionId);
      setSubmissionMessage("Cancellation requested for the active local run.");
    } catch (error) {
      setSubmissionMessage(error instanceof RuntimeBridgeError
        ? `${error.code}: ${error.message}`
        : "The local run could not be cancelled.");
    }
  }

  async function submitToServer() {
    if (!selected || !selectedDraftReady || !recoveryReady || !recoveryKey || accessPaused || submitting || running || completing || !allowedLanguages.includes(language)) return;
    const attemptKey = recoveryKey;
    if (pendingSubmission && pendingSubmission.sessionId !== admission.session_id) {
      setSubmissionMessage("This unresolved attempt belongs to an earlier admission. It cannot be resent under a new session. Recover its authenticated server history or contact the organizer.");
      return;
    }
    if (pendingSubmission && (pendingSubmission.problemId !== selected.problem_id ||
        pendingSubmission.language !== language || pendingSubmission.source !== source)) {
      setSubmissionMessage("A previous submission has an unconfirmed response. Restore its exact problem, language and source, then retry so the same idempotency key is reused.");
      return;
    }
    setSubmitting(true);
    setSubmissionMessage("Sending source to the contest authority for server judging…");
    let acceptedId: string | null = null;
    let attempt: PendingContestSubmission | null = null;
    try {
      const accessToken = await getToken({ skipCache: true });
      if (!accessToken) throw new Error("AUTH_SESSION_UNAVAILABLE");
      if (recoveryKeyRef.current !== attemptKey) return;
      attempt = pendingSubmission ?? {
        idempotencyKey: newContestIdempotencyKey(),
        sessionId: admission.session_id,
        problemId: selected.problem_id,
        language,
        source,
      };
      if (!persistSubmissionAttempt(browserContestDraftStorage(), attemptKey, attempt)) {
        setRecoveryBlocked(true);
        setSubmissionMessage("The submission recovery record could not be saved. No source was sent. Restore browser storage and reload before retrying.");
        return;
      }
      setPendingSubmission(attempt);
      const receipt = await submitContestSource({
        contestId,
        idempotencyKey: attempt.idempotencyKey,
        accessToken,
        submission: {
          session_id: admission.session_id,
          lease_token: admission.lease_token,
          device_id: admission.device_id,
          device_epoch: admission.device_epoch,
          problem_id: selected.problem_id,
          language,
          source,
        },
      });
      acceptedId = receipt.submission_id;
      if (recoveryKeyRef.current !== attemptKey) return;
      if (clearConfirmedSubmission(browserContestDraftStorage(), attemptKey, attempt)) setPendingSubmission(null);
      setLastSubmissionId(receipt.submission_id);
      setHistoryUnavailable(false);
      setSubmissionHistory((current) => [{
        submission_id: receipt.submission_id,
        problem_id: selected.problem_id,
        language,
        accepted_at: receipt.accepted_at,
        source_sha256: receipt.source_sha256,
        idempotency_key: receipt.idempotency_key,
      }, ...current.filter((item) => item.submission_id !== receipt.submission_id)].slice(0, 50));
      setSubmissionMessage(`Submission ${receipt.submission_id} was accepted by the server queue. Waiting for its authoritative verdict…`);
      for (let attempt = 0; attempt < 30; attempt += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 2000));
        if (recoveryKeyRef.current !== attemptKey) return;
        const token = await getToken({ skipCache: true });
        if (!token) throw new Error("AUTH_SESSION_UNAVAILABLE");
        if (recoveryKeyRef.current !== attemptKey) return;
        const status = await getContestSubmissionStatus({ submissionId: receipt.submission_id, accessToken: token });
        if (recoveryKeyRef.current !== attemptKey) return;
        setHistoryStatuses((current) => ({ ...current, [status.submission_id]: status }));
        if (status.status === "judged" || status.status === "internal_error") {
          setSubmissionMessage(status.status === "judged"
            ? `Server verdict: ${status.verdict ?? "pending"}${status.score === null ? "" : ` · judge score ${status.score}`}.`
            : "The server judge reported an internal error. The submission remains in server history; contact the organizer if it does not recover.");
          return;
        }
      }
      setSubmissionMessage(`Submission ${receipt.submission_id} is still being judged by the server. Check the contest status again shortly.`);
    } catch (error) {
      if (recoveryKeyRef.current !== attemptKey) return;
      if (!acceptedId && error instanceof ContestSubmissionError && error.code === "JUDGE_NOT_READY") {
        if (attempt && clearConfirmedSubmission(browserContestDraftStorage(), attemptKey, attempt)) setPendingSubmission(null);
        setSubmissionMessage("Official judging is not ready yet. No submission was accepted. Retry after the organizer confirms judge readiness.");
        return;
      }
      setSubmissionMessage(acceptedId
        ? `Submission ${acceptedId} was accepted. Its latest server status could not be read; use Check status to retry the source-free status request.`
        : "The server submission response was not confirmed. Retry this exact problem, language and source to reuse the same idempotency key; local execution never creates an official verdict.");
    } finally {
      setSubmitting(false);
    }
  }

  function restorePendingAttempt() {
    if (!pendingSubmission || running || submitting || completing) return;
    if (!problems.some((problem) => problem.problem_id === pendingSubmission.problemId) ||
        !allowedLanguages.includes(pendingSubmission.language)) {
      setSubmissionMessage("The recovered problem/language is not in this activated contest. Do not resend it; recover its server history or contact the organizer.");
      return;
    }
    const key = `${pendingSubmission.problemId}:${pendingSubmission.language}`;
    const values = { ...draftStore.values, [key]: pendingSubmission.source };
    setDraftStore({ key: storageKey, values });
    setSelectedProblemId(pendingSubmission.problemId);
    setLanguage(pendingSubmission.language);
    setSource(pendingSubmission.source);
    setActiveDraftKey(key);
    setDraftSaved(storageKey ? writeContestDrafts(browserContestDraftStorage(), storageKey, values) : false);
  }

  function exitForRecovery() {
    if (running || submitting || completing) return;
    if (!window.confirm("Exit the secure browser for recovery? This does not finish the contest or confirm an unacknowledged submission. Re-entry requires organizer approval. Saved attempts remain in this browser profile, which SEB may clear on exit.")) return;
    setCompleting(true);
    // Show the explicit recovery handoff state before navigating to SEB's
    // configured quit URL. The launcher supervisor owns local cleanup on exit.
    // Never call the server completion endpoint or claim completion here.
    setCompleting(false);
    onRecoveryExit();
  }

  async function checkLatestStatus() {
    if (!lastSubmissionId || submitting) return;
    setSubmitting(true);
    try {
      const accessToken = await getToken({ skipCache: true });
      if (!accessToken) throw new Error("AUTH_SESSION_UNAVAILABLE");
      const status = await getContestSubmissionStatus({ submissionId: lastSubmissionId, accessToken });
      setHistoryStatuses((current) => ({ ...current, [status.submission_id]: status }));
      setSubmissionMessage(status.status === "judged"
        ? `Server verdict: ${status.verdict ?? "pending"}${status.score === null ? "" : ` · judge score ${status.score}`}.`
        : status.status === "internal_error"
          ? "The server judge reported an internal error. The submission remains in server history; contact the organizer if it does not recover."
          : `Submission ${status.submission_id} is ${status.status} in the server judge queue.`);
    } catch {
      setSubmissionMessage("The source-free server status could not be retrieved. Retry the status check; the contest score is unchanged here.");
    } finally {
      setSubmitting(false);
    }
  }

  async function finishContest() {
    if (!recoveryReady || accessPaused || running || submitting || completing || pendingSubmission) {
      setSubmissionMessage("Finish is unavailable while a run or submission response is pending. Resolve that attempt first so no accepted submission is lost from view.");
      return;
    }
    setCompleting(true);
    onCompletionPending(true);
    setSubmissionMessage("Requesting server-confirmed contest completion…");
    try {
      const accessToken = await getToken({ skipCache: true });
      if (!accessToken) throw new Error("AUTH_SESSION_UNAVAILABLE");
      const receipt = await completeContestAdmission({ contestId, accessToken, admission });
      let launcherConfirmed = false;
      if (session) {
        try {
          await confirmLocalContestCompletion(session, contestId);
          launcherConfirmed = true;
        } catch {
          // The server completion is authoritative. If loopback confirmation
          // is unavailable, supervised exit/startup cleanup remains fail-closed.
        }
      }
      setCompleting(false);
      onCompleted(receipt.completed_at, launcherConfirmed);
    } catch {
      setCompleting(false);
      onCompletionPending(false);
      setSubmissionMessage("The server did not confirm completion. Your session remains available; retry this action or contact the organizer.");
    }
  }

  async function refreshHistoryStatus(submissionId: string) {
    if (submitting) return;
    setSubmitting(true);
    try {
      const accessToken = await getToken({ skipCache: true });
      if (!accessToken) throw new Error("AUTH_SESSION_UNAVAILABLE");
      const status = await getContestSubmissionStatus({ submissionId, accessToken });
      setHistoryStatuses((current) => ({ ...current, [submissionId]: status }));
    } catch {
      setSubmissionMessage("That submission's source-free server status could not be refreshed. Your saved server history is unchanged.");
    } finally {
      setSubmitting(false);
    }
  }

  async function loadMoreHistory() {
    if (!historyCursor || historyLoadingMore) return;
    setHistoryLoadingMore(true);
    setHistoryPageError(false);
    try {
      const accessToken = await getToken({ skipCache: true });
      if (!accessToken) throw new Error("AUTH_SESSION_UNAVAILABLE");
      const page = await getContestSubmissionHistory({ contestId, accessToken, cursor: historyCursor });
      setSubmissionHistory((current) => {
        const merged = new Map(current.map((item) => [item.submission_id, item]));
        for (const item of page.items) merged.set(item.submission_id, item);
        return [...merged.values()].sort(compareHistory);
      });
      setHistoryCursor(page.next_cursor);
      setHistoryHasMore(page.next_cursor !== null);
    } catch {
      setHistoryPageError(true);
    } finally {
      setHistoryLoadingMore(false);
    }
  }

  return (
    <div id="contest-workspace" className="mt-6 scroll-mt-6 border-t border-white/10 pt-5">
      <h4 className="text-lg font-semibold">Contest workspace</h4>
      <div className="mt-3 flex flex-wrap gap-2" role="list" aria-label="Contest problems">
        {problems.map((problem) => (
          <button key={problem.problem_id} type="button" disabled={running || submitting || completing}
            onClick={() => { setSelectedProblemId(problem.problem_id); setRunResults([]); setCustomInput(""); }}
            aria-pressed={selected?.problem_id === problem.problem_id}
            className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white aria-pressed:border-red-400">
            {problem.ordinal}. {problem.title}
          </button>
        ))}
      </div>
      {selected ? (
        <div className="mt-4 grid gap-4">
          <article className="rounded-lg border border-white/10 bg-black/20 p-4">
            <h5 className="font-semibold">{selected.title}</h5>
            <div className="mt-3">
              <ContestStatement markdown={selected.statement_markdown} resolveAssetUrl={(assetPath) => {
                const declaredPath = resolveDeclaredContestAssetPath(assetPath, selected.assets ?? []);
                return declaredPath ? assetUrls[declaredPath] : undefined;
              }} />
            </div>
            {selected.public_samples.map((sample, index) => (
              <div key={`${selected.problem_id}-sample-${index}`} className="mt-4 grid gap-2 sm:grid-cols-2">
                <div><p className="text-xs font-semibold uppercase text-zinc-500">Public sample input</p><pre className="mt-1 overflow-auto rounded bg-black/30 p-2 text-xs">{sample.input}</pre></div>
                <div><p className="text-xs font-semibold uppercase text-zinc-500">Expected sample output</p><pre className="mt-1 overflow-auto rounded bg-black/30 p-2 text-xs">{sample.output}</pre></div>
              </div>
            ))}
          </article>
          <label className="grid gap-2 text-sm">Language
            <select value={language} onChange={(event) => setLanguage(event.target.value as ContestLanguage)} disabled={!allowedLanguages.length || running || submitting}
              className="w-fit rounded border border-white/20 bg-zinc-900 px-3 py-2">
              {allowedLanguages.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <div className="grid gap-2 text-sm">
            <span id="contest-source-code-label">Source code</span>
            <div className="overflow-hidden rounded-lg border border-white/15 bg-zinc-950" role="group" aria-labelledby="contest-source-code-label">
              <MonacoCodeEditor
                language={language}
                value={source}
                readOnly={!selectedDraftReady}
                onChange={(value) => {
                  const next = value ?? "";
                  if (next.length <= 200_000) setSource(next);
                }}
                height="380px"
                ariaLabel="Contest source code editor"
              />
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            {!selectedDraftReady
              ? "Loading the saved draft for this problem and language…"
              : draftSaved === false
              ? "This draft is over the local size limit or browser storage is unavailable. Keep this page open until you submit; it may not survive a reload."
              : "Drafts are saved locally in this browser profile for this signed-in account and contest. They are not uploaded until you submit; the exam browser may clear its profile when it exits."}
          </p>
          <label className="grid gap-2 text-sm">Custom input (local only)
            <textarea value={customInput} onChange={(event) => setCustomInput(event.target.value)}
              disabled={running || completing} maxLength={64 * 1024} rows={5} spellCheck={false}
              aria-describedby="contest-custom-input-help" aria-invalid={customInputTooLarge}
              className="w-full rounded-lg border border-white/15 bg-zinc-950 p-3 font-mono text-sm disabled:opacity-50" />
            <span id="contest-custom-input-help" className="text-xs text-zinc-400">
              {customInputTooLarge ? "Input exceeds the 64 KiB UTF-8 limit." : "Up to 64 KiB UTF-8. Empty input is allowed. Output is unofficial and has no expected-answer verdict."}
            </span>
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => void runPublicSamples()} disabled={!selectedDraftReady || accessPaused || running || submitting || completing || !source || !selected.public_samples.length}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold disabled:opacity-50">
              {running && runKind === "sample" ? "Preparing compiler or running samples…" : "Run public samples"}
            </button>
            <button type="button" onClick={() => void runCustomInput()}
              disabled={!selectedDraftReady || accessPaused || running || submitting || completing || !source || !session || customInputTooLarge || !allowedLanguages.includes(language)}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold disabled:opacity-50">
              {running && runKind === "custom" ? "Running custom input…" : "Run custom input"}
            </button>
            {running && activeExecutionId && (
              <button type="button" onClick={() => void cancelLocalRun()} disabled={submitting}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold disabled:opacity-50">
                Cancel local run
              </button>
            )}
            <button type="button" onClick={() => void submitToServer()} disabled={!selectedDraftReady || !recoveryReady || accessPaused || running || submitting || completing || !source || !allowedLanguages.includes(language)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {submitting ? "Submitting to server…" : "Submit to contest"}
            </button>
            {lastSubmissionId && <button type="button" onClick={() => void checkLatestStatus()} disabled={running || submitting}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold disabled:opacity-50">Check status</button>}
          </div>
          {pendingSubmission && <div role="status" className="rounded border border-amber-300/40 p-3 text-sm text-amber-200">
            <p>An unconfirmed submission is preserved. Retry only its exact source, problem and language with the original admission; a new admission must recover its server history instead.</p>
            <button type="button" onClick={restorePendingAttempt} disabled={running || submitting || completing}
              className="mt-2 rounded border border-white/20 px-3 py-2 disabled:opacity-50">Restore pending attempt</button>
          </div>}
          <div className="border-t border-white/10 pt-4">
            <button type="button" onClick={() => void finishContest()} disabled={!recoveryReady || accessPaused || running || submitting || completing || !!pendingSubmission}
              className="rounded-lg border border-amber-300/40 px-4 py-2 text-sm font-semibold text-amber-200 disabled:opacity-50">
              {completing ? "Confirming with server…" : "Finish contest and return"}
            </button>
            <p className="mt-2 text-xs text-zinc-400">Finishing ends your server session. Unresolved submission retries must be resolved first; accepted submissions and server judging history remain recorded.</p>
            {(accessPaused || pendingSubmission || recoveryBlocked) && <button type="button" onClick={exitForRecovery} disabled={running || submitting || completing}
              className="mt-3 rounded border border-white/20 px-4 py-2 text-sm disabled:opacity-50">Exit secure browser for recovery (not contest completion)</button>}
          </div>
          <p className="text-xs text-amber-300">Local output is unverified and never changes contest score. Submit sends source to the server judge; only its verdict updates official results.</p>
          {runResults.map((result, index) => {
            const diagnostic = result.compile_exit_code !== null && result.compile_exit_code !== 0
              ? "Compilation failed"
              : result.exit_code !== 0
                ? "Program exited unsuccessfully"
                : result.sample_matches === true
                  ? "Output matches this visible sample"
                  : result.sample_matches === false
                    ? "Output differs from this visible sample"
                    : "Execution completed; custom input has no expected output";
            return (
              <section key={`run-${index}`} className="rounded border border-white/10 bg-black/30 p-3 text-xs">
                <h6 className="font-semibold">{result.origin === "local" ? "Local" : "Server fallback"} output for {result.inputKind === "custom" ? "custom input" : `public sample ${index + 1}`} · unverified</h6>
                <p className="mt-1 text-zinc-400">Diagnostic: {diagnostic} (unofficial)</p>
                <pre className="mt-2 whitespace-pre-wrap break-words">{result.stdout || "(no stdout)"}</pre>
                {result.stderr && <pre className="mt-2 whitespace-pre-wrap break-words text-amber-300">{result.stderr}</pre>}
                {result.exit_code !== null && <p className="mt-1 text-zinc-500">Exit code {result.exit_code}</p>}
                {result.compile_exit_code !== null && result.compile_exit_code !== 0 && <p className="mt-1 text-amber-300">Compile exit code {result.compile_exit_code}</p>}
                <p className="mt-1 text-zinc-500">Time: {result.duration_ms} ms</p>
                {result.origin === "local" && <p className="mt-1 text-zinc-500">Peak memory: {typeof result.peak_memory_bytes === "number" ? `${(result.peak_memory_bytes / (1024 * 1024)).toFixed(1)} MiB (measured)` : "measurement unavailable"}</p>}
                {result.sample_matches !== null && <p className="mt-1 text-zinc-500">Public sample match: {result.sample_matches ? "yes" : "no"} (unofficial)</p>}
              </section>
            );
          })}
          {submissionMessage && <p role="status" aria-live="polite" className="text-sm text-zinc-300">{submissionMessage}</p>}
          <section className="mt-2 border-t border-white/10 pt-4" aria-labelledby="submission-history-heading">
            <h5 id="submission-history-heading" className="font-semibold">Recent server submissions</h5>
            <button type="button" onClick={() => { setHistoryLoading(true); setHistoryRefresh((value) => value + 1); }} disabled={historyLoading || submitting || completing}
              className="mt-2 rounded border border-white/20 px-3 py-2 text-xs disabled:opacity-50">Refresh server history and recover receipts</button>
            {historyLoading && <p className="mt-2 text-sm text-zinc-400">Loading server history…</p>}
            {historyUnavailable && <p className="mt-2 text-sm text-zinc-400">Server history is temporarily unavailable. Your accepted submissions remain stored by the contest authority.</p>}
            {historyPageError && <p className="mt-2 text-sm text-zinc-400">Older history could not be loaded. Retry to continue.</p>}
            {!historyLoading && !historyUnavailable && submissionHistory.length === 0 && <p className="mt-2 text-sm text-zinc-400">No server submissions are recorded for this contest yet.</p>}
            <ol className="mt-2 grid gap-2">
              {submissionHistory.map((item) => {
                const status = historyStatuses[item.submission_id];
                const problemTitle = problems.find((problem) => problem.problem_id === item.problem_id)?.title ?? item.problem_id;
                return (
                  <li key={item.submission_id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-white/10 p-3 text-sm">
                    <div>
                      <p>{problemTitle} · {item.language}</p>
                      <p className="text-xs text-zinc-400">Accepted {new Date(item.accepted_at).toLocaleString()} · {status
                        ? status.status === "judged" ? `Server verdict ${status.verdict ?? "pending"}${status.score === null ? "" : ` · judge score ${status.score}`}` : status.status
                        : "status not refreshed"}</p>
                    </div>
                    <button type="button" onClick={() => void refreshHistoryStatus(item.submission_id)} disabled={submitting}
                      className="rounded border border-white/20 px-3 py-1.5 text-xs disabled:opacity-50">Refresh status</button>
                  </li>
                );
              })}
            </ol>
            {historyHasMore && <button type="button" onClick={() => void loadMoreHistory()} disabled={historyLoadingMore || historyLoading || historyUnavailable}
              className="mt-3 rounded border border-white/20 px-3 py-2 text-sm disabled:opacity-50">{historyLoadingMore ? "Loading older submissions…" : "Load older submissions"}</button>}
          </section>
        </div>
      ) : <p className="mt-4 text-sm text-zinc-400">No participant problem set is available.</p>}
      {!completing && problems.length > 0 && (
        <ContestProblemStandings
          key={`${contestId}:${problems.map((problem) => problem.problem_id).join(",")}`}
          contestId={contestId}
          problems={problems}
        />
      )}
    </div>
  );
}

function browserContestDraftStorage(): ContestDraftStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function compareHistory(left: ContestSubmissionHistoryItem, right: ContestSubmissionHistoryItem): number {
  return Date.parse(right.accepted_at) - Date.parse(left.accepted_at) ||
    right.submission_id.localeCompare(left.submission_id);
}
