import {
  FaceDetectionResult,
  ProctoringConfig,
  ProctoringEventPayload,
  ProctoringEventType,
} from "./types";

export interface AnomalyEngineState {
  integrityScore: number;
  offScreenGazeDurationMs: number;
  faceMissingDurationMs: number;
  multipleFacesDurationMs: number;
  screenBlurDurationMs: number;
  lastCleanTimestampMs: number;
  isFaceCurrentlyTracked: boolean;
  activeStatus: "NORMAL" | "WARNING" | "FLAGGED";
}

export class ProctoringAnomalyEngine {
  private config: ProctoringConfig;
  private contestId: string;
  private sessionId: string;
  private participantId: string;

  private state: AnomalyEngineState;
  private lastSampleTimestampMs: number = 0;
  private lastGazeEventTriggerMs: number = 0;
  private lastFaceMissingEventTriggerMs: number = 0;
  private lastMultiFaceEventTriggerMs: number = 0;
  private lastScreenBlurEventTriggerMs: number = 0;

  private eventSequence: number = 0;

  constructor(
    contestId: string,
    sessionId: string,
    participantId: string,
    config: ProctoringConfig
  ) {
    this.contestId = contestId;
    this.sessionId = sessionId;
    this.participantId = participantId;
    this.config = config;

    this.state = {
      integrityScore: 100,
      offScreenGazeDurationMs: 0,
      faceMissingDurationMs: 0,
      multipleFacesDurationMs: 0,
      screenBlurDurationMs: 0,
      lastCleanTimestampMs: 0,
      isFaceCurrentlyTracked: true,
      activeStatus: "NORMAL",
    };
  }

  public getState(): AnomalyEngineState {
    return { ...this.state };
  }

  public getIntegrityScore(): number {
    return this.state.integrityScore;
  }

  /**
   * Processes a single detection observation and evaluates temporal anomalies.
   * Returns generated event payloads if thresholds were crossed.
   */
  public async evaluateObservation(
    detection: FaceDetectionResult,
    screenFocused: boolean,
    videoElement?: HTMLVideoElement | null,
    nowMs: number = Date.now()
  ): Promise<ProctoringEventPayload[]> {
    if (this.lastSampleTimestampMs === 0) {
      this.lastSampleTimestampMs = nowMs;
      this.state.lastCleanTimestampMs = nowMs;
    }
    const deltaMs = Math.max(0, nowMs - this.lastSampleTimestampMs);
    this.lastSampleTimestampMs = nowMs;

    const events: ProctoringEventPayload[] = [];
    let isCleanSample = true;

    // 1. Evaluate Face Presence & Multi-face Tracking
    if (detection.faceCount === 0) {
      isCleanSample = false;
      this.state.faceMissingDurationMs += deltaMs;

      // Check if threshold exceeded for FACE_NOT_DETECTED
      const thresholdMs = this.config.faceMissingThresholdSeconds * 1000;
      if (
        this.state.faceMissingDurationMs >= thresholdMs &&
        (this.lastFaceMissingEventTriggerMs === 0 || nowMs - this.lastFaceMissingEventTriggerMs > 12_000)
      ) {
        this.lastFaceMissingEventTriggerMs = nowMs;
        const evidence = await this.captureEvidenceFrame(videoElement);
        events.push(
          this.createEvent({
            eventType: "FACE_NOT_DETECTED",
            severity: "review",
            confidence: 0.9,
            durationSeconds: Math.round((this.state.faceMissingDurationMs / 1000) * 10) / 10,
            notes: "Participant face not visible in camera frame",
            ...evidence,
          })
        );
        this.state.isFaceCurrentlyTracked = false;
      }
    } else {
      // Face was previously missing and is now restored
      if (!this.state.isFaceCurrentlyTracked && this.state.faceMissingDurationMs > 2000) {
        events.push(
          this.createEvent({
            eventType: "FACE_TRACKING_RESTORED",
            severity: "info",
            confidence: 0.95,
            notes: "Participant face tracking restored; monitoring resumed",
          })
        );
      }
      this.state.isFaceCurrentlyTracked = true;
      this.state.faceMissingDurationMs = 0;

      // Multi-face detection (ADDITIONAL_FACE_DETECTED / MULTIPLE_FACES)
      if (detection.faceCount > 1) {
        isCleanSample = false;
        this.state.multipleFacesDurationMs += deltaMs;

        const multiThresholdMs = this.config.multipleFacesThresholdSeconds * 1000;
        if (
          this.state.multipleFacesDurationMs >= multiThresholdMs &&
          (this.lastMultiFaceEventTriggerMs === 0 || nowMs - this.lastMultiFaceEventTriggerMs > 12_000)
        ) {
          this.lastMultiFaceEventTriggerMs = nowMs;
          const evidence = await this.captureEvidenceFrame(videoElement);
          events.push(
            this.createEvent({
              eventType: "ADDITIONAL_FACE_DETECTED",
              severity: "urgent",
              confidence: 0.88,
              durationSeconds: Math.round((this.state.multipleFacesDurationMs / 1000) * 10) / 10,
              notes: `${detection.faceCount} distinct faces detected in frame`,
              ...evidence,
            })
          );
        }
      } else {
        this.state.multipleFacesDurationMs = 0;
      }

      // 2. Evaluate Gaze & Head Orientation
      if (!detection.isCentered || detection.gazeDirection !== "center") {
        isCleanSample = false;
        this.state.offScreenGazeDurationMs += deltaMs;

        const gazeThresholdMs = this.config.gazeThresholdSeconds * 1000;
        if (
          this.state.offScreenGazeDurationMs >= gazeThresholdMs &&
          (this.lastGazeEventTriggerMs === 0 || nowMs - this.lastGazeEventTriggerMs > 12_000)
        ) {
          this.lastGazeEventTriggerMs = nowMs;
          const evidence = await this.captureEvidenceFrame(videoElement);
          events.push(
            this.createEvent({
              eventType: "SUSTAINED_OFF_SCREEN_GAZE",
              severity: "review",
              confidence: detection.confidence,
              durationSeconds: Math.round((this.state.offScreenGazeDurationMs / 1000) * 10) / 10,
              notes: `Sustained gaze direction: ${detection.gazeDirection} (yaw: ${detection.headPose.yaw}°, pitch: ${detection.headPose.pitch}°)`,
              ...evidence,
            })
          );
        }
      } else {
        this.state.offScreenGazeDurationMs = 0;
      }
    }

    // 3. Evaluate Screen / Window Integrity (Tab switch / blur)
    if (!screenFocused) {
      isCleanSample = false;
      this.state.screenBlurDurationMs += deltaMs;

      if (
        this.state.screenBlurDurationMs >= 2000 &&
        (this.lastScreenBlurEventTriggerMs === 0 || nowMs - this.lastScreenBlurEventTriggerMs > 15_000)
      ) {
        this.lastScreenBlurEventTriggerMs = nowMs;
        events.push(
          this.createEvent({
            eventType: "SCREEN_INTEGRITY",
            severity: "review",
            confidence: 1.0,
            durationSeconds: Math.round((this.state.screenBlurDurationMs / 1000) * 10) / 10,
            notes: "Participant switched tabs or browser window lost focus",
          })
        );
      }
    } else {
      this.state.screenBlurDurationMs = 0;
    }

    // 4. Update Dynamic Integrity Score
    this.updateIntegrityScore(isCleanSample, deltaMs, nowMs);

    return events;
  }

  private updateIntegrityScore(isCleanSample: boolean, deltaMs: number, nowMs: number) {
    if (isCleanSample) {
      // Reward clean behavior: +1 point every 3000ms of clean participation
      if (nowMs - this.state.lastCleanTimestampMs > 3000 && this.state.integrityScore < 100) {
        this.state.integrityScore = Math.min(100, this.state.integrityScore + 1);
        this.state.lastCleanTimestampMs = nowMs;
      }
    } else {
      this.state.lastCleanTimestampMs = nowMs;

      // Penalties proportional to persistence
      let penalty = 0;
      if (this.state.faceMissingDurationMs > 3000) penalty += 0.25;
      if (this.state.multipleFacesDurationMs > 2000) penalty += 0.5;
      if (this.state.offScreenGazeDurationMs > 3000) penalty += 0.2;
      if (this.state.screenBlurDurationMs > 2000) penalty += 0.35;

      this.state.integrityScore = Math.max(0, Math.round((this.state.integrityScore - penalty) * 10) / 10);
    }

    // Categorize status
    if (this.state.integrityScore >= 85) {
      this.state.activeStatus = "NORMAL";
    } else if (this.state.integrityScore >= 60) {
      this.state.activeStatus = "WARNING";
    } else {
      this.state.activeStatus = "FLAGGED";
    }
  }

  /**
   * Captures a single downscaled snapshot JPEG on sustained anomaly.
   * Discards frames otherwise.
   */
  private async captureEvidenceFrame(
    video?: HTMLVideoElement | null
  ): Promise<{ evidence_base64?: string; evidence_sha256?: string }> {
    if (!this.config.captureEvidenceOnAnomaly || !video || video.readyState < 2 || video.videoWidth === 0) {
      return {};
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 480;
      canvas.height = 360;
      const ctx = canvas.getContext("2d");
      if (!ctx) return {};

      ctx.drawImage(video, 0, 0, 480, 360);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.72);

      // Compute SHA-256 of the image base64 data
      let hash = "";
      if (typeof window !== "undefined" && window.crypto?.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(dataUrl);
        const digest = await window.crypto.subtle.digest("SHA-256", data);
        hash = Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      }

      return {
        evidence_base64: dataUrl,
        evidence_sha256: hash,
      };
    } catch {
      return {};
    }
  }

  private createEvent(params: {
    eventType: ProctoringEventType;
    severity: "info" | "review" | "urgent";
    confidence?: number;
    durationSeconds?: number;
    evidence_base64?: string;
    evidence_sha256?: string;
    notes?: string;
  }): ProctoringEventPayload {
    this.eventSequence++;
    const eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    return {
      schema_version: 1,
      event_id: eventId,
      contest_id: this.contestId,
      session_id: this.sessionId,
      participant_id: this.participantId,
      seq: this.eventSequence,
      client_time: new Date().toISOString(),
      event_type: params.eventType,
      severity: params.severity,
      model_name: "MediaPipe-FaceLandmarker+BlazeGaze",
      confidence: params.confidence ?? 0.85,
      observed_duration_seconds: params.durationSeconds,
      evidence_base64: params.evidence_base64,
      evidence_sha256: params.evidence_sha256,
      delivery: "queued_encrypted",
      review_status: "new",
      notes: params.notes,
    };
  }
}
