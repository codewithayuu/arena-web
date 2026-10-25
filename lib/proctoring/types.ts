/**
 * Client-Side AI Proctoring Types & Protocol Contracts
 * Authoritative schema conformant with contracts/integrity-event.schema.json
 */

export type ProctoringEventType =
  | "PROCTORING_INITIALIZED"
  | "CAMERA_AND_MODELS_READY"
  | "SUSTAINED_OFF_SCREEN_GAZE"
  | "GAZE_AWAY"
  | "FACE_NOT_DETECTED"
  | "FACE_TRACKING_RESTORED"
  | "MULTIPLE_FACES"
  | "ADDITIONAL_FACE_DETECTED"
  | "CAMERA_OCCLUDED"
  | "CAMERA_UNAVAILABLE"
  | "SCREEN_INTEGRITY"
  | "RESTRICTED_PROCESS"
  | "VM_INDICATOR"
  | "CLIENT_DISCONNECTED"
  | "POLICY_MISMATCH"
  | "HEARTBEAT";

export type ProctoringSeverity = "info" | "review" | "urgent";

export type GazeDirection = "center" | "left" | "right" | "up" | "down";

export interface HeadPose {
  pitch: number; // degrees: positive = tilted up, negative = tilted down
  yaw: number;   // degrees: positive = turned right, negative = turned left
  roll: number;  // degrees: positive = tilted clockwise, negative = tilted counter-clockwise
}

export interface NormalizedLandmark {
  x: number;
  y: number;
  z?: number;
}

export interface FaceDetectionResult {
  faceCount: number;
  landmarks?: NormalizedLandmark[];
  headPose: HeadPose;
  gazeDirection: GazeDirection;
  irisGazeRatio: { x: number; y: number };
  isCentered: boolean;
  confidence: number;
  faceBox?: { x: number; y: number; width: number; height: number };
}

export interface ProctoringHeartbeatPayload {
  type: "HEARTBEAT";
  schema_version: 1;
  contest_id: string;
  session_id: string;
  participant_id: string;
  client_time: string;
  seq: number;
  integrity_score: number; // 0 to 100
  head_pose: HeadPose;
  gaze_direction: GazeDirection;
  face_detected: boolean;
  face_count: number;
  screen_focused: boolean;
  status: "NORMAL" | "WARNING" | "FLAGGED";
}

export interface ProctoringEventPayload {
  schema_version: 1;
  event_id: string;
  contest_id: string;
  session_id: string;
  participant_id?: string;
  seq: number;
  client_time: string;
  event_type: ProctoringEventType;
  severity: ProctoringSeverity;
  model_name?: string;
  confidence?: number;
  observed_duration_seconds?: number;
  evidence_sha256?: string;
  evidence_base64?: string; // Captured snapshot for review
  delivery?: "metadata_only" | "queued_encrypted" | "admin_received" | "expired_lost";
  review_status?: "new" | "reviewing" | "dismissed" | "confirmed" | "actioned";
  notes?: string;
}

export interface AdminAckMessage {
  type: "ACK";
  event_id: string;
  seq?: number;
  server_received_at: string;
}

export interface AdminPolicyMessage {
  type: "ADMIN_POLICY_UPDATE";
  gazeThresholdSeconds?: number;
  faceMissingThresholdSeconds?: number;
  multipleFacesThresholdSeconds?: number;
  enabledDetectors?: string[];
}

export type AdminIncomingMessage = AdminAckMessage | AdminPolicyMessage;

export interface ProctoringConfig {
  enabled: boolean;
  sampleIntervalMs: number;            // Interval between frame inferences (default: 200ms -> ~5fps)
  heartbeatIntervalMs: number;         // Interval between heartbeat telemetry messages (default: 4000ms)
  gazeThresholdSeconds: number;        // Continuous off-screen gaze duration to trigger incident (default: 3.5s)
  faceMissingThresholdSeconds: number; // Continuous missing face duration to trigger incident (default: 3.0s)
  multipleFacesThresholdSeconds: number; // Continuous multi-face duration to trigger incident (default: 2.0s)
  adminWsUrl?: string;                 // Target WebSocket endpoint on administrator machine
  captureEvidenceOnAnomaly: boolean;   // Whether to capture single frame JPEG snapshot on sustained anomaly
}

export const DEFAULT_PROCTORING_CONFIG: ProctoringConfig = {
  enabled: true,
  sampleIntervalMs: 200,
  heartbeatIntervalMs: 4000,
  gazeThresholdSeconds: 3.5,
  faceMissingThresholdSeconds: 3.0,
  multipleFacesThresholdSeconds: 2.0,
  adminWsUrl: process.env.NEXT_PUBLIC_ADMIN_WS_URL || "ws://127.0.0.1:8765",
  captureEvidenceOnAnomaly: true,
};
