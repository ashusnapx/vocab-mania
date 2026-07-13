"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, ArrowRight, BookOpen } from "lucide-react";
import type { FolderQuestion } from "@/lib/folders";
import type { SessionItem } from "@/lib/folders";
import { MatchingQuiz, type MatchPair } from "./matching-quiz";

interface QuizProps {
  questions: FolderQuestion[];
  sessionItems?: SessionItem[];
  onComplete: (score: number, total: number) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Quiz({ questions, sessionItems = [], onComplete }: QuizProps) {
  const mcqs = useMemo(
    () => shuffleArray(questions).slice(0, Math.min(3, questions.length)),
    [questions]
  );

  const matchPairs = useMemo(() => {
    if (!sessionItems || sessionItems.length === 0) return [];
    const list: MatchPair[] = [];
    sessionItems.forEach((item) => {
      if (item.data.word1 && item.data.word2) {
        list.push({
          id: `${item.id}-1`,
          term: item.data.word1 as string,
          definition: item.data.meaning1 as string,
        });
        list.push({
          id: `${item.id}-2`,
          term: item.data.word2 as string,
          definition: item.data.meaning2 as string,
        });
      } else if (item.data.word && item.data.meaning) {
        list.push({
          id: String(item.id),
          term: item.data.word as string,
          definition: item.data.meaning as string,
        });
      } else if (item.data.idiom && item.data.meaning) {
        list.push({
          id: String(item.id),
          term: item.data.idiom as string,
          definition: item.data.meaning as string,
        });
      }
    });
    return shuffleArray(list).slice(0, Math.min(4, list.length));
  }, [sessionItems]);

  const [step, setStep] = useState(0);
  const [mcqScore, setMcqScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = mcqs.length + (matchPairs.length > 0 ? 1 : 0);
  const progress = ((step + (submitted && step < mcqs.length ? 0.5 : 0)) / totalSteps) * 100;

  const currentMcq = mcqs[step];

  if (totalSteps === 0) {
    onComplete(0, 0);
    return null;
  }

  function handleSelect(letter: string) {
    if (submitted) return;
    setSelected(letter);
  }

  function handleSubmit() {
    if (!selected || !currentMcq) return;
    setSubmitted(true);
    if (selected === currentMcq.answer) {
      setMcqScore((s) => s + 1);
    }
  }

  function handleNext() {
    setSelected(null);
    setSubmitted(false);
    
    if (step + 1 >= totalSteps) {
      onComplete(mcqScore, mcqs.length);
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleMatchingComplete(matchingScore: number, matchingTotal: number) {
    onComplete(mcqScore + matchingScore, mcqs.length + matchingTotal);
  }

  // RENDER DRAG & DROP MATCHING STEP
  if (step === mcqs.length && matchPairs.length > 0) {
    return (
      <div className="min-h-screen bg-surface dark:bg-[#0a0a0b]">
        <div className="section-wrap pt-6 pb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium text-primary flex items-center gap-1 dark:text-[#60a5fa]">
              <BookOpen size={13} />
              Final Challenge
            </span>
            <span className="text-[13px] text-outline dark:text-white/50">
              Step {step + 1} / {totalSteps}
            </span>
          </div>

          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mb-6 dark:bg-white/[0.06]">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 dark:bg-[#60a5fa]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <MatchingQuiz pairs={matchPairs} onComplete={handleMatchingComplete} />
        </div>
      </div>
    );
  }

  if (!currentMcq) return null;
  const isCorrect = selected === currentMcq.answer;

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0a0a0b]">
      <div className="section-wrap pt-6 pb-12">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-medium text-primary dark:text-[#60a5fa]">
            Quiz Time
          </span>
          <span className="text-[13px] text-outline dark:text-white/50">
            Step {step + 1} / {totalSteps}
          </span>
        </div>

        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mb-6 dark:bg-white/[0.06]">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 dark:bg-[#60a5fa]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-4">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[12px] font-medium text-primary dark:bg-[#60a5fa]/10 dark:text-[#60a5fa]">
            Multiple Choice
          </span>
        </div>

        <div className="mb-6">
          <p className="text-[15px] text-on-surface leading-relaxed mb-1 font-medium dark:text-white">
            {currentMcq.question}
          </p>
        </div>

        <div className="space-y-2 mb-6">
          {(["a", "b", "c", "d"] as const).map((letter) => {
            const text = currentMcq.options[letter];
            const isSelected = selected === letter;
            const isAnswer = letter === currentMcq.answer;

            let borderClass = "border-outline-variant bg-surface dark:bg-surface-container dark:border-white/[0.08] hover:border-primary/45 dark:hover:border-[#60a5fa]/40 hover:scale-[1.005]";
            if (submitted && isAnswer) {
              borderClass = "border-emerald-500/40 bg-emerald-500/5 dark:border-[#34d399]/40 dark:bg-[#34d399]/[0.04]";
            } else if (submitted && isSelected && !isAnswer) {
              borderClass = "border-red-500/40 bg-red-500/5 dark:border-red-500/30 dark:bg-red-500/[0.04]";
            } else if (isSelected) {
              borderClass = "border-primary bg-primary/5 dark:border-[#60a5fa] dark:bg-[#60a5fa]/[0.04]";
            }

            return (
              <button
                key={letter}
                onClick={() => handleSelect(letter)}
                disabled={submitted}
                className={`w-full rounded-xl border p-4 text-left transition-all flex items-start gap-3 active:scale-[0.99] disabled:active:scale-100 ${borderClass}`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px] font-black ${
                    submitted && isAnswer
                      ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                      : submitted && isSelected && !isAnswer
                        ? "bg-red-500 text-white"
                        : isSelected
                          ? "bg-primary text-on-primary dark:bg-[#60a5fa] dark:text-[#0c1929]"
                          : "bg-surface-container text-outline/80 dark:bg-white/[0.04] dark:text-white/40"
                  }`}
                >
                  {letter.toUpperCase()}
                </span>
                <span
                  className={`text-[13.5px] font-bold pt-0.5 ${
                    submitted && isAnswer
                      ? "text-secondary dark:text-[#34d399]"
                      : submitted && isSelected && !isAnswer
                        ? "text-red-500 dark:text-red-400"
                        : "text-on-surface dark:text-white"
                  }`}
                >
                  {text}
                </span>
                {submitted && isAnswer && (
                  <CheckCircle2
                    size={16}
                    className="text-secondary shrink-0 mt-0.5 ml-auto dark:text-[#34d399] stroke-[3]"
                  />
                )}
                {submitted && isSelected && !isAnswer && (
                  <XCircle
                    size={16}
                    className="text-red-500 shrink-0 mt-0.5 ml-auto dark:text-red-400 stroke-[3]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className="w-full h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all dark:bg-[#60a5fa] dark:text-[#0c1929]"
          >
            Submit
          </button>
        )}

        {submitted && (
          <div className="mt-2">
            <div
              className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${
                isCorrect ? "bg-secondary/10 dark:bg-[#34d399]/[0.08]" : "bg-error/10 dark:bg-[#f87171]/[0.08]"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 size={18} className="text-secondary shrink-0 dark:text-[#34d399]" />
              ) : (
                <XCircle size={18} className="text-error shrink-0 dark:text-[#f87171]" />
              )}
              <p
                className={`text-[14px] font-medium ${
                  isCorrect ? "text-secondary dark:text-[#34d399]" : "text-error dark:text-[#f87171]"
                }`}
              >
                {isCorrect ? "Correct!" : `Wrong — Answer: ${currentMcq.options[currentMcq.answer as keyof typeof currentMcq.options]}`}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary flex items-center justify-center gap-2 transition-all hover:bg-primary-hover dark:bg-[#60a5fa] dark:text-[#0c1929] dark:hover:bg-[#60a5fa]/90"
            >
              {step + 1 >= totalSteps ? "See Results" : "Next"}
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-1 mt-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < step
                  ? "w-4 bg-primary dark:bg-[#60a5fa]"
                  : i === step
                    ? "w-4 bg-primary/50 dark:bg-[#60a5fa]/50"
                    : "w-4 bg-outline-variant dark:bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
