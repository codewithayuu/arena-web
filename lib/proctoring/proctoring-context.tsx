"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  DEFAULT_PROCTORING_CONFIG,
  FaceDetectionResult,
  ProctoringConfig,
  ProctoringEventPayload,
  ProctoringHeartbeatPayload,
} from "./types";
import { detectFaceFromVideo, initializeFaceLandmarker, releaseFaceLandmarker } from "./face-detector";
import { AnomalyEngineState, ProctoringAnomalyEngine } from "./anomaly-engine";
import { AdminProctoringTransport, TransportMetrics } from "./admin-transport";

interface ProctoringContextValue {
  isConfigured: boolean;
  isModelReady: boolean;
  isMonitoring: boolean;
  isScreeningPassed: boolean;
  integrityScore: number;
  latestDetection: FaceDetectionResult | null;
  engineState: AnomalyEngineState | null;
  transportMetrics: TransportMetrics | null;
  recentEvents: ProctoringEventPayload[];
  activeStream: MediaStream | null;
  videoElement: HTMLVideoElement | null;
  setVideoElement: (el: HTMLVideoElement | null) => void;
  startMonitoring: (stream: MediaStream | null, contestId: string, sessionId: string, participantId: string) => Promise<void>;
  stopMonitoring: () => void;
  markScreeningPassed: () => void;
  triggerSimulatedEvent: (eventType: string) => void;
}

const ProctoringContext = createContext<ProctoringContextValue | null>(null);

export function ProctoringProvider({
  children,
  config = DEFAULT_PROCTORING_CONFIG,
}: {
  children: React.ReactNode;
  config?: ProctoringConfig;
}) {
  const [isModelReady, setIsModelReady] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isScreeningPassed, setIsScreeningPassed] = useState(false);
  const [latestDetection, setLatestDetection] = useState<FaceDetectionResult | null>(null);
  const [engineState, setEngineState] = useState<AnomalyEngineState | null>(null);
  const [transportMetrics, setTransportMetrics] = useState<TransportMetrics | null>(null);
  const [recentEvents, setRecentEvents] = useState<ProctoringEventPayload[]>([]);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const engineRef = useRef<ProctoringAnomalyEngine | null>(null);
  const transportRef = useRef<AdminProctoringTransport | null>(null);
  const loopIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatSeqRef = useRef<number>(0);

  // Initialize face landmarker model on mount
  useEffect(() => {
    if (!config.enabled) return;
    let mounted = true;
    initializeFaceLandmarker().then((ready) => {
      if (mounted) {
        setIsModelReady(ready);
      }
    });

    return () => {
      mounted = false;
      releaseFaceLandmarker();
    };
  }, [config.enabled]);

  const setVideoElement = useCallback((el: HTMLVideoElement | null) => {
    videoElementRef.current = el;
  }, []);

  const markScreeningPassed = useCallback(() => {
    setIsScreeningPassed(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
    if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);

    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
      setActiveStream(null);
    }

    if (transportRef.current) {
      transportRef.current.disconnect();
      transportRef.current = null;
    }

    setIsMonitoring(false);
  }, [activeStream]);

  const startMonitoring = useCallback(
    async (stream: MediaStream | null, contestId: string, sessionId: string, participantId: string) => {
      stopMonitoring();
      if (stream) {
        setActiveStream(stream);
      }

      // Initialize transport
      const transport = new AdminProctoringTransport(config.adminWsUrl || "ws://127.0.0.1:8765");
      transport.connect();
      transportRef.current = transport;

      // Initialize anomaly evaluation engine
      const engine = new ProctoringAnomalyEngine(contestId, sessionId, participantId, config);
      engineRef.current = engine;
      setEngineState(engine.getState());

      // Send initial PROCTORING_INITIALIZED event
      const initEvent: ProctoringEventPayload = {
        schema_version: 1,
        event_id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `init-${Date.now()}`,
        contest_id: contestId,
        session_id: sessionId,
        participant_id: participantId,
        seq: 1,
        client_time: new Date().toISOString(),
        event_type: "PROCTORING_INITIALIZED",
        severity: "info",
        model_name: "MediaPipe-FaceLandmarker+BlazeGaze",
        notes: stream
          ? "Camera feed and local client-side ML proctoring initialized"
          : "Client-side proctoring engine active in simulated test mode",
      };
      transport.sendEvent(initEvent);
      setRecentEvents([initEvent]);

      setIsMonitoring(true);

      // Start inference loop at throttled interval (e.g. 200ms -> 5 FPS)
      loopIntervalRef.current = setInterval(async () => {
        const video = videoElementRef.current;
        let detection: FaceDetectionResult;
        if (!video || video.readyState < 2) {
          if (!stream) {
            detection = {
              faceCount: 1,
              isCentered: true,
              gazeDirection: "center",
              headPose: { yaw: 0, pitch: 0, roll: 0 },
              irisGazeRatio: { x: 0.5, y: 0.5 },
              confidence: 0.99,
            };
            setLatestDetection(detection);
          } else {
            return;
          }
        } else {
          detection = detectFaceFromVideo(video);
          setLatestDetection(detection);
        }

        // Track tab/window focus
        const screenFocused = typeof document !== "undefined" ? !document.hidden : true;

        if (engineRef.current) {
          const generatedEvents = await engineRef.current.evaluateObservation(
            detection,
            screenFocused,
            video
          );

          if (generatedEvents.length > 0) {
            for (const ev of generatedEvents) {
              transport.sendEvent(ev);
            }
            setRecentEvents((prev) => [...generatedEvents, ...prev].slice(0, 30));
          }

          setEngineState(engineRef.current.getState());
        }

        setTransportMetrics(transport.getMetrics());
      }, config.sampleIntervalMs);

      // Start periodic heartbeat loop (every 4000ms)
      heartbeatIntervalRef.current = setInterval(() => {
        if (!engineRef.current || !transportRef.current) return;
        heartbeatSeqRef.current++;

        const currentEngineState = engineRef.current.getState();
        const currentDet = latestDetection || {
          headPose: { pitch: 0, yaw: 0, roll: 0 },
          gazeDirection: "center" as const,
          faceCount: 1,
        };

        const heartbeat: ProctoringHeartbeatPayload = {
          type: "HEARTBEAT",
          schema_version: 1,
          contest_id: contestId,
          session_id: sessionId,
          participant_id: participantId,
          client_time: new Date().toISOString(),
          seq: heartbeatSeqRef.current,
          integrity_score: currentEngineState.integrityScore,
          head_pose: currentDet.headPose,
          gaze_direction: currentDet.gazeDirection,
          face_detected: currentEngineState.isFaceCurrentlyTracked,
          face_count: currentDet.faceCount,
          screen_focused: typeof document !== "undefined" ? !document.hidden : true,
          status: currentEngineState.activeStatus,
        };

        transportRef.current.sendHeartbeat(heartbeat);
        setTransportMetrics(transportRef.current.getMetrics());
      }, config.heartbeatIntervalMs);
    },
    [config, latestDetection, stopMonitoring]
  );

  const triggerSimulatedEvent = useCallback((eventType: string) => {
    if (!transportRef.current) return;
    const ev: ProctoringEventPayload = {
      schema_version: 1,
      event_id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `sim-${Date.now()}`,
      contest_id: "dead10c2-2026-4000-8000-000000000026",
      session_id: "session-demo-01",
      seq: 999,
      client_time: new Date().toISOString(),
      event_type: eventType as any,
      severity: eventType.includes("ADDITIONAL") ? "urgent" : "review",
      confidence: 0.92,
      observed_duration_seconds: 4.5,
      notes: "Simulated verification incident",
    };
    transportRef.current.sendEvent(ev);
    setRecentEvents((prev) => [ev, ...prev].slice(0, 30));
  }, []);

  return (
    <ProctoringContext.Provider
      value={{
        isConfigured: config.enabled,
        isModelReady,
        isMonitoring,
        isScreeningPassed,
        integrityScore: engineState?.integrityScore ?? 100,
        latestDetection,
        engineState,
        transportMetrics,
        recentEvents,
        activeStream,
        videoElement: videoElementRef.current,
        setVideoElement,
        startMonitoring,
        stopMonitoring,
        markScreeningPassed,
        triggerSimulatedEvent,
      }}
    >
      {children}
    </ProctoringContext.Provider>
  );
}

export function useProctoring() {
  const context = useContext(ProctoringContext);
  if (!context) {
    throw new Error("useProctoring must be used within a ProctoringProvider");
  }
  return context;
}
