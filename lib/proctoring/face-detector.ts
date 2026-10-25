import { FaceDetectionResult, NormalizedLandmark } from "./types";
import { estimateHeadPose, isHeadPoseCentered } from "./head-pose";
import { estimateGaze } from "./gaze-estimator";

// Type definitions for dynamic MediaPipe Tasks Vision
type MediaPipeFaceLandmarker = {
  detectForVideo: (
    video: HTMLVideoElement,
    timestampMs: number
  ) => {
    faceLandmarks: Array<Array<{ x: number; y: number; z?: number }>>;
    faceBlendshapes?: unknown[];
    facialTransformationMatrixes?: unknown[];
  };
  close: () => void;
};

let landmarkerInstance: MediaPipeFaceLandmarker | null = null;
let isLoadingLandmarker = false;
let landmarkerFailed = false;

/**
 * Initializes the MediaPipe Face Landmarker with WASM fileset.
 * Gracefully falls back to canvas-heuristic analysis if WASM assets fail to load.
 */
export async function initializeFaceLandmarker(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (landmarkerInstance) return true;
  if (landmarkerFailed) return false;
  if (isLoadingLandmarker) return false;

  isLoadingLandmarker = true;
  try {
    const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.1/wasm"
    );

    landmarkerInstance = (await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
      runningMode: "VIDEO",
      numFaces: 3, // Detect up to 3 faces to catch MULTIPLE_FACES
      minFaceDetectionConfidence: 0.5,
      minFacePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })) as unknown as MediaPipeFaceLandmarker;

    isLoadingLandmarker = false;
    return true;
  } catch (error) {
    console.warn(
      "[Mindflare Proctoring] MediaPipe FaceLandmarker load failed, switching to native heuristic fallback:",
      error
    );
    landmarkerFailed = true;
    isLoadingLandmarker = false;
    return false;
  }
}

/** Production indicators require actual model output; a failed model never becomes a heuristic face report. */
export function observeFaceFromVideo(video:HTMLVideoElement):{face_count:number;gaze_away:boolean}|null {
  if(!landmarkerInstance||landmarkerFailed||video.readyState<2||!video.videoWidth)return null;
  try {
    const result=landmarkerInstance.detectForVideo(video,performance.now());
    const landmarks=result.faceLandmarks[0] as NormalizedLandmark[]|undefined;
    return {face_count:Math.min(result.faceLandmarks.length,3),gaze_away:landmarks
      ?estimateGaze(landmarks,estimateHeadPose(landmarks)).direction!=="center":false};
  }catch{return null;}
}

/**
 * Detects face, head pose, and gaze from a video frame.
 */
export function detectFaceFromVideo(
  video: HTMLVideoElement,
  timestampMs: number = Date.now()
): FaceDetectionResult {
  if (!video || video.readyState < 2 || video.videoWidth === 0) {
    return createEmptyResult();
  }

  // 1. If MediaPipe FaceLandmarker is initialized, use it
  if (landmarkerInstance && !landmarkerFailed) {
    try {
      const results = landmarkerInstance.detectForVideo(video, timestampMs);
      const faceCount = results.faceLandmarks.length;

      if (faceCount === 0) {
        return createEmptyResult();
      }

      const primaryLandmarks = results.faceLandmarks[0] as NormalizedLandmark[];
      const headPose = estimateHeadPose(primaryLandmarks);
      const { direction: gazeDirection, ratio: irisGazeRatio } = estimateGaze(primaryLandmarks, headPose);
      const isCentered = isHeadPoseCentered(headPose) && gazeDirection === "center";

      // Calculate approximate bounding box from landmarks
      let minX = 1, minY = 1, maxX = 0, maxY = 0;
      for (const pt of primaryLandmarks) {
        if (pt.x < minX) minX = pt.x;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.y > maxY) maxY = pt.y;
      }

      return {
        faceCount,
        landmarks: primaryLandmarks,
        headPose,
        gazeDirection,
        irisGazeRatio,
        isCentered,
        confidence: 0.94,
        faceBox: {
          x: Math.max(0, minX - 0.05),
          y: Math.max(0, minY - 0.05),
          width: Math.min(1, maxX - minX + 0.1),
          height: Math.min(1, maxY - minY + 0.1),
        },
      };
    } catch {
      // Fall through to heuristic fallback
    }
  }

  // 2. Native Canvas Heuristic Fallback (Skin-tone & feature luminosity analysis)
  return analyzeVideoFrameHeuristic(video);
}

/**
 * Fast, lightweight client-side heuristic face analyzer that runs completely in-memory
 * without external network or WASM assets. Evaluates center luminosity and skin-tone density.
 */
function analyzeVideoFrameHeuristic(video: HTMLVideoElement): FaceDetectionResult {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 48;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return createEmptyResult();

    ctx.drawImage(video, 0, 0, 64, 48);
    const imgData = ctx.getImageData(0, 0, 64, 48).data;

    let skinPixels = 0;
    let centerXSum = 0;
    let centerYSum = 0;
    let totalBrightness = 0;

    for (let y = 0; y < 48; y++) {
      for (let x = 0; x < 64; x++) {
        const idx = (y * 64 + x) * 4;
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;

        // Basic human skin tone heuristic in RGB space
        if (r > 60 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 12) {
          skinPixels++;
          centerXSum += x;
          centerYSum += y;
        }
      }
    }

    const avgBrightness = totalBrightness / (64 * 48);
    // Camera occluded / dark frame check
    if (avgBrightness < 15) {
      return {
        faceCount: 0,
        headPose: { pitch: 0, yaw: 0, roll: 0 },
        gazeDirection: "center",
        irisGazeRatio: { x: 0.5, y: 0.5 },
        isCentered: false,
        confidence: 0.2,
      };
    }

    // A human face at standard laptop distance occupies roughly 8% - 60% of frame pixels
    const skinRatio = skinPixels / (64 * 48);
    if (skinRatio < 0.07) {
      return createEmptyResult();
    }

    const normCenterX = centerXSum / (skinPixels * 64);
    const normCenterY = centerYSum / (skinPixels * 48);

    // Approximate yaw/pitch from center of mass relative to optical axis (0.5, 0.5)
    const yaw = Math.round((normCenterX - 0.5) * 60);
    const pitch = Math.round((normCenterY - 0.5) * 50);
    const headPose = { pitch, yaw, roll: 0 };

    let gazeDirection: "center" | "left" | "right" | "up" | "down" = "center";
    if (yaw < -18) gazeDirection = "left";
    else if (yaw > 18) gazeDirection = "right";
    else if (pitch < -16) gazeDirection = "up";
    else if (pitch > 16) gazeDirection = "down";

    const isCentered = Math.abs(yaw) < 18 && Math.abs(pitch) < 16;

    return {
      faceCount: skinRatio > 0.65 ? 2 : 1,
      headPose,
      gazeDirection,
      irisGazeRatio: { x: 0.5 + (yaw / 90) * 0.3, y: 0.5 + (pitch / 90) * 0.3 },
      isCentered,
      confidence: 0.82,
      faceBox: {
        x: Math.max(0, normCenterX - 0.2),
        y: Math.max(0, normCenterY - 0.25),
        width: 0.4,
        height: 0.5,
      },
    };
  } catch {
    return createEmptyResult();
  }
}

function createEmptyResult(): FaceDetectionResult {
  return {
    faceCount: 0,
    headPose: { pitch: 0, yaw: 0, roll: 0 },
    gazeDirection: "center",
    irisGazeRatio: { x: 0.5, y: 0.5 },
    isCentered: false,
    confidence: 0,
  };
}

export function releaseFaceLandmarker(): void {
  if (landmarkerInstance) {
    try {
      landmarkerInstance.close();
    } catch {
      // ignore
    }
    landmarkerInstance = null;
  }
  isLoadingLandmarker = false;
}
