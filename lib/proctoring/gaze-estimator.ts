import { GazeDirection, HeadPose, NormalizedLandmark } from "./types";

/**
 * BlazeGaze / Iris-based Gaze Vector & Direction Estimator.
 *
 * MediaPipe Face Mesh Iris Landmark Indices (468-477):
 * Left Eye:
 * - Iris center: 468
 * - Outer canthus: 33
 * - Inner canthus: 133
 * - Upper eyelid: 159
 * - Lower eyelid: 145
 *
 * Right Eye:
 * - Iris center: 473
 * - Inner canthus: 362
 * - Outer canthus: 263
 * - Upper eyelid: 386
 * - Lower eyelid: 374
 */
export function estimateGaze(
  landmarks: NormalizedLandmark[],
  headPose: HeadPose
): { direction: GazeDirection; ratio: { x: number; y: number } } {
  // If head pose itself is significantly turned away, gaze is definitely looking away
  if (headPose.yaw > 25) {
    return { direction: "right", ratio: { x: 0.85, y: 0.5 } };
  }
  if (headPose.yaw < -25) {
    return { direction: "left", ratio: { x: 0.15, y: 0.5 } };
  }
  if (headPose.pitch > 22) {
    return { direction: "down", ratio: { x: 0.5, y: 0.85 } };
  }
  if (headPose.pitch < -22) {
    return { direction: "up", ratio: { x: 0.5, y: 0.15 } };
  }

  // If we have iris landmarks (length >= 474)
  if (landmarks && landmarks.length >= 474) {
    const leftIris = landmarks[468];
    const leftOuter = landmarks[33];
    const leftInner = landmarks[133];
    const leftTop = landmarks[159];
    const leftBottom = landmarks[145];

    const rightIris = landmarks[473];
    const rightInner = landmarks[362];
    const rightOuter = landmarks[263];
    const rightTop = landmarks[386];
    const rightBottom = landmarks[374];

    if (leftIris && leftOuter && leftInner && rightIris && rightInner && rightOuter) {
      // Horizontal iris ratio: 0.0 (left) to 1.0 (right)
      const leftEyeWidth = Math.max(0.001, leftInner.x - leftOuter.x);
      const leftRatioX = (leftIris.x - leftOuter.x) / leftEyeWidth;

      const rightEyeWidth = Math.max(0.001, rightOuter.x - rightInner.x);
      const rightRatioX = (rightIris.x - rightInner.x) / rightEyeWidth;

      const avgRatioX = (leftRatioX + rightRatioX) / 2;

      // Vertical iris ratio: 0.0 (top) to 1.0 (bottom)
      const leftEyeHeight = Math.max(0.001, leftBottom.y - leftTop.y);
      const leftRatioY = (leftIris.y - leftTop.y) / leftEyeHeight;

      const rightEyeHeight = Math.max(0.001, rightBottom.y - rightTop.y);
      const rightRatioY = (rightIris.y - rightTop.y) / rightEyeHeight;

      const avgRatioY = (leftRatioY + rightRatioY) / 2;

      // Classify gaze direction based on eye ratio & head pose combination
      let direction: GazeDirection = "center";

      // Thresholds: Normal center gaze ratio is ~0.42 to 0.58
      if (avgRatioX < 0.34 || headPose.yaw < -16) {
        direction = "left";
      } else if (avgRatioX > 0.66 || headPose.yaw > 16) {
        direction = "right";
      } else if (avgRatioY < 0.30 || headPose.pitch < -16) {
        direction = "up";
      } else if (avgRatioY > 0.70 || headPose.pitch > 16) {
        direction = "down";
      }

      return {
        direction,
        ratio: {
          x: Math.round(avgRatioX * 100) / 100,
          y: Math.round(avgRatioY * 100) / 100,
        },
      };
    }
  }

  // Fallback: If iris landmarks are unavailable, infer gaze primarily from head pose
  let direction: GazeDirection = "center";
  if (headPose.yaw < -18) direction = "left";
  else if (headPose.yaw > 18) direction = "right";
  else if (headPose.pitch < -16) direction = "up";
  else if (headPose.pitch > 16) direction = "down";

  return {
    direction,
    ratio: {
      x: 0.5 + (headPose.yaw / 90) * 0.4,
      y: 0.5 + (headPose.pitch / 90) * 0.4,
    },
  };
}
