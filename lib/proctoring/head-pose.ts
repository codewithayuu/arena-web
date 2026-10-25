import { HeadPose, NormalizedLandmark } from "./types";

/**
 * Robust Head Pose Estimator from 2D/3D Facial Landmarks.
 * Uses standard facial geometry indices from MediaPipe Face Mesh.
 *
 * Key Landmark Indices (MediaPipe Face Mesh 468/478):
 * - Nose tip: 1
 * - Chin: 152
 * - Left eye outer corner: 33
 * - Right eye outer corner: 263
 * - Forehead / Glabella: 10
 * - Mouth corner left: 61
 * - Mouth corner right: 291
 */
export function estimateHeadPose(landmarks: NormalizedLandmark[]): HeadPose {
  if (!landmarks || landmarks.length < 300) {
    return { pitch: 0, yaw: 0, roll: 0 };
  }

  const nose = landmarks[1];
  const chin = landmarks[152];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  const forehead = landmarks[10];

  if (!nose || !chin || !leftEye || !rightEye || !forehead) {
    return { pitch: 0, yaw: 0, roll: 0 };
  }

  // 1. Roll: Angle between the two outer eye corners
  const eyeDx = rightEye.x - leftEye.x;
  const eyeDy = rightEye.y - leftEye.y;
  const rollRad = Math.atan2(eyeDy, eyeDx);
  const rollDeg = (rollRad * 180) / Math.PI;

  // 2. Yaw: Relative horizontal position of the nose tip between eyes
  const eyeMidX = (leftEye.x + rightEye.x) / 2;
  const eyeSpan = Math.max(0.001, Math.abs(eyeDx));
  // Normalized horizontal nose displacement from center of eye line
  const yawRatio = (nose.x - eyeMidX) / (eyeSpan / 2);
  // Scale ratio to estimated degrees (-90 to +90 clamp)
  const yawDeg = Math.max(-90, Math.min(90, yawRatio * 45));

  // 3. Pitch: Relative vertical position of nose tip between forehead and chin
  const faceHeight = Math.max(0.001, chin.y - forehead.y);
  // An anatomically neutral resting nose tip sits at roughly 42-45% between forehead and chin
  const expectedNoseY = forehead.y + faceHeight * 0.42;
  const pitchRatio = (nose.y - expectedNoseY) / (faceHeight * 0.4);
  const pitchDeg = Math.max(-90, Math.min(90, pitchRatio * 50));

  return {
    pitch: Math.round(pitchDeg * 10) / 10,
    yaw: Math.round(yawDeg * 10) / 10,
    roll: Math.round(rollDeg * 10) / 10,
  };
}

/**
 * Evaluates whether the head orientation is within standard on-screen tolerances.
 */
export function isHeadPoseCentered(pose: HeadPose): boolean {
  const YAW_TOLERANCE = 22;   // degrees looking left or right
  const PITCH_TOLERANCE = 20; // degrees looking up or down
  const ROLL_TOLERANCE = 25;  // degrees tilting head

  return (
    Math.abs(pose.yaw) <= YAW_TOLERANCE &&
    Math.abs(pose.pitch) <= PITCH_TOLERANCE &&
    Math.abs(pose.roll) <= ROLL_TOLERANCE
  );
}
