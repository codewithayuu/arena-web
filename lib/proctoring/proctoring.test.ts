import assert from "node:assert/strict";
import test, { describe, it } from "node:test";
import { estimateHeadPose, isHeadPoseCentered } from "./head-pose";
import { estimateGaze } from "./gaze-estimator";
import { ProctoringAnomalyEngine } from "./anomaly-engine";
import { DEFAULT_PROCTORING_CONFIG, FaceDetectionResult, NormalizedLandmark } from "./types";
import { AdminProctoringTransport } from "./admin-transport";

function createMockLandmarks(yawOffset = 0, pitchOffset = 0): NormalizedLandmark[] {
  const landmarks: NormalizedLandmark[] = [];
  for (let i = 0; i < 480; i++) {
    landmarks.push({ x: 0.5, y: 0.5, z: 0 });
  }

  // Key indices:
  // Nose tip: 1
  landmarks[1] = { x: 0.5 + yawOffset, y: 0.5 + pitchOffset, z: -0.05 };
  // Forehead: 10
  landmarks[10] = { x: 0.5, y: 0.25, z: 0 };
  // Chin: 152
  landmarks[152] = { x: 0.5, y: 0.85, z: 0 };
  // Left eye outer: 33
  landmarks[33] = { x: 0.35, y: 0.45, z: 0 };
  // Right eye outer: 263
  landmarks[263] = { x: 0.65, y: 0.45, z: 0 };
  // Left eye inner: 133
  landmarks[133] = { x: 0.43, y: 0.45, z: 0 };
  // Right eye inner: 362
  landmarks[362] = { x: 0.57, y: 0.45, z: 0 };
  // Left iris: 468
  landmarks[468] = { x: 0.39, y: 0.45, z: 0 };
  // Right iris: 473
  landmarks[473] = { x: 0.61, y: 0.45, z: 0 };
  // Left eye top/bottom
  landmarks[159] = { x: 0.39, y: 0.43, z: 0 };
  landmarks[145] = { x: 0.39, y: 0.47, z: 0 };
  // Right eye top/bottom
  landmarks[386] = { x: 0.61, y: 0.43, z: 0 };
  landmarks[374] = { x: 0.61, y: 0.47, z: 0 };

  return landmarks;
}

describe("Head Pose Estimation", () => {
  it("computes approximately zero yaw/pitch/roll for centered face", () => {
    const landmarks = createMockLandmarks(0, 0);
    const pose = estimateHeadPose(landmarks);

    assert.ok(Math.abs(pose.yaw) <= 5);
    assert.ok(Math.abs(pose.pitch) <= 10);
    assert.ok(Math.abs(pose.roll) <= 5);
    assert.equal(isHeadPoseCentered(pose), true);
  });

  it("detects right-turned head pose", () => {
    const landmarks = createMockLandmarks(0.1, 0); // nose shifted right
    const pose = estimateHeadPose(landmarks);

    assert.ok(pose.yaw > 15);
  });

  it("detects left-turned head pose", () => {
    const landmarks = createMockLandmarks(-0.1, 0); // nose shifted left
    const pose = estimateHeadPose(landmarks);

    assert.ok(pose.yaw < -15);
  });
});

describe("Gaze Estimation", () => {
  it("classifies centered gaze when iris and head are aligned", () => {
    const landmarks = createMockLandmarks(0, 0);
    const headPose = { pitch: 0, yaw: 0, roll: 0 };
    const gaze = estimateGaze(landmarks, headPose);

    assert.equal(gaze.direction, "center");
  });

  it("classifies gaze as left when iris is shifted left", () => {
    const landmarks = createMockLandmarks(0, 0);
    // shift irises towards outer canthus of left eye
    landmarks[468].x = 0.34;
    landmarks[473].x = 0.57;

    const headPose = { pitch: 0, yaw: 0, roll: 0 };
    const gaze = estimateGaze(landmarks, headPose);

    assert.equal(gaze.direction, "left");
  });

  it("classifies gaze as off-screen if head is turned past 25 degrees", () => {
    const landmarks = createMockLandmarks(0, 0);
    const headPose = { pitch: 0, yaw: 30, roll: 0 };
    const gaze = estimateGaze(landmarks, headPose);

    assert.equal(gaze.direction, "right");
  });
});

describe("Proctoring Anomaly Engine", () => {
  const contestId = "dead10c2-2026-4000-8000-000000000026";
  const sessionId = "session-test-01";
  const participantId = "participant-p104";

  it("maintains 100 integrity score under continuous centered observation", async () => {
    const engine = new ProctoringAnomalyEngine(contestId, sessionId, participantId, {
      ...DEFAULT_PROCTORING_CONFIG,
      gazeThresholdSeconds: 3.0,
      faceMissingThresholdSeconds: 3.0,
    });

    const centeredDetection: FaceDetectionResult = {
      faceCount: 1,
      headPose: { pitch: 0, yaw: 0, roll: 0 },
      gazeDirection: "center",
      irisGazeRatio: { x: 0.5, y: 0.5 },
      isCentered: true,
      confidence: 0.95,
    };

    const events = await engine.evaluateObservation(centeredDetection, true, null, 1000);
    assert.equal(events.length, 0);
    assert.equal(engine.getIntegrityScore(), 100);
    assert.equal(engine.getState().activeStatus, "NORMAL");
  });

  it("triggers FACE_NOT_DETECTED and reduces score when face is missing past threshold", async () => {
    const engine = new ProctoringAnomalyEngine(contestId, sessionId, participantId, {
      ...DEFAULT_PROCTORING_CONFIG,
      faceMissingThresholdSeconds: 2.0,
    });

    const missingDetection: FaceDetectionResult = {
      faceCount: 0,
      headPose: { pitch: 0, yaw: 0, roll: 0 },
      gazeDirection: "center",
      irisGazeRatio: { x: 0.5, y: 0.5 },
      isCentered: false,
      confidence: 0,
    };

    // Frame at t=0
    let events = await engine.evaluateObservation(missingDetection, true, null, 1000);
    assert.equal(events.length, 0);

    // Frame at t=2500ms (threshold exceeded: 2.5s >= 2.0s)
    events = await engine.evaluateObservation(missingDetection, true, null, 3500);
    assert.equal(events.length, 1);
    assert.equal(events[0].event_type, "FACE_NOT_DETECTED");
    assert.equal(events[0].severity, "review");

    // Face restored at t=5000ms
    const restoredDetection: FaceDetectionResult = {
      faceCount: 1,
      headPose: { pitch: 0, yaw: 0, roll: 0 },
      gazeDirection: "center",
      irisGazeRatio: { x: 0.5, y: 0.5 },
      isCentered: true,
      confidence: 0.95,
    };
    events = await engine.evaluateObservation(restoredDetection, true, null, 5000);
    assert.equal(events.length, 1);
    assert.equal(events[0].event_type, "FACE_TRACKING_RESTORED");
    assert.equal(events[0].severity, "info");
  });

  it("triggers ADDITIONAL_FACE_DETECTED when multiple faces are sustained", async () => {
    const engine = new ProctoringAnomalyEngine(contestId, sessionId, participantId, {
      ...DEFAULT_PROCTORING_CONFIG,
      multipleFacesThresholdSeconds: 1.5,
    });

    const multiDetection: FaceDetectionResult = {
      faceCount: 2,
      headPose: { pitch: 0, yaw: 0, roll: 0 },
      gazeDirection: "center",
      irisGazeRatio: { x: 0.5, y: 0.5 },
      isCentered: true,
      confidence: 0.9,
    };

    await engine.evaluateObservation(multiDetection, true, null, 1000);
    const events = await engine.evaluateObservation(multiDetection, true, null, 3000);

    assert.equal(events.length, 1);
    assert.equal(events[0].event_type, "ADDITIONAL_FACE_DETECTED");
    assert.equal(events[0].severity, "urgent");
  });

  it("triggers SUSTAINED_OFF_SCREEN_GAZE when gaze is turned away past threshold", async () => {
    const engine = new ProctoringAnomalyEngine(contestId, sessionId, participantId, {
      ...DEFAULT_PROCTORING_CONFIG,
      gazeThresholdSeconds: 2.0,
    });

    const gazeAwayDetection: FaceDetectionResult = {
      faceCount: 1,
      headPose: { pitch: 0, yaw: 30, roll: 0 },
      gazeDirection: "right",
      irisGazeRatio: { x: 0.85, y: 0.5 },
      isCentered: false,
      confidence: 0.92,
    };

    await engine.evaluateObservation(gazeAwayDetection, true, null, 1000);
    const events = await engine.evaluateObservation(gazeAwayDetection, true, null, 3500);

    assert.equal(events.length, 1);
    assert.equal(events[0].event_type, "SUSTAINED_OFF_SCREEN_GAZE");
    assert.equal(events[0].severity, "review");
  });
});

describe("Admin Transport", () => {
  it("enqueues events and handles simulated ACKs in local mode", async () => {
    const transport = new AdminProctoringTransport("ws://127.0.0.1:8765");

    const sampleEvent = {
      schema_version: 1 as const,
      event_id: "evt-test-123",
      contest_id: "dead10c2-2026-4000-8000-000000000026",
      session_id: "session-test",
      seq: 1,
      client_time: new Date().toISOString(),
      event_type: "PROCTORING_INITIALIZED" as const,
      severity: "info" as const,
    };

    transport.sendEvent(sampleEvent);
    const metrics = transport.getMetrics();
    assert.ok(metrics.totalEventsSent >= 1);

    // Wait for simulated ACK
    await new Promise((resolve) => setTimeout(resolve, 200));
    const afterAckMetrics = transport.getMetrics();
    assert.ok(afterAckMetrics.totalEventsAcked >= 1);
    assert.equal(afterAckMetrics.queueDepth, 0);

    transport.disconnect();
  });
});
