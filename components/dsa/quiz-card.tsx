"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Check } from "lucide-react";
import SmoothButton from "@/components/smoothui/smooth-button";

type QuizQuestionId =
  | "sum-array"
  | "array-access"
  | "halving-loop"
  | "nested-loop";

interface QuizQuestion {
  prompt: string;
  javaCode: string;
  pythonCode: string;
  options: { id: string; text: string }[];
  correctOption: string;
  explanation: string;
}

const QUESTIONS: Record<QuizQuestionId, QuizQuestion> = {
  "sum-array": {
    prompt: "What is the time complexity of this code?",
    javaCode: `int sumArray(int[] arr) {
    int sum = 0;
    for (int i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}`,
    pythonCode: `def sum_array(arr):
    total = 0
    for value in arr:
        total += value
    return total`,
    options: [
      { id: "A", text: "O(1)" },
      { id: "B", text: "O(log n)" },
      { id: "C", text: "O(n)" },
      { id: "D", text: "O(n²)" },
    ],
    correctOption: "C",
    explanation:
      "The loop visits each of the n array elements once, so the running time is O(n).",
  },
  "array-access": {
    prompt: "What is the time complexity of reading the first array element?",
    javaCode: `int firstValue(int[] arr) {
    return arr[0];
}`,
    pythonCode: `def first_value(arr):
    return arr[0]`,
    options: [
      { id: "A", text: "O(1)" },
      { id: "B", text: "O(log n)" },
      { id: "C", text: "O(n)" },
      { id: "D", text: "O(n²)" },
    ],
    correctOption: "A",
    explanation:
      "Array indexing reads one known position directly, independent of the array length: O(1).",
  },
  "halving-loop": {
    prompt: "What is the time complexity of this loop?",
    javaCode: `int steps = 0;
for (int i = n; i > 1; i /= 2) {
    steps++;
}`,
    pythonCode: `steps = 0
i = n
while i > 1:
    steps += 1
    i //= 2`,
    options: [
      { id: "A", text: "O(1)" },
      { id: "B", text: "O(log n)" },
      { id: "C", text: "O(n)" },
      { id: "D", text: "O(n²)" },
    ],
    correctOption: "B",
    explanation:
      "The value of i is halved each iteration, so it takes about log₂(n) iterations to reach 1: O(log n).",
  },
  "nested-loop": {
    prompt: "What is the time complexity of this code?",
    javaCode: `int count = 0;
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        count++;
    }
}`,
    pythonCode: `count = 0
for i in range(n):
    for j in range(n):
        count += 1`,
    options: [
      { id: "A", text: "O(1)" },
      { id: "B", text: "O(log n)" },
      { id: "C", text: "O(n)" },
      { id: "D", text: "O(n²)" },
    ],
    correctOption: "D",
    explanation: "Both loops run n times, for n × n total iterations: O(n²).",
  },
};

interface QuizCardProps {
  questionId?: QuizQuestionId;
  questionNumber?: number;
}

export function QuizCard({
  questionId = "nested-loop",
  questionNumber = 1,
}: QuizCardProps) {
  const question = QUESTIONS[questionId];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [language, setLanguage] = useState<"Java" | "Python">("Java");

  const options = question.options;

  const handleSubmit = () => {
    if (selectedOption) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  return (
    <div className="not-prose my-6 rounded-xl border border-border bg-card overflow-hidden shadow-md">
      <div className="p-4 sm:p-5 space-y-4">
        {/* Question Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {questionNumber}
            </span>
            <h4 className="text-sm sm:text-base font-semibold text-foreground">
              {question.prompt}
            </h4>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Chapter Quiz
          </span>
        </div>

        {/* Code Snippet */}
        <div className="rounded-lg border border-border overflow-hidden bg-zinc-950 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-1.5">
            <span className="text-zinc-400 font-sans text-xs">
              Code snippet
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLanguage("Java")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  language === "Java"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                Java
              </button>
              <button
                type="button"
                onClick={() => setLanguage("Python")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  language === "Python"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                Python
              </button>
            </div>
          </div>
          <div className="p-3 text-zinc-200 overflow-x-auto leading-relaxed">
            {language === "Java" ? (
              <pre>{question.javaCode}</pre>
            ) : (
              <pre>{question.pythonCode}</pre>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrect = opt.id === question.correctOption;
            let borderStyle = "border-border/60 hover:border-primary/50";
            let bgStyle = "bg-background hover:bg-muted/30";

            if (submitted) {
              if (isCorrect) {
                borderStyle =
                  "border-[#0E7490] bg-[#0E7490]/15 text-[#38BDF8] font-semibold";
                bgStyle = "bg-[#0E7490]/15";
              } else if (isSelected) {
                borderStyle =
                  "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold";
                bgStyle = "bg-red-500/10";
              }
            } else if (isSelected) {
              borderStyle = "border-primary ring-1 ring-primary";
              bgStyle = "bg-primary/5";
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={submitted}
                onClick={() => setSelectedOption(opt.id)}
                className={`flex items-center justify-between w-full p-3 rounded-lg border text-left text-xs sm:text-sm transition-all ${borderStyle} ${bgStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full border border-border text-[11px] font-bold text-muted-foreground">
                    {opt.id}
                  </span>
                  <span className="font-mono text-foreground">{opt.text}</span>
                </div>
                {submitted && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
                )}
                {submitted && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Actions & Feedback */}
        <div className="flex items-center justify-between pt-2">
          {submitted ? (
            <div className="flex items-center justify-between w-full">
              <div className="text-xs">
                {selectedOption === question.correctOption ? (
                  <span className="text-[#38BDF8] font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Correct!{" "}
                    {question.explanation}
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold flex items-center gap-1.5">
                    Incorrect. {question.explanation}
                  </span>
                )}
              </div>
              <SmoothButton
                type="button"
                size="xs"
                variant="ghost"
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground ml-3"
              >
                Try Again
              </SmoothButton>
            </div>
          ) : (
            <SmoothButton
              type="button"
              size="sm"
              variant="solid"
              color="accent"
              disabled={!selectedOption}
              onClick={handleSubmit}
              className="font-semibold text-xs ml-auto shadow-sm"
            >
              Submit Answer
            </SmoothButton>
          )}
        </div>
      </div>
    </div>
  );
}
