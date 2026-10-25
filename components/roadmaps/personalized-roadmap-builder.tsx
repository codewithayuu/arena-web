"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import {
  ROADMAP_CONTEXTS,
  ROADMAP_DSA_GOALS,
  ROADMAP_EXPERIENCE,
  ROADMAP_HOURS,
  ROADMAP_INTERESTS,
  ROADMAP_STYLES,
  ROADMAP_TIMELINES,
  ROADMAP_YEARS,
  type PersonalizedRoadmapAnswers,
} from "@/lib/personalized-roadmap";

type DraftAnswers = Partial<PersonalizedRoadmapAnswers>;

const titles = [
  "Are you currently a student?",
  "Where are you in your studies or career?",
  "How interested are you in software development?",
  "How interested are you in problem solving?",
  "How much time can you study each day?",
  "How would you describe your experience?",
  "What do you want to learn?",
  "What is your DSA goal?",
  "Choose a timeline.",
  "How do you prefer to learn?",
];

const borderChoice = "min-h-11 border bg-background px-3 py-2 text-left text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function isStepComplete(step: number, answers: DraftAnswers): boolean {
  if (step === 0) return typeof answers.isStudent === "boolean";
  if (step === 1) return answers.isStudent ? Boolean(answers.collegeYear) : Boolean(answers.professionalContext);
  if (step === 2) return Number.isInteger(answers.developmentAffinity);
  if (step === 3) return Number.isInteger(answers.problemSolvingAffinity);
  if (step === 4) return Boolean(answers.dailyHours);
  if (step === 5) return Boolean(answers.experienceLevel);
  if (step === 6) return Boolean(answers.developmentInterests?.length);
  if (step === 7) return Boolean(answers.dsaGoal);
  if (step === 8) return Boolean(answers.targetTimeline);
  return Boolean(answers.learningStyle?.length);
}

export function PersonalizedRoadmapBuilder() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DraftAnswers>({ developmentInterests: [], learningStyle: [] });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof PersonalizedRoadmapAnswers>(key: K, value: PersonalizedRoadmapAnswers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const choose = (values: string[], item: string, key: "developmentInterests" | "learningStyle") => {
    const next = values.includes(item) ? values.filter((value) => value !== item) : [...values, item];
    update(key, next as PersonalizedRoadmapAnswers[typeof key]);
  };

  const submit = async () => {
    if (!isStepComplete(step, answers)) {
      setError("Choose an option to continue.");
      return;
    }
    if (step < titles.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        isStudent: answers.isStudent,
        collegeYear: answers.isStudent ? answers.collegeYear ?? null : null,
        professionalContext: answers.isStudent ? null : answers.professionalContext ?? null,
        developmentAffinity: answers.developmentAffinity,
        problemSolvingAffinity: answers.problemSolvingAffinity,
        dailyHours: answers.dailyHours,
        experienceLevel: answers.experienceLevel,
        developmentInterests: answers.developmentInterests,
        dsaGoal: answers.dsaGoal,
        targetTimeline: answers.targetTimeline,
        learningStyle: answers.learningStyle,
      };
      const response = await fetch("/api/learning/roadmaps", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      const result = await response.json() as { roadmap?: { id: string }; error?: string };
      if (!response.ok || !result.roadmap?.id) throw new Error(result.error || (response.status === 401 ? "Sign in to save your roadmap." : "Could not save your roadmap."));
      router.push(`/roadmaps/my/${result.roadmap.id}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save your roadmap.");
    } finally {
      setSaving(false);
    }
  };

  const selected = (value: unknown, item: string) => Array.isArray(value) ? value.includes(item) : value === item;
  const optionGrid = (options: readonly string[], value: unknown, onChoose: (item: string) => void, multiple = false) => (
    <div className="mt-5 grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const active = selected(value, option);
        return <button key={option} type="button" aria-pressed={active} onClick={() => onChoose(option)} className={`${borderChoice} ${active ? "border-primary" : "border-border hover:border-foreground/30"}`}>
          <span className={`mr-3 inline-flex h-4 w-4 items-center justify-center border align-[-3px] ${active ? "border-primary" : "border-border"}`}>{active ? <span className="h-2 w-2 bg-primary" /> : null}</span>{option}
          {multiple ? <span className="sr-only">{active ? "selected" : "not selected"}</span> : null}
        </button>;
      })}
    </div>
  );

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 text-foreground sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Roadmaps</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Build your learning plan</h1>
        <section className="mt-7 border border-border bg-card p-5 text-card-foreground sm:p-8" aria-labelledby="question-title">
          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground"><span>Question {step + 1} of {titles.length}</span><span>{Math.round((step + 1) / titles.length * 100)}%</span></div>
          <div className="mt-3 h-px bg-muted"><div className="h-px bg-primary" style={{ width: `${(step + 1) / titles.length * 100}%` }} /></div>
          <h2 id="question-title" className="mt-7 text-xl font-semibold sm:text-2xl">{titles[step]}</h2>

          {step === 0 ? optionGrid(["Yes", "No"], answers.isStudent === undefined ? undefined : answers.isStudent ? "Yes" : "No", (option) => {
            const isStudent = option === "Yes";
            setAnswers((current) => ({ ...current, isStudent, collegeYear: isStudent ? current.collegeYear : null, professionalContext: isStudent ? null : current.professionalContext }));
            setError("");
          }) : null}
          {step === 1 && answers.isStudent ? optionGrid(ROADMAP_YEARS, answers.collegeYear, (option) => update("collegeYear", option as PersonalizedRoadmapAnswers["collegeYear"])) : null}
          {step === 1 && answers.isStudent === false ? optionGrid(ROADMAP_CONTEXTS, answers.professionalContext, (option) => update("professionalContext", option as PersonalizedRoadmapAnswers["professionalContext"])) : null}
          {step === 2 || step === 3 ? <div className="mt-6">
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">{Array.from({ length: 10 }, (_, index) => index + 1).map((value) => {
              const key = step === 2 ? "developmentAffinity" : "problemSolvingAffinity";
              const active = answers[key] === value;
              return <button key={value} type="button" aria-label={`Rate ${value} out of 10`} aria-pressed={active} onClick={() => update(key, value)} className={`${borderChoice} px-2 text-center ${active ? "border-primary" : "border-border text-muted-foreground hover:border-foreground/30"}`}>{value}</button>;
            })}</div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>Low</span><span>High</span></div>
          </div> : null}
          {step === 4 ? optionGrid(ROADMAP_HOURS, answers.dailyHours, (option) => update("dailyHours", option as PersonalizedRoadmapAnswers["dailyHours"])) : null}
          {step === 5 ? optionGrid(ROADMAP_EXPERIENCE, answers.experienceLevel, (option) => update("experienceLevel", option as PersonalizedRoadmapAnswers["experienceLevel"])) : null}
          {step === 6 ? optionGrid(ROADMAP_INTERESTS, answers.developmentInterests ?? [], (option) => choose(answers.developmentInterests ?? [], option, "developmentInterests"), true) : null}
          {step === 7 ? optionGrid(ROADMAP_DSA_GOALS, answers.dsaGoal, (option) => update("dsaGoal", option as PersonalizedRoadmapAnswers["dsaGoal"])) : null}
          {step === 8 ? optionGrid(ROADMAP_TIMELINES, answers.targetTimeline, (option) => update("targetTimeline", option as PersonalizedRoadmapAnswers["targetTimeline"])) : null}
          {step === 9 ? optionGrid(ROADMAP_STYLES, answers.learningStyle ?? [], (option) => choose(answers.learningStyle ?? [], option, "learningStyle"), true) : null}

          {error ? <p role="alert" className="mt-5 text-sm text-destructive">{error}</p> : null}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <button type="button" disabled={step === 0 || saving} onClick={() => { setStep((current) => current - 1); setError(""); }} className="border border-input bg-background px-4 py-2.5 text-sm text-foreground hover:bg-muted disabled:opacity-40"><ArrowLeft size={15} className="mr-2 inline" />Back</button>
            <button type="button" disabled={saving} onClick={() => void submit()} className="inline-flex items-center border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-45">
              {saving ? <LoaderCircle size={15} className="mr-2 animate-spin" /> : null}{step === titles.length - 1 ? "Create roadmap" : "Continue"}{step < titles.length - 1 ? <ArrowRight size={15} className="ml-2" /> : null}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
