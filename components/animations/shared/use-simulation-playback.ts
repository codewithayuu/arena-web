"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export const DEFAULT_SPEEDS = [0.5, 1, 2];

// Double step duration to halve the playback speed, matching original Mindflare pacing
export const STEP_DURATION_MULTIPLIER = 2.0;

export interface SimulationPlayer<T = any> {
  view: T;
  previous: T | null;
  frames: T[] | null;
  progress: number;
  isPlaying: boolean;
  hasFrames: boolean;
  armed: boolean;
  atStart: boolean;
  atEnd: boolean;
  index: number;
  total: number;
  speed: number;
  setSpeed: (speed: number) => void;
  play: (newFrames: T[], stepMs?: number) => void;
  pause: () => void;
  resume: () => void;
  showIdle: () => void;
  start: () => void;
  next: () => void;
  prev: () => void;
  seek: (index: number) => void;
  stop: () => void;
}

export function useSimulationPlayback<T extends Record<string, any>>(
  defaultStepMs: number = 1000,
  initialFrame: T
): SimulationPlayer<T> {
  const [frames, setFrames] = useState<T[] | null>(null);
  const [index, setIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);

  const framesRef = useRef(frames);
  framesRef.current = frames;

  const indexRef = useRef(index);
  indexRef.current = index;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const stepMsRef = useRef(defaultStepMs);
  const lastTimeRef = useRef(0);

  // Playback animation loop - ONLY runs when isPlaying is true
  useEffect(() => {
    if (!isPlaying) return;

    let animId = 0;
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const currentFrames = framesRef.current;
      if (!isPlayingRef.current || !currentFrames || currentFrames.length === 0) {
        return;
      }

      const duration = (stepMsRef.current * STEP_DURATION_MULTIPLIER) / speedRef.current;
      const elapsed = (now - lastTimeRef.current) / duration;

      if (elapsed >= 1) {
        const nextIdx = indexRef.current + 1;
        if (nextIdx >= currentFrames.length) {
          setProgress(1);
          setIsPlaying(false);
          isPlayingRef.current = false;
          return;
        } else {
          lastTimeRef.current = now;
          indexRef.current = nextIdx;
          setIndex(nextIdx);
          setProgress(0);
        }
      } else {
        setProgress(elapsed);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const play = useCallback((newFrames: T[], stepMs?: number) => {
    framesRef.current = newFrames;
    indexRef.current = 0;
    stepMsRef.current = stepMs ?? defaultStepMs;
    lastTimeRef.current = performance.now();
    setFrames(newFrames);
    setIndex(0);
    setProgress(0);
    setIsPlaying(true);
    isPlayingRef.current = true;
  }, [defaultStepMs]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  const resume = useCallback(() => {
    const currentFrames = framesRef.current;
    if (currentFrames && currentFrames.length > 0) {
      if (indexRef.current < 0 || indexRef.current >= currentFrames.length - 1) {
        indexRef.current = 0;
        setIndex(0);
        setProgress(0);
      }
      lastTimeRef.current = performance.now();
      setIsPlaying(true);
      isPlayingRef.current = true;
    }
  }, []);

  const showIdle = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    indexRef.current = -1;
    setIndex(-1);
    setProgress(0);
  }, []);

  const start = useCallback(() => {
    if (framesRef.current && framesRef.current.length > 0) {
      indexRef.current = 0;
      setIndex(0);
      setProgress(0);
      lastTimeRef.current = performance.now();
      setIsPlaying(true);
      isPlayingRef.current = true;
    }
  }, []);

  const next = useCallback(() => {
    const currentFrames = framesRef.current;
    if (!currentFrames) return;
    setIsPlaying(false);
    isPlayingRef.current = false;
    const nextIdx = Math.min(indexRef.current + 1, currentFrames.length - 1);
    indexRef.current = nextIdx;
    setIndex(nextIdx);
    setProgress(1);
  }, []);

  const prev = useCallback(() => {
    if (!framesRef.current) return;
    setIsPlaying(false);
    isPlayingRef.current = false;
    const prevIdx = Math.max(indexRef.current - 1, 0);
    indexRef.current = prevIdx;
    setIndex(prevIdx);
    setProgress(1);
  }, []);

  const seek = useCallback((targetIdx: number) => {
    const currentFrames = framesRef.current;
    if (!currentFrames || currentFrames.length === 0) return;
    setIsPlaying(false);
    isPlayingRef.current = false;
    const clamped = Math.min(Math.max(targetIdx, 0), currentFrames.length - 1);
    indexRef.current = clamped;
    setIndex(clamped);
    setProgress(1);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    framesRef.current = null;
    indexRef.current = -1;
    setFrames(null);
    setIndex(-1);
    setProgress(0);
  }, []);

  const currentView =
    frames && index >= 0 && index < frames.length ? frames[index] : initialFrame;

  return {
    view: currentView,
    previous: frames && index > 0 ? frames[index - 1] : null,
    frames,
    progress,
    isPlaying,
    hasFrames: !!frames && index >= 0,
    armed: !!frames,
    atStart: index <= 0,
    atEnd: !!frames && index >= frames.length - 1,
    index,
    total: frames?.length ?? 0,
    speed,
    setSpeed,
    play,
    pause,
    resume,
    showIdle,
    start,
    next,
    prev,
    seek,
    stop,
  };
}
