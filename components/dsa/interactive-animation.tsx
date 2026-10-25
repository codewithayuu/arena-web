'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Maximize,
  Minimize,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import Select from '@/components/smoothui/select';
import { SimpleTooltip } from '@/components/animate-ui/tooltip';

interface StepState {
  step: number;
  description: string;
  array: number[];
  readIdx: number;
  writeIdx: number;
  activeIdx?: number;
  statusType: 'normal' | 'found-zero' | 'found-nonzero' | 'swap' | 'complete';
  codeLine: number;
}

const ANIMATION_STEPS: StepState[] = [
  {
    step: 0,
    description: 'Start of algorithm: Initialize read = 0 and write = 0.',
    array: [0, 1, 0, 3, 12],
    readIdx: 0,
    writeIdx: 0,
    statusType: 'normal',
    codeLine: 2,
  },
  {
    step: 1,
    description: 'Examine nums[read=0] = 0. It is 0, so advance read pointer.',
    array: [0, 1, 0, 3, 12],
    readIdx: 0,
    writeIdx: 0,
    activeIdx: 0,
    statusType: 'found-zero',
    codeLine: 4,
  },
  {
    step: 2,
    description: 'Advance read to index 1. Write pointer remains at index 0.',
    array: [0, 1, 0, 3, 12],
    readIdx: 1,
    writeIdx: 0,
    statusType: 'normal',
    codeLine: 3,
  },
  {
    step: 3,
    description: 'Examine nums[read=1] = 1. Non-zero element found! Swap with write pointer.',
    array: [0, 1, 0, 3, 12],
    readIdx: 1,
    writeIdx: 0,
    activeIdx: 1,
    statusType: 'found-nonzero',
    codeLine: 5,
  },
  {
    step: 4,
    description: 'Swap nums[write=0] and nums[read=1]. nums is now [1, 0, 0, 3, 12].',
    array: [1, 0, 0, 3, 12],
    readIdx: 1,
    writeIdx: 0,
    activeIdx: 0,
    statusType: 'swap',
    codeLine: 6,
  },
  {
    step: 5,
    description: 'Increment write pointer to 1. Move read pointer to 2.',
    array: [1, 0, 0, 3, 12],
    readIdx: 2,
    writeIdx: 1,
    statusType: 'normal',
    codeLine: 7,
  },
  {
    step: 6,
    description: 'Examine nums[read=2] = 0. It is 0, so do not swap. Advance read.',
    array: [1, 0, 0, 3, 12],
    readIdx: 2,
    writeIdx: 1,
    activeIdx: 2,
    statusType: 'found-zero',
    codeLine: 4,
  },
  {
    step: 7,
    description: 'Advance read to index 3. Write pointer remains at index 1.',
    array: [1, 0, 0, 3, 12],
    readIdx: 3,
    writeIdx: 1,
    statusType: 'normal',
    codeLine: 3,
  },
  {
    step: 8,
    description: 'Examine nums[read=3] = 3. Non-zero element found! Swap with write pointer.',
    array: [1, 0, 0, 3, 12],
    readIdx: 3,
    writeIdx: 1,
    activeIdx: 3,
    statusType: 'found-nonzero',
    codeLine: 5,
  },
  {
    step: 9,
    description: 'Swap nums[write=1] and nums[read=3]. nums is now [1, 3, 0, 0, 12].',
    array: [1, 3, 0, 0, 12],
    readIdx: 3,
    writeIdx: 1,
    activeIdx: 1,
    statusType: 'swap',
    codeLine: 6,
  },
  {
    step: 10,
    description: 'Increment write pointer to 2. Move read pointer to 4.',
    array: [1, 3, 0, 0, 12],
    readIdx: 4,
    writeIdx: 2,
    statusType: 'normal',
    codeLine: 7,
  },
  {
    step: 11,
    description: 'Examine nums[read=4] = 12. Non-zero element found! Swap with write pointer.',
    array: [1, 3, 0, 0, 12],
    readIdx: 4,
    writeIdx: 2,
    activeIdx: 4,
    statusType: 'found-nonzero',
    codeLine: 5,
  },
  {
    step: 12,
    description: 'Swap nums[write=2] and nums[read=4]. nums is now [1, 3, 12, 0, 0].',
    array: [1, 3, 12, 0, 0],
    readIdx: 4,
    writeIdx: 2,
    activeIdx: 2,
    statusType: 'swap',
    codeLine: 6,
  },
  {
    step: 13,
    description: 'Increment write pointer to 3. Read pointer reached end of array.',
    array: [1, 3, 12, 0, 0],
    readIdx: 5,
    writeIdx: 3,
    statusType: 'normal',
    codeLine: 3,
  },
  {
    step: 14,
    description: 'Loop completed. All non-zero elements shifted to the left preserving order.',
    array: [1, 3, 12, 0, 0],
    readIdx: 5,
    writeIdx: 3,
    statusType: 'complete',
    codeLine: 9,
  },
  {
    step: 15,
    description: 'All remaining elements after write pointer are zeros.',
    array: [1, 3, 12, 0, 0],
    readIdx: 5,
    writeIdx: 3,
    statusType: 'complete',
    codeLine: 10,
  },
  {
    step: 16,
    description: 'Algorithm finished in O(n) time and O(1) space! Final array: [1, 3, 12, 0, 0]',
    array: [1, 3, 12, 0, 0],
    readIdx: 5,
    writeIdx: 3,
    statusType: 'complete',
    codeLine: 11,
  },
];

const CODE_SNIPPETS: Record<string, string[]> = {
  Java: [
    'public void moveZeroes(int[] nums) {',
    '    int insertPos = 0;',
    '    for (int i = 0; i < nums.length; i++) {',
    '        if (nums[i] != 0) {',
    '            if (i != insertPos) {',
    '                int temp = nums[insertPos];',
    '                nums[insertPos] = nums[i];',
    '                nums[i] = temp;',
    '            }',
    '            insertPos++;',
    '        }',
    '    }',
    '}',
  ],
  Python: [
    'def moveZeroes(nums: list[int]) -> None:',
    '    insert_pos = 0',
    '    for i in range(len(nums)):',
    '        if nums[i] != 0:',
    '            if i != insert_pos:',
    '                nums[insert_pos], nums[i] = nums[i], nums[insert_pos]',
    '            insert_pos += 1',
  ],
  'C++': [
    'void moveZeroes(vector<int>& nums) {',
    '    int insertPos = 0;',
    '    for (int i = 0; i < nums.size(); i++) {',
    '        if (nums[i] != 0) {',
    '            if (i != insertPos) {',
    '                swap(nums[insertPos], nums[i]);',
    '            }',
    '            insertPos++;',
    '        }',
    '    }',
    '}',
  ],
};

export function InteractiveAnimation({ variant }: { variant?: "move-zeroes" }) {
  if (variant !== "move-zeroes") return null;
  return <MoveZeroesAnimation />;
}

function MoveZeroesAnimation() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [language, setLanguage] = useState<'Java' | 'Python' | 'C++'>('Java');
  const containerRef = useRef<HTMLDivElement>(null);

  const step = ANIMATION_STEPS[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const intervalMs = 1000 / playbackSpeed;
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= ANIMATION_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const stepPrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };
  const stepNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(ANIMATION_STEPS.length - 1, prev + 1));
  };
  const reset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (document.fullscreenElement === containerRef.current) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }
    } catch {
      // Keep the control usable if the browser declines the request.
    }
  };

  return (
    <div
      ref={containerRef}
      className={`not-prose w-full shadow-lg transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-[100] overflow-y-auto rounded-none bg-background p-6'
          : 'my-6 overflow-hidden rounded-xl border border-border bg-card text-card-foreground'
      }`}
    >
      <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-5">
        <div className="flex flex-col gap-1 border-b border-border/60 pb-3">
          <h3 className="text-sm font-semibold text-foreground sm:text-base">Move Zeroes · Two-pointer walkthrough</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">Follow the read and write pointers through one in-place pass.</p>
        </div>

        {/* Collapsible Input Panel */}
        <div className="rounded-lg border bg-card/60 overflow-hidden">
          <button
            type="button"
            onClick={() => setIsInputOpen(!isInputOpen)}
            className="flex items-center justify-between w-full px-3 py-2 border-b bg-accent/20 hover:bg-accent/30 transition-colors cursor-pointer text-xs font-medium text-foreground"
            aria-expanded={isInputOpen}
          >
            <span className="flex items-center gap-1.5 font-semibold">
              <Sliders className="h-3.5 w-3.5 text-primary" />
              <span>Input: nums = [0, 1, 0, 3, 12]</span>
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                isInputOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isInputOpen && (
            <div className="p-3 text-xs bg-muted/20 border-t border-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Array values:</span>
                <span className="font-mono bg-background px-2.5 py-1 rounded border border-border">
                  [0, 1, 0, 3, 12]
                </span>
              </div>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium text-xs transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Visualizer Canvas SVG Area */}
        <div className="relative flex flex-col items-center justify-center rounded-xl border border-border/80 bg-zinc-950 p-4 sm:p-6 min-h-[190px] shadow-inner overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          {/* Visualization SVG */}
          <div role="region" aria-label="Move Zeroes array visualization; swipe horizontally on small screens" tabIndex={0} className="relative z-10 w-full overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <div className="relative mx-auto h-[170px] w-full min-w-[600px] max-w-2xl flex items-center justify-center">
            <svg
              viewBox="0 0 600 170"
              className="w-full h-full max-h-[170px]"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="mz-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feFlood floodColor="#00e5ff" floodOpacity="0.8" result="color" />
                  <feComposite in="color" in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="mz-glow-red" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feFlood floodColor="#e8263d" floodOpacity="0.85" result="color" />
                  <feComposite in="color" in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Array label */}
              <text
                x="40"
                y="85"
                textAnchor="end"
                dominantBaseline="central"
                fill="#a1a1aa"
                fontSize="13"
                fontWeight="700"
                fontFamily="'JetBrains Mono', monospace"
              >
                nums
              </text>

              {/* Array Elements */}
              {step.array.map((val, idx) => {
                const boxX = 80 + idx * 95;
                const boxY = 85;
                const isRead = step.readIdx === idx;
                const isWrite = step.writeIdx === idx;
                const isHighlighted = step.activeIdx === idx;

                let strokeColor = 'rgba(161, 161, 170, 0.35)';
                let fillColor = '#111119';
                let filterId = undefined;

                if (isHighlighted) {
                  strokeColor = val === 0 ? '#ff6b6b' : '#e8263d';
                  fillColor = val === 0 ? '#271015' : '#300a12';
                  filterId = val === 0 ? undefined : 'url(#mz-glow-red)';
                } else if (isRead && isWrite) {
                  strokeColor = '#00e5ff';
                } else if (isRead) {
                  strokeColor = '#00e5ff';
                } else if (isWrite) {
                  strokeColor = '#e8263d';
                }

                return (
                  <g key={idx} className="transition-all duration-200">
                    {/* Index Number */}
                    <text
                      x={boxX}
                      y={boxY + 45}
                      textAnchor="middle"
                      fill="#71717a"
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      {idx}
                    </text>

                    {/* Array Cell Box */}
                    <rect
                      x={boxX - 30}
                      y={boxY - 30}
                      width="60"
                      height="60"
                      rx="12"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isHighlighted || isRead || isWrite ? '2.5' : '1.5'}
                      filter={filterId}
                      className="transition-all duration-300"
                    />

                    {/* Cell Value */}
                    <text
                      x={boxX}
                      y={boxY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={val === 0 ? '#71717a' : '#f4f4f5'}
                      fontSize="20"
                      fontWeight="800"
                      fontFamily="'JetBrains Mono', monospace"
                      className="transition-all duration-200"
                    >
                      {val}
                    </text>

                    {/* Pointer Arrows on Top */}
                    {isRead && (
                      <g transform={`translate(${boxX}, ${boxY - 42})`}>
                        <text
                          x="0"
                          y="-10"
                          textAnchor="middle"
                          fill="#38bdf8"
                          fontSize="11"
                          fontWeight="700"
                          fontFamily="'JetBrains Mono', monospace"
                        >
                          read ↓
                        </text>
                      </g>
                    )}

                    {isWrite && (
                      <g transform={`translate(${boxX}, ${boxY - 42})`}>
                        <text
                          x={isRead ? '22' : '0'}
                          y={isRead ? '-22' : '-10'}
                          textAnchor="middle"
                          fill="#a855f7"
                          fontSize="11"
                          fontWeight="700"
                          fontFamily="'JetBrains Mono', monospace"
                        >
                          write ↓
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          </div>
        </div>

        {/* Step Explanation Text Banner */}
        <div className="py-2 px-4 rounded-lg bg-muted/40 border border-border/50 text-xs sm:text-sm text-center">
          <span className="font-semibold text-muted-foreground mr-2">Step:</span>
          <span className="text-foreground font-medium transition-all duration-200">
            {step.description}
          </span>
        </div>

        {/* Playback Controls Bar */}
        <div className="bg-background rounded-lg border border-border shadow-sm p-2 sm:p-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Play/Pause & Step Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              <SimpleTooltip content={isPlaying ? 'Pause' : 'Play'}>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-input bg-primary p-0 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:h-9 sm:w-9"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
              </SimpleTooltip>
              <SimpleTooltip content="Step backward">
                <button
                  type="button"
                  onClick={stepPrev}
                  disabled={currentStepIndex === 0}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-input bg-background p-0 transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40 sm:h-9 sm:w-9"
                  aria-label="Step backward"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </SimpleTooltip>
              <SimpleTooltip content="Step forward">
                <button
                  type="button"
                  onClick={stepNext}
                  disabled={currentStepIndex === ANIMATION_STEPS.length - 1}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-input bg-background p-0 transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40 sm:h-9 sm:w-9"
                  aria-label="Step forward"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </SimpleTooltip>
            </div>

            {/* Clickable Progress Slider / Scrubber */}
            <input
              type="range"
              min={0}
              max={ANIMATION_STEPS.length - 1}
              value={currentStepIndex}
              aria-label="Animation step"
              aria-valuetext={`Step ${currentStepIndex} of ${ANIMATION_STEPS.length - 1}`}
              onChange={(event) => {
                setIsPlaying(false);
                setCurrentStepIndex(Number(event.target.value));
              }}
              className="order-3 h-11 basis-full cursor-pointer accent-primary sm:order-none sm:h-8 sm:min-w-[120px] sm:flex-1 sm:basis-auto"
            />

            {/* Step Counter */}
            <span className="order-2 ml-auto whitespace-nowrap font-mono text-xs tabular-nums text-muted-foreground sm:order-none sm:ml-0">
              {currentStepIndex} / {ANIMATION_STEPS.length - 1}
            </span>

            {/* Speed Selector */}
            <div className="order-4 ml-auto flex shrink-0 items-center gap-2 sm:order-none sm:ml-0">
              <Select
                value={String(playbackSpeed)}
                onValueChange={(val) => setPlaybackSpeed(parseFloat(val))}
                options={[
                  { value: "0.5", label: "0.5x" },
                  { value: "1", label: "1.0x" },
                  { value: "1.5", label: "1.5x" },
                  { value: "2", label: "2.0x" },
                ]}
                size="sm"
                className="h-10 w-[85px] text-xs font-medium sm:h-8"
              />
            </div>

            {/* Fullscreen Button */}
            <SimpleTooltip content={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit animation fullscreen' : 'Enter animation fullscreen'}
                aria-pressed={isFullscreen}
                className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md border border-border bg-background p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:h-9 sm:w-9"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </SimpleTooltip>
          </div>
        </div>

        {/* Synchronized Code Viewer */}
        <div className="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100 font-mono text-xs">
          <div className="px-3 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-2">
            <span className="text-zinc-400 font-sans text-xs font-semibold">Implementation</span>
            <div className="flex items-center gap-1.5">
              {(['Java', 'Python', 'C++'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    language === lang
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 overflow-x-auto">
            <pre className="space-y-0.5">
              {CODE_SNIPPETS[language]?.map((line, idx) => {
                const isCurrentLine = idx + 1 === step.codeLine;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-2 py-0.5 rounded transition-colors ${
                      isCurrentLine
                        ? 'bg-primary/20 text-primary border-l-2 border-primary font-semibold'
                        : 'text-zinc-300'
                    }`}
                  >
                    <span className="w-5 text-right text-zinc-500 select-none text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                );
              })}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
