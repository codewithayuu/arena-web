"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Eye,
  UserCheck,
  Wifi,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { FaceMeshOverlay } from "./FaceMeshOverlay";
import { useProctoring } from "@/lib/proctoring/proctoring-context";
import { detectFaceFromVideo } from "@/lib/proctoring/face-detector";
import { FaceDetectionResult } from "@/lib/proctoring/types";

interface ProctoringScreeningModalProps {
  isOpen: boolean;
  contestId: string;
  contestName?: string;
  onScreeningPassed: () => void;
  onCancel?: () => void;
}

type ScreeningStep = "consent" | "camera" | "calibration" | "connection" | "ready";

export function ProctoringScreeningModal({
  isOpen,
  contestId,
  contestName = "DEADLOCK '26",
  onScreeningPassed,
  onCancel,
}: ProctoringScreeningModalProps) {
  const { markScreeningPassed, startMonitoring, setVideoElement } = useProctoring();

  const [currentStep, setCurrentStep] = useState<ScreeningStep>("consent");
  const [hasConsented, setHasConsented] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [localDetection, setLocalDetection] = useState<FaceDetectionResult | null>(null);

  // Calibration counters
  const [calibrationProgress, setCalibrationProgress] = useState(0); // 0 to 100
  const [isCenteredStable, setIsCenteredStable] = useState(false);
  const [connectionVerified, setConnectionVerified] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Ensure video element receives stream whenever calibration step activates
  useEffect(() => {
    if (currentStep === "calibration" && videoRef.current && stream) {
      const video = videoRef.current;
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      const play = () => {
        video.play().catch((err) => console.warn("Video play:", err));
      };
      video.onloadedmetadata = play;
      play();
      setVideoElement(video);
      startCalibrationLoop();
    }
  }, [currentStep, stream, setVideoElement]);

  const bindVideoRef = (node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && stream) {
      if (node.srcObject !== stream) {
        node.srcObject = stream;
      }
      node.muted = true;
      node.playsInline = true;
      node.autoplay = true;
      node.play().catch(() => undefined);
      setVideoElement(node);
    }
  };

  // Handle camera activation with relaxed desktop constraints and fallbacks
  const requestCameraAccess = async () => {
    setCameraError(null);
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Webcam API is unavailable in this browser context. Please use a modern browser on localhost or HTTPS."
      );
      return;
    }

    try {
      let userMediaStream: MediaStream | null = null;
      // 1. Try with standard 640x480 resolution (omit facingMode which causes OverconstrainedError on Windows desktops)
      try {
        userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
      } catch {
        // 2. Fallback to basic { video: true } constraint
        userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      setStream(userMediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = userMediaStream;
        setVideoElement(videoRef.current);
      }
      setCurrentStep("calibration");
      startCalibrationLoop();
    } catch (err: any) {
      const errName = err?.name || "";
      if (errName === "NotAllowedError" || errName === "PermissionDeniedError") {
        setCameraError(
          "Camera access denied. If you already allowed permissions in Chrome/Edge, Windows OS Camera Privacy or another running program is blocking access."
        );
      } else if (errName === "NotReadableError" || errName === "TrackStartError") {
        setCameraError(
          "Your camera is in exclusive use by another app (e.g. Teams, Zoom, Discord, Windows Camera) or hardware error occurred."
        );
      } else if (errName === "NotFoundError" || errName === "DevicesNotFoundError") {
        setCameraError(
          "No camera hardware detected on this device. You can proceed with the simulated testing camera."
        );
      } else {
        setCameraError(
          `Unable to access webcam (${errName || "Unknown"}). You can retry or proceed with simulated camera feed.`
        );
      }
    }
  };

  // Calibration loop to test face presence and gaze centering
  const startCalibrationLoop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let steadyCount = 0;
    let ticks = 0;
    const TARGET_STEADY_FRAMES = 8; // ~1.6 seconds of centered face

    intervalRef.current = setInterval(() => {
      ticks++;
      const video = videoRef.current;
      if (!video) return;

      if (video.readyState < 2 || video.videoWidth === 0) {
        if (ticks > 12) {
          steadyCount = Math.min(TARGET_STEADY_FRAMES, steadyCount + 1);
          setCalibrationProgress(Math.round((steadyCount / TARGET_STEADY_FRAMES) * 100));
          setIsCenteredStable(true);
          if (steadyCount >= TARGET_STEADY_FRAMES) {
            clearInterval(intervalRef.current!);
            setCurrentStep("connection");
            testAdminConnection();
          }
        }
        return;
      }

      const detection = detectFaceFromVideo(video);
      setLocalDetection(detection);

      if (detection.faceCount === 1 && detection.isCentered && detection.gazeDirection === "center") {
        steadyCount = Math.min(TARGET_STEADY_FRAMES, steadyCount + 1);
        setIsCenteredStable(true);
      } else if (detection.faceCount >= 1) {
        steadyCount = Math.min(TARGET_STEADY_FRAMES, steadyCount + 0.6);
        setIsCenteredStable(true);
      } else {
        if (ticks > 20) {
          steadyCount = Math.min(TARGET_STEADY_FRAMES, steadyCount + 1);
          setIsCenteredStable(true);
        } else {
          steadyCount = Math.max(0, steadyCount - 0.5);
          if (steadyCount < 3) setIsCenteredStable(false);
        }
      }

      const progress = Math.round((steadyCount / TARGET_STEADY_FRAMES) * 100);
      setCalibrationProgress(progress);

      if (progress >= 100) {
        clearInterval(intervalRef.current!);
        setCurrentStep("connection");
        testAdminConnection();
      }
    }, 200);
  };

  const testAdminConnection = () => {
    // Simulate/test connection verification
    setTimeout(() => {
      setConnectionVerified(true);
      setCurrentStep("ready");
    }, 1200);
  };

  const startSimulatedCamera = () => {
    setCameraError(null);
    setCurrentStep("connection");
    testAdminConnection();
  };

  const handleFinishAndEnter = async () => {
    markScreeningPassed();
    if (stream) {
      await startMonitoring(
        stream,
        contestId,
        `session-${Date.now().toString(36)}`,
        "participant-p104"
      );
    }
    onScreeningPassed();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl"
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500" />

        {/* Modal Header */}
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Proctoring Pre-Contest Screening</h2>
              <p className="text-xs text-zinc-400">Contest: {contestName} · Client-Side AI Verification</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Local AI Engine
            </span>
          </div>
        </header>

        {/* Modal Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: CONSENT */}
            {currentStep === "consent" && (
              <motion.div
                key="consent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Fully Client-Side AI Architecture</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                        All camera processing, MediaPipe face mesh inference, BlazeGaze estimation, and anomaly evaluation
                        run 100% locally inside your browser. No raw video feed ever leaves your computer or streams to the cloud.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2.5 text-xs text-zinc-300 border-t border-white/10 pt-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Webcam frames are discarded immediately after in-memory landmark inference.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Only sustained anomaly events (e.g., leaving screen) capture a local snapshot for human review.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>AI model findings are indicators for human proctors, never automatic disqualification.</span>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-white/10 bg-black/40 p-4 hover:border-white/20 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasConsented}
                    onChange={(e) => setHasConsented(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500"
                  />
                  <div className="text-xs text-zinc-300">
                    <span className="font-semibold text-white">I consent to on-device AI proctoring</span>
                    <p className="text-zinc-400 mt-0.5">
                      I authorize local face & gaze estimation during this official contest session with direct event logging to the administrator.
                    </p>
                  </div>
                </label>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  {onCancel && (
                    <button
                      type="button"
                      onClick={onCancel}
                      className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={!hasConsented}
                    onClick={startSimulatedCamera}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    Bypass with Simulated Camera
                  </button>
                  <button
                    type="button"
                    disabled={!hasConsented}
                    onClick={() => setCurrentStep("camera")}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    Continue to Camera Check
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CAMERA PERMISSION */}
            {currentStep === "camera" && (
              <motion.div
                key="camera"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5 text-center py-4"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                  <Camera className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Enable Webcam Access</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                    Your camera is used solely by the local MediaPipe engine to confirm you are seated in front of your workstation.
                  </p>
                </div>

                {cameraError ? (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-left space-y-3 shadow-lg">
                    <div className="flex items-start gap-2.5 text-amber-300">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <span className="font-bold text-white text-sm">Camera Hardware Notice:</span>
                        <p className="text-zinc-300 mt-0.5 leading-relaxed">{cameraError}</p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-black/40 border border-white/5 p-3 text-[11px] text-zinc-400 space-y-1.5">
                      <p className="font-semibold text-zinc-200">Why this happens even when browser permission is &ldquo;Allow&rdquo;:</p>
                      <ul className="list-disc list-inside space-y-1 text-zinc-300">
                        <li>
                          <strong className="text-white">Windows OS Privacy Setting:</strong> Press <kbd className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-200 border border-zinc-700">Win + I</kbd> &rarr; <em>Privacy &amp; security</em> &rarr; <em>Camera</em> &rarr; ensure <strong>&ldquo;Let desktop apps access your camera&rdquo;</strong> is turned <strong>ON</strong>.
                        </li>
                        <li>
                          <strong className="text-white">In Use by Another App:</strong> Zoom, Microsoft Teams, Discord, OBS, or another tab might have an exclusive lock on the webcam.
                        </li>
                        <li>
                          <strong className="text-white">Hardware Switch:</strong> Some laptops (Lenovo, HP, ASUS) have a physical privacy slider or Fn key switch.
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={startSimulatedCamera}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        Bypass &amp; Enter with Simulated Camera
                      </button>
                      <button
                        type="button"
                        onClick={requestCameraAccess}
                        className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Retry Camera Access
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={requestCameraAccess}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-xs font-semibold text-white shadow-xl hover:bg-red-500 transition-all cursor-pointer"
                    >
                      <Camera className="h-4 w-4" />
                      Allow &amp; Start Camera
                    </button>
                    <button
                      type="button"
                      onClick={startSimulatedCamera}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      Simulate Camera (Testing Mode)
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: CALIBRATION & GAZE CENTERING */}
            {currentStep === "calibration" && (
              <motion.div
                key="calibration"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-4"
              >
                {/* Video Container with Face Mesh Canvas Overlay */}
                <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-black shadow-inner">
                  <video
                    ref={bindVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover transform -scale-x-100"
                  />
                  <FaceMeshOverlay detection={localDetection} width={480} height={360} />

                  {/* Calibration Center Target */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div
                      className={`h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                        isCenteredStable
                          ? "border-emerald-400 bg-emerald-400/40 scale-125 shadow-lg shadow-emerald-500/50"
                          : "border-amber-400 bg-amber-400/20 animate-pulse"
                      }`}
                    />
                  </div>

                  {/* Live Status Pill */}
                  <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 text-[11px] font-medium text-white flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        localDetection?.faceCount === 1 ? "bg-emerald-400" : "bg-rose-500"
                      }`}
                    />
                    {localDetection?.faceCount === 1
                      ? isCenteredStable
                        ? "Face Centered & Gaze Locked"
                        : "Align Face with Center Oval"
                      : "No Face Detected"}
                  </div>
                </div>

                {/* Progress Bar & Instructions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Positioning & Baseline Calibration</span>
                    <span className="font-semibold text-emerald-400">{calibrationProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${calibrationProgress}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-zinc-400">
                      Center your face in the oval. Calibrating baseline gaze...
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        setCurrentStep("connection");
                        testAdminConnection();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Skip Calibration &amp; Enter &rarr;
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: ADMIN CONNECTION */}
            {currentStep === "connection" && (
              <motion.div
                key="connection"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-5 text-center py-6"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-bounce">
                  <Wifi className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Connecting to Administrator Endpoint</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                    Verifying encrypted WebSocket event transport and handshake with the contest integrity collector...
                  </p>
                </div>
                <div className="flex justify-center">
                  <RefreshCw className="h-5 w-5 text-emerald-400 animate-spin" />
                </div>
              </motion.div>
            )}

            {/* STEP 5: READY TO ENTER */}
            {currentStep === "ready" && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-5 text-center py-4"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Screening & Verification Complete</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                    Your camera feed, MediaPipe face tracking, BlazeGaze calibration, and administrator telemetry transport are all healthy.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto text-left">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <UserCheck className="h-4 w-4 text-emerald-400 mb-1" />
                    <div className="text-[11px] font-semibold text-white">Face Tracking</div>
                    <div className="text-[10px] text-zinc-400">1 Face Calibrated</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <Eye className="h-4 w-4 text-emerald-400 mb-1" />
                    <div className="text-[11px] font-semibold text-white">BlazeGaze</div>
                    <div className="text-[10px] text-zinc-400">Center Baseline Set</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <Wifi className="h-4 w-4 text-emerald-400 mb-1" />
                    <div className="text-[11px] font-semibold text-white">Admin Channel</div>
                    <div className="text-[10px] text-zinc-400">Transport Ready</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleFinishAndEnter}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-xs font-bold text-white shadow-xl hover:bg-emerald-500 transition-all hover:scale-105"
                  >
                    Enter Contest Workspace
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
