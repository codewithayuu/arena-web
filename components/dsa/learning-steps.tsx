import React from 'react';

interface Step {
  title: string;
  desc: string;
}

const defaultSteps: Step[] = [
  {
    title: 'Learn the underlying concept',
    desc: 'thoroughly before jumping into code.',
  },
  {
    title: 'Take the chapter quiz',
    desc: 'to verify comprehension.',
  },
  {
    title: 'Study the common problem-solving patterns',
    desc: 'and recognizing clues.',
  },
  {
    title: 'Solve a few problems without looking at the solution',
    desc: 'first.',
  },
  {
    title: 'Compare your approach',
    desc: 'with the optimized visual solution.',
  },
  {
    title: 'Review the time and space complexity',
    desc: 'trade-offs.',
  },
  {
    title: 'Revisit difficult problems',
    desc: 'during periodic spaced repetition revision.',
  },
];

interface LearningStepsProps {
  steps?: Step[];
}

export function LearningSteps({ steps = defaultSteps }: LearningStepsProps) {
  return (
    <ol className="space-y-2.5 text-xs sm:text-sm text-foreground/90 list-decimal list-inside pl-2">
      {steps.map((step, idx) => (
        <li key={idx} className="leading-relaxed">
          <strong className="text-foreground">{step.title}</strong>{' '}
          {step.desc}
        </li>
      ))}
    </ol>
  );
}
