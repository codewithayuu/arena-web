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

const DEFAULT_ARRAY = [0, 1, 0, 3, 12];

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

export function InteractiveAnimation() {
  const [activeTab, setActiveTab] = useState<'extra_array' | 'swap' | 'one_pass'>('one_pass');
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

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const progressPercent = (currentStepIndex / (ANIMATION_STEPS.length - 1)) * 100;

  return (
    <div
      ref={containerRef}
      className={`not-prose w-full my-6 bg-card text-card-foreground rounded-xl border border-border overflow-hidden shadow-lg transition-all ${
        isFullscreen ? 'fixed inset-0 z-[100] rounded-none overflow-y-auto bg-background p-6' : ''
      }`}
    >
      <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-5">
        {/* Strategy Tabs */}
        <div className="overflow-x-auto pb-1">
          <div className="flex w-max min-w-full justify-center">
            <div className="w-[520px] max-w-full">
              <div
                role="tablist"
                className="items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground grid grid-cols-3 text-xs sm:text-sm font-medium"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('extra_array');
                    reset();
                  }}
                  className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 transition-all ${
                    activeTab === 'extra_array'
                      ? 'bg-background text-foreground shadow-sm font-semibold'
                      : 'hover:text-foreground'
                  }`}
                >
                  Extra Array
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('swap');
                    reset();
                  }}
                  className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 transition-all ${
                    activeTab === 'swap'
                      ? 'bg-background text-foreground shadow-sm font-semibold'
                      : 'hover:text-foreground'
                  }`}
                >
                  Two Pointers (Swap)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('one_pass');
                    reset();
                  }}
                  className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 transition-all ${
                    activeTab === 'one_pass'
                      ? 'bg-background text-foreground shadow-sm font-semibold'
                      : 'hover:text-foreground'
                  }`}
                >
                  Minimal Operations
                </button>
              </div>
            </div>
          </div>
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
          <div className="relative w-full max-w-2xl h-[170px] flex items-center justify-center z-10">
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

        {/* Step Explanation Text Banner */}
        <div className="py-2 px-4 rounded-lg bg-muted/40 border border-border/50 text-xs sm:text-sm text-center">
          <span className="font-semibold text-muted-foreground mr-2">Step:</span>
          <span className="text-foreground font-medium transition-all duration-200">
            {step.description}
          </span>
        </div>

        {/* Playback Controls Bar */}
        <div className="bg-background rounded-lg border border-border shadow-sm p-2 sm:p-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play/Pause & Step Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              <SimpleTooltip content={isPlaying ? 'Pause' : 'Play'}>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 sm:h-9 sm:w-9 p-0 transition-colors shadow-sm"
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
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:pointer-events-none h-8 w-8 sm:h-9 sm:w-9 p-0 transition-colors"
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
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:pointer-events-none h-8 w-8 sm:h-9 sm:w-9 p-0 transition-colors"
                  aria-label="Step forward"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </SimpleTooltip>
            </div>

            {/* Clickable Progress Slider / Scrubber */}
            <div
              className="relative flex-1 min-w-0 cursor-pointer py-2"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                const targetStep = Math.round(ratio * (ANIMATION_STEPS.length - 1));
                setIsPlaying(false);
                setCurrentStepIndex(targetStep);
              }}
            >
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-150 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-150"
                style={{ left: `${progressPercent}%` }}
              >
                <div className="h-3.5 w-3.5 rounded-full bg-primary border-2 border-background shadow-md" />
              </div>
            </div>

            {/* Step Counter */}
            <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums font-mono">
              {currentStepIndex} / {ANIMATION_STEPS.length - 1}
            </span>

            {/* Speed Selector */}
            <div className="w-[85px] shrink-0">
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
                className="h-8 text-xs font-medium"
              />
            </div>

            {/* Fullscreen Button */}
            <SimpleTooltip content={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2 rounded-md bg-background hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
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
