"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  ExternalLink,
  ChevronLeft,
  Clock,
  CircleCheck,
  RefreshCw,
} from "@/components/animate-ui/icons";
import { AlertTriangle, Copy } from "lucide-react";
import SmoothButton from "@/components/smoothui/smooth-button";
import { Tabs, TabsContents, TabsContent } from "@/components/animate-ui/tabs";
import { VerifiedSealBadge } from "./verified-badge";

export interface PlatformVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
  platformName: string;
  handle: string;
  onVerificationSuccess: (data: any) => void;
}

type VerificationStep = "intro" | "step1" | "step2" | "step3" | "success" | "failed";

export function PlatformVerificationModal({
  isOpen,
  onClose,
  platform,
  platformName,
  handle,
  onVerificationSuccess,
}: PlatformVerificationModalProps) {
  const [currentStep, setCurrentStep] = useState<VerificationStep>("intro");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [challengeToken, setChallengeToken] = useState<string>("");
  const [settingsUrl, setSettingsUrl] = useState<string>("");
  const [targetField, setTargetField] = useState<string>("ReadMe section");
  const [copied, setCopied] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [verifiedStats, setVerifiedStats] = useState<any>(null);

  // Initialize and generate verification code when modal opens
  useEffect(() => {
    if (isOpen && handle) {
      setCurrentStep("intro");
      setCopied(false);
      setErrorMessage("");
      setVerifiedStats(null);
      setVerificationCode("");
      setChallengeToken("");

      fetch("/api/profile/verification/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, handle }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setVerificationCode(data.data.verificationCode);
            setChallengeToken(data.data.challengeToken);
            setSettingsUrl(data.data.settingsUrl);
            setTargetField(data.data.targetField);
          } else {
            setErrorMessage(data.message || "This platform cannot be verified right now.");
          }
        })
        .catch((error) => {
          setErrorMessage(error instanceof Error ? error.message : "Could not start verification.");
        });
    }
  }, [isOpen, platform, handle]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    if (typeof window !== "undefined" && verificationCode) {
      navigator.clipboard.writeText(verificationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExecuteVerification = async () => {
    setIsVerifying(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/profile/verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeToken }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.verified) {
        setVerifiedStats(data.data);
        setCurrentStep("success");
        onVerificationSuccess(data.data);
      } else {
        setErrorMessage(
          data.message || `Your ${platformName} profile could not be verified.`
        );
        setCurrentStep("failed");
      }
    } catch {
      setErrorMessage(`Network error verifying ${platformName} profile.`);
      setCurrentStep("failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const successFields = platform === "github"
    ? [
      { label: "Public repositories", value: verifiedStats?.profileStats?.publicRepos },
      { label: "Repository stars", value: verifiedStats?.profileStats?.totalStars },
    ]
    : [
      { label: "Solved", value: verifiedStats?.totalQuestionsSolved },
      { label: "Rating", value: verifiedStats?.currentRating },
    ];

  // Calculate step progress bar width (Step 1 = 33%, Step 2 = 66%, Step 3 = 100%)
  const getProgressWidth = () => {
    switch (currentStep) {
      case "step1":
        return "w-1/3";
      case "step2":
        return "w-2/3";
      case "step3":
      case "success":
      case "failed":
        return "w-full";
      default:
        return "w-0";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121216] shadow-2xl overflow-hidden relative text-white">
        {/* Top Progress Bar (Visible on steps 1, 2, 3) */}
        {["step1", "step2", "step3"].includes(currentStep) && (
          <div className="w-full h-1 bg-zinc-800">
            <div
              className={`h-full bg-gradient-to-r from-orange-600 to-[#ff1018] transition-all duration-300 ${getProgressWidth()}`}
            />
          </div>
        )}

        <Tabs value={currentStep} onValueChange={(val) => setCurrentStep(val as VerificationStep)}>
          <TabsContents>
            {/* ========================================================
                SCREEN 1: INTRO (Screenshot 2)
                ======================================================== */}
            <TabsContent value="intro" className="p-6">
              <div className="flex justify-end mb-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center space-y-2 mb-6">
                <h2 className="text-xl font-black text-white">
                  Verify your {platformName} profile
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed max-w-sm mx-auto">
                  This helps us confirm that the {platformName} profile belongs to you and allows
                  us to show your verified stats on Mindflare Arena.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 pt-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Takes less than 30 seconds</span>
                </div>
              </div>

              {errorMessage && <p role="status" className="mb-4 text-center text-xs text-red-400">{errorMessage}</p>}

              {/* What you'll need checklist */}
              <div className="rounded-xl border border-white/10 bg-black/60 p-4 mb-6 space-y-2.5 text-xs text-zinc-200">
                <div className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] mb-1">
                  What you'll need:
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Access to your {platformName} profile (@{handle})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ability to edit your profile {targetField}</span>
                </div>
              </div>

              {/* Start Button */}
              <SmoothButton
                variant="solid"
                color="destructive"
                size="default"
                onClick={() => setCurrentStep("step1")}
                disabled={!challengeToken}
                className="w-full rounded-xl bg-[#ff1018] hover:bg-[#e00e15] text-white font-bold text-sm shadow-lg shadow-[#ff1018]/25"
              >
                Start Verification
              </SmoothButton>
            </TabsContent>

            {/* ========================================================
                SCREEN 2: STEP 1 OF 3 (Screenshot 3)
                ======================================================== */}
            <TabsContent value="step1" className="p-6">
              {/* Top Navigation Row */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("intro")}
                  className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-bold font-mono text-amber-400">
                  Step 1 <span className="text-zinc-500">/ 3</span>
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center space-y-2 mb-6">
                <h3 className="text-lg font-black text-white">
                  Open your {platformName} profile
                </h3>
                <p className="text-xs text-zinc-300">
                  Go to the following page while logged in to {platformName}:
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {/* External Link Button */}
                <SmoothButton
                  variant="solid"
                  color="destructive"
                  size="default"
                  asChild
                  className="w-full rounded-xl bg-[#ff1018] hover:bg-[#e00e15] text-white font-bold text-sm shadow-md"
                >
                  <a href={settingsUrl} target="_blank" rel="noopener noreferrer">
                    <span>Open {platformName} Settings</span>
                    <ExternalLink className="w-4 h-4 ml-1.5" />
                  </a>
                </SmoothButton>

                {/* Direct URL text */}
                <div className="text-center">
                  <a
                    href={settingsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{settingsUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-[11px] text-zinc-400 text-center pt-2">
                  This is where you can edit your profile {targetField}.
                </p>
              </div>

              {/* Continue Button */}
              <SmoothButton
                variant="solid"
                color="destructive"
                size="default"
                onClick={() => setCurrentStep("step2")}
                className="w-full rounded-xl bg-[#ff1018] hover:bg-[#e00e15] text-white font-bold text-sm shadow-lg shadow-[#ff1018]/25"
              >
                Continue
              </SmoothButton>
            </TabsContent>

            {/* ========================================================
                SCREEN 3: STEP 2 OF 3 (Screenshot 4)
                ======================================================== */}
            <TabsContent value="step2" className="p-6">
              {/* Top Navigation Row */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("step1")}
                  className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-bold font-mono text-amber-400">
                  Step 2 <span className="text-zinc-500">/ 3</span>
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center space-y-2 mb-5">
                <h3 className="text-lg font-black text-white">
                  Paste the verification code in your {targetField}
                </h3>
                <p className="text-xs text-zinc-300">
                  Edit the {targetField} and paste the following code exactly as shown:
                </p>
              </div>

              {/* Code Box with Copy */}
              <div className="mb-5 space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-black border border-white/15 p-2 pl-4">
                  <span className="font-mono text-base font-black text-white tracking-widest select-all">
                    {verificationCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-300" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed text-center">
                  This code helps us confirm profile ownership. You can paste this code anywhere in
                  your {targetField}.
                </p>
              </div>

              {/* Confirm pasted Button */}
              <SmoothButton
                variant="solid"
                color="destructive"
                size="default"
                onClick={() => setCurrentStep("step3")}
                className="w-full rounded-xl bg-[#ff1018] hover:bg-[#e00e15] text-white font-bold text-sm shadow-lg shadow-[#ff1018]/25"
              >
                I've pasted the code
              </SmoothButton>
            </TabsContent>

            {/* ========================================================
                SCREEN 4: STEP 3 OF 3 (Screenshot 5)
                ======================================================== */}
            <TabsContent value="step3" className="p-6">
              {/* Top Navigation Row */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("step2")}
                  disabled={isVerifying}
                  className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-bold font-mono text-amber-400">
                  Step 3 <span className="text-zinc-500">/ 3</span>
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isVerifying}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center space-y-3 mb-6">
                <h3 className="text-lg font-black text-white">Save your changes and verify</h3>
                <p className="text-xs text-zinc-300 leading-relaxed max-w-sm mx-auto">
                  Make sure you have saved your profile after adding the verification code.
                </p>
                <p className="text-xs text-zinc-400 font-medium">
                  Once done, click verify below.
                </p>
              </div>

              {/* Verify Trigger Button */}
              <SmoothButton
                variant="solid"
                color="destructive"
                size="default"
                disabled={isVerifying || !challengeToken}
                onClick={() => handleExecuteVerification()}
                className="w-full rounded-xl bg-[#ff1018] hover:bg-[#e00e15] text-white font-bold text-sm shadow-lg shadow-[#ff1018]/25 justify-center flex items-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying {platformName} Profile...</span>
                  </>
                ) : (
                  <span>Verify {platformName} Profile</span>
                )}
              </SmoothButton>
            </TabsContent>

            {/* ========================================================
                SCREEN 5: VERIFICATION FAILED (Screenshot 6)
                ======================================================== */}
            <TabsContent value="failed" className="p-6 text-center">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-9 h-9 text-amber-500" />
                </div>
              </div>

              <h3 className="text-xl font-black text-white mb-2">Verification Failed</h3>
              <p className="text-xs text-zinc-300 mb-4 max-w-xs mx-auto">
                Your {platformName} profile could not be verified.
              </p>

              <div className="p-3.5 rounded-xl bg-[#201416] border border-red-900/40 text-xs text-zinc-300 leading-relaxed mb-6">
                <p>
                  {errorMessage ||
                    "Please try again after some time. Make sure the verification code is saved in your public profile and your account visibility is set to public."}
                </p>
                <div className="pt-2 text-[11px] text-zinc-400">
                  If the issue persists, contact us at{" "}
                  <span className="text-amber-400 font-mono underline cursor-pointer">
                    support@mindflare.dev
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <SmoothButton
                  variant="outline"
                  color="neutral"
                  size="default"
                  onClick={() => setCurrentStep("step2")}
                  className="w-full rounded-xl border-white/10 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs"
                >
                  Try Again
                </SmoothButton>
                <SmoothButton
                  variant="solid"
                  color="destructive"
                  size="default"
                  onClick={onClose}
                  className="w-full rounded-xl bg-[#ff1018] hover:bg-[#e00e15] text-white font-bold text-xs"
                >
                  Close
                </SmoothButton>
              </div>
            </TabsContent>

            {/* ========================================================
                SCREEN 6: SUCCESS VERIFIED
                ======================================================== */}
            <TabsContent value="success" className="p-6 text-center">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg">
                  <VerifiedSealBadge className="w-10 h-10 text-emerald-400" />
                </div>
              </div>

              <h3 className="text-xl font-black text-white mb-1">Profile Verified!</h3>
              <p className="text-xs text-zinc-300 mb-4 max-w-xs mx-auto">
                Your {platformName} profile <strong className="text-white">(@{handle})</strong> is
                now verified and synced with Mindflare Arena.
              </p>

              {verifiedStats && successFields.some((field) => field.value !== undefined) && (
                <div className="p-3.5 rounded-xl bg-black border border-white/10 mb-6 grid grid-cols-2 gap-2 text-left text-xs font-mono">
                  {successFields.map((field) => field.value !== undefined && (
                    <div key={field.label}>
                      <span className="text-[10px] text-zinc-400 block uppercase">{field.label}</span>
                      <strong className="text-white text-base">{field.value}</strong>
                    </div>
                  ))}
                </div>
              )}

              <SmoothButton
                variant="solid"
                color="destructive"
                size="default"
                onClick={onClose}
                className="w-full rounded-xl bg-[#ff1018] hover:bg-[#e00e15] text-white font-bold text-sm shadow-lg shadow-[#ff1018]/25"
              >
                Close &amp; View Profile
              </SmoothButton>
            </TabsContent>
          </TabsContents>
        </Tabs>
      </div>
    </div>
  );
}
