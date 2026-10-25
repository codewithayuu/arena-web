"use client";

import React, { useEffect, useRef } from "react";
import { FaceDetectionResult } from "@/lib/proctoring/types";

interface FaceMeshOverlayProps {
  detection: FaceDetectionResult | null;
  width?: number;
  height?: number;
  showMesh?: boolean;
  showGazeReticle?: boolean;
}

export function FaceMeshOverlay({
  detection,
  width = 640,
  height = 480,
  showMesh = true,
  showGazeReticle = true,
}: FaceMeshOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Target Oval Frame Guide
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = width * 0.22;
    const radiusY = height * 0.32;

    const isCentered = detection?.isCentered ?? false;
    const hasFace = (detection?.faceCount ?? 0) > 0;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);

    if (!hasFace) {
      ctx.strokeStyle = "rgba(244, 63, 94, 0.4)"; // Rose
    } else if (isCentered) {
      ctx.strokeStyle = "rgba(16, 185, 129, 0.7)"; // Emerald
    } else {
      ctx.strokeStyle = "rgba(245, 158, 11, 0.6)"; // Amber
    }
    ctx.stroke();
    ctx.restore();

    if (!detection || !hasFace) return;

    // 2. Draw Landmark Points & Contours if available
    if (showMesh && detection.landmarks && detection.landmarks.length > 0) {
      ctx.save();
      const pts = detection.landmarks;

      // Draw Key Facial Landmarks (Eyes, Iris, Lips, Nose)
      ctx.fillStyle = isCentered ? "rgba(52, 211, 153, 0.85)" : "rgba(251, 191, 36, 0.85)";

      // Subsampled landmark rendering for crisp 60fps performance
      const keyIndices = [
        1, 33, 263, 61, 291, 199, 10, 152, 234, 454,
        133, 362, 159, 145, 386, 374, 468, 473
      ];

      for (const idx of keyIndices) {
        const pt = pts[idx];
        if (pt) {
          ctx.beginPath();
          ctx.arc(pt.x * width, pt.y * height, idx >= 468 ? 3.5 : 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Iris Centers with glowing cyan dots
      if (pts[468] && pts[473]) {
        ctx.fillStyle = "#38bdf8"; // Light sky cyan
        ctx.beginPath();
        ctx.arc(pts[468].x * width, pts[468].y * height, 3, 0, Math.PI * 2);
        ctx.arc(pts[473].x * width, pts[473].y * height, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // 3. Draw Gaze Target Reticle
    if (showGazeReticle) {
      ctx.save();
      const gazeRatio = detection.irisGazeRatio;
      const reticleX = width * (0.35 + gazeRatio.x * 0.3);
      const reticleY = height * (0.35 + gazeRatio.y * 0.3);

      ctx.beginPath();
      ctx.arc(reticleX, reticleY, 6, 0, Math.PI * 2);
      ctx.fillStyle = isCentered ? "#10b981" : "#f59e0b";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(reticleX, reticleY, 12, 0, Math.PI * 2);
      ctx.strokeStyle = isCentered ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }
  }, [detection, width, height, showMesh, showGazeReticle]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
    />
  );
}
