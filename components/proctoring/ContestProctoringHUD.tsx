"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Camera,
  Eye,
  Wifi,
  WifiOff,
  AlertTriangle,
  Terminal,
  Activity,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import { useProctoring } from "@/lib/proctoring/proctoring-context";
import { FaceMeshOverlay } from "./FaceMeshOverlay";

export function ContestProctoringHUD() {
  const {
    isMonitoring,
    integrityScore,
    latestDetection,
    engineState,
    transportMetrics,
    recentEvents,
    activeStream,
    setVideoElement,
    triggerSimulatedEvent,
  } = useProctoring();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdminInspector, setShowAdminInspector] = useState(false);

  if (!isMonitoring) return null;

  const scoreColor =
    integrityScore >= 85
      ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
      : integrityScore >= 60
      ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
      : "text-rose-400 border-rose-500/40 bg-rose-500/10";

  const isConnected = transportMetrics?.connectionState === "connected";
  const gazeStatus = latestDetection?.gazeDirection ?? "center";
  const faceDetected = (latestDetection?.faceCount ?? 0) > 0;

  return (
    <>
      {/* Floating Proctoring HUD (Top-Right of screen) */}
      <aside aria-label="Contest Proctoring Status" className="fixed top-20 right-6 z-40 flex flex-col items-end gap-2">
        <motion.div
          layout
          className="flex items-center gap-2.5 rounded-full border border-white/10 bg-zinc-950/90 backdrop-blur-md px-3.5 py-1.5 shadow-xl"
        >
          {/* Integrity Ring Badge */}
          <div className="flex items-center gap-1.5">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[10px] font-bold ${scoreColor}`}
            >
              {Math.round(integrityScore)}
            </div>
            <span className="text-[11px] font-semibold text-zinc-200">Integrity</span>
          </div>

          <div className="h-3 w-[1px] bg-white/10" />

          {/* Gaze / Face Status Indicator */}
          <div className="flex items-center gap-1 text-[11px]">
            {!faceDetected ? (
              <span className="flex items-center gap-1 text-rose-400 font-medium animate-pulse">
                <AlertTriangle className="h-3.5 w-3.5" />
                No Face
              </span>
            ) : gazeStatus !== "center" ? (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Eye className="h-3.5 w-3.5" />
                Looking {gazeStatus}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                Focused
              </span>
            )}
          </div>

          <div className="h-3 w-[1px] bg-white/10" />

          {/* Connection Status Indicator */}
          <div
            className="flex items-center gap-1 text-[11px]"
            title={isConnected ? "Admin WSS Connected" : "Telemetry Buffered Locally"}
          >
            {isConnected ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Wifi className="h-3 w-3" />
                Admin WSS
              </span>
            ) : (
              <span className="flex items-center gap-1 text-zinc-400 font-medium">
                <WifiOff className="h-3 w-3" />
                Buffered
              </span>
            )}
          </div>

          {/* Toggle Mini-Camera Preview */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors ml-1"
            title={isExpanded ? "Collapse camera preview" : "Expand camera preview"}
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </motion.div>

        {/* Collapsible Mini-Video Preview Card */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="w-64 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-md"
            >
              <div className="relative aspect-[4/3] w-full bg-black">
                <video
                  ref={(el) => {
                    if (el && activeStream && el.srcObject !== activeStream) {
                      el.srcObject = activeStream;
                      setVideoElement(el);
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover transform -scale-x-100"
                />
                <FaceMeshOverlay detection={latestDetection} width={256} height={192} />

                {/* Privacy Badge */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 text-[10px] text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Local AI only
                </div>
              </div>

              {/* Stats Footer */}
              <div className="p-3 border-t border-white/10 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
                  <div>
                    <span className="text-zinc-500">Head Yaw:</span>{" "}
                    <span className="font-mono text-zinc-200">{latestDetection?.headPose.yaw ?? 0}°</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Head Pitch:</span>{" "}
                    <span className="font-mono text-zinc-200">{latestDetection?.headPose.pitch ?? 0}°</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdminInspector(true)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Terminal className="h-3 w-3" />
                    Admin Telemetry Log
                  </button>
                  <span className="text-[10px] text-zinc-500">
                    {transportMetrics?.totalHeartbeatsSent ?? 0} pings
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Admin Telemetry Drawer / Monitor Modal */}
      <AnimatePresence>
        {showAdminInspector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative flex flex-col h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
            >
              {/* Header */}
              <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Terminal className="h-5 w-5 text-red-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Administrator Event & Telemetry Stream</h3>
                    <p className="text-xs text-zinc-400">
                      Direct client-side incident capture & periodic heartbeat payloads
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminInspector(false)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5"
                  >
                    Close
                  </button>
                </div>
              </header>

              {/* Simulation Testing Buttons */}
              <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.02] px-5 py-2.5">
                <span className="text-xs text-zinc-400 font-medium mr-1">Simulate Incident:</span>
                <button
                  type="button"
                  onClick={() => triggerSimulatedEvent("SUSTAINED_OFF_SCREEN_GAZE")}
                  className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20"
                >
                  Off-Screen Gaze
                </button>
                <button
                  type="button"
                  onClick={() => triggerSimulatedEvent("FACE_NOT_DETECTED")}
                  className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/20"
                >
                  Face Missing
                </button>
                <button
                  type="button"
                  onClick={() => triggerSimulatedEvent("ADDITIONAL_FACE_DETECTED")}
                  className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[11px] font-semibold text-purple-300 hover:bg-purple-500/20"
                >
                  Multiple Faces
                </button>
              </div>

              {/* Events List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 font-mono text-xs">
                {recentEvents.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    No anomaly incidents logged yet. Session is running clean.
                  </div>
                ) : (
                  recentEvents.map((ev, index) => (
                    <div
                      key={ev.event_id || index}
                      className={`rounded-xl border p-3.5 space-y-2 ${
                        ev.severity === "urgent"
                          ? "border-rose-500/30 bg-rose-500/5 text-rose-200"
                          : ev.severity === "review"
                          ? "border-amber-500/30 bg-amber-500/5 text-amber-200"
                          : "border-white/10 bg-white/[0.02] text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold tracking-wide">{ev.event_type}</span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(ev.client_time).toLocaleTimeString()}
                        </span>
                      </div>
                      {ev.notes && <p className="text-[11px] text-zinc-400 font-sans">{ev.notes}</p>}
                      <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                        <span>Seq: #{ev.seq}</span>
                        <span>Severity: {ev.severity}</span>
                        {ev.observed_duration_seconds && (
                          <span>Duration: {ev.observed_duration_seconds}s</span>
                        )}
                        {ev.evidence_sha256 && (
                          <span title={ev.evidence_sha256}>
                            SHA: {ev.evidence_sha256.slice(0, 12)}…
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
