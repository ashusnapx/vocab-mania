"use client";

import { useState, useMemo, useCallback } from "react";
import type { Word } from "@/lib/words";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  GripVertical,
} from "lucide-react";

interface QuizProps {
  words: Word[];
  onComplete: (score: number, total: number) => void;
}

type DragDropQ = {
  type: "dragdrop";
  pairs: { word: string; meaning: string }[];
};

type QuickFireQ = {
  type: "quickfire";
  word: Word;
  options: string[];
  correctIndex: number;
};

type QuizQuestion = DragDropQ | QuickFireQ;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(words: Word[]): QuizQuestion[] {
  const allWords = [...words];
  const questions: QuizQuestion[] = [];
  const shuffled = shuffleArray(allWords);
  const pool = shuffled.slice(0, Math.min(8, shuffled.length));

  // Generate drag-and-drop questions (groups of 4)
  const dragDropWords = pool.slice(0, Math.min(4, pool.length));
  if (dragDropWords.length >= 2) {
    const pairs = dragDropWords.map((w) => ({
      word: w.word,
      meaning: w.meaning,
    }));
    questions.push({ type: "dragdrop", pairs });
  }

  // Generate quick fire questions from remaining words
  const remaining = pool.filter((w) => !dragDropWords.includes(w));
  for (const word of remaining) {
    const otherMeanings = allWords
      .filter((w) => w.id !== word.id)
      .map((w) => w.meaning);
    const distractors = shuffleArray(otherMeanings).slice(0, 3);
    const options = shuffleArray([word.meaning, ...distractors]);
    questions.push({
      type: "quickfire",
      word,
      options,
      correctIndex: options.indexOf(word.meaning),
    });
  }

  return shuffleArray(questions);
}

// ============ DRAG AND DROP QUESTION ============
function DragDropQuestion({
  question,
  onComplete,
}: {
  question: DragDropQ;
  onComplete: (correct: number) => void;
}) {
  const [assignments, setAssignments] = useState<Record<number, number>>({});
  const [dragging, setDragging] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleDragStart = useCallback((idx: number) => {
    setDragging(idx);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
    },
    []
  );

  const handleDrop = useCallback(
    (targetIdx: number) => (e: React.DragEvent) => {
      e.preventDefault();
      if (dragging === null) return;
      setAssignments((prev) => {
        const next = { ...prev };
        // Remove any existing assignment for this word
        Object.keys(next).forEach((k) => {
          if (next[Number(k)] === dragging) delete next[Number(k)];
        });
        next[targetIdx] = dragging;
        return next;
      });
      setDragging(null);
    },
    [dragging]
  );

  const handleTouchEnd = useCallback(
    (targetIdx: number) => () => {
      if (dragging === null) return;
      setAssignments((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (next[Number(k)] === dragging) delete next[Number(k)];
        });
        next[targetIdx] = dragging;
        return next;
      });
      setDragging(null);
    },
    [dragging]
  );

  const handleSubmit = useCallback(() => {
    const res: Record<number, boolean> = {};
    let correct = 0;
    question.pairs.forEach((pair, i) => {
      const assignedWordIdx = assignments[i];
      if (assignedWordIdx !== undefined) {
        const isCorrect =
          question.pairs[assignedWordIdx].word === pair.word;
        res[i] = isCorrect;
        if (isCorrect) correct++;
      } else {
        res[i] = false;
      }
    });
    setResults(res);
    setSubmitted(true);
    onComplete(correct);
  }, [assignments, question.pairs, onComplete]);

  const allAssigned = Object.keys(assignments).length === question.pairs.length;

  return (
    <div>
      <p className="text-[14px] text-outline mb-2">
        Drag each word to its meaning
      </p>

      {/* Word chips (draggable) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {question.pairs.map((pair, i) => {
          const isAssigned = Object.values(assignments).includes(i);
          return (
            <div
              key={i}
              draggable={!submitted && !isAssigned}
              onDragStart={() => !isAssigned && handleDragStart(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-[13px] font-semibold transition-all select-none ${
                isAssigned
                  ? "border-outline-variant/30 bg-surface-container text-outline/50 cursor-default"
                  : dragging === i
                    ? "border-primary bg-primary/10 text-primary scale-105 shadow-lg"
                    : "border-primary/30 bg-primary/5 text-primary cursor-grab active:cursor-grabbing hover:border-primary hover:bg-primary/10"
              }`}
            >
              {!isAssigned && (
                <GripVertical size={14} className="text-primary/50" />
              )}
              {pair.word}
            </div>
          );
        })}
      </div>

      {/* Meaning slots (drop targets) */}
      <div className="space-y-3">
        {question.pairs.map((pair, slotIdx) => {
          const assignedWordIdx = assignments[slotIdx];
          const assignedWord =
            assignedWordIdx !== undefined
              ? question.pairs[assignedWordIdx]
              : null;
          const isCorrect = results[slotIdx];
          const isWrong = submitted && results[slotIdx] === false;

          return (
            <div
              key={slotIdx}
              onDragOver={!submitted ? handleDragOver : undefined}
              onDrop={!submitted ? handleDrop(slotIdx) : undefined}
              onTouchEnd={!submitted ? handleTouchEnd(slotIdx) : undefined}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-all min-h-[52px] ${
                isCorrect
                  ? "border-secondary bg-secondary/5"
                  : isWrong
                    ? "border-error bg-error/5"
                    : assignedWord
                      ? "border-primary/50 bg-primary/5"
                      : dragging !== null && !submitted
                        ? "border-primary/30 bg-primary/5"
                        : "border-outline-variant/40 bg-surface-container-low"
              }`}
            >
              {/* Meaning (always visible) */}
              <p className="flex-1 text-[13px] text-on-surface">
                {pair.meaning}
              </p>

              {/* Assigned word chip or empty slot */}
              {assignedWord ? (
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-semibold ${
                    isCorrect
                      ? "bg-secondary/10 text-secondary"
                      : isWrong
                        ? "bg-error/10 text-error"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 size={12} />
                  ) : isWrong ? (
                    <XCircle size={12} />
                  ) : null}
                  {assignedWord.word}
                </div>
              ) : (
                <div className="w-20 h-8 rounded-lg border border-outline-variant/30 flex items-center justify-center">
                  <span className="text-[11px] text-outline/40">drop here</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allAssigned}
          className="w-full h-11 mt-6 rounded-xl bg-primary text-[14px] font-medium text-on-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Check All
        </button>
      )}

      {/* Results summary */}
      {submitted && (
        <div className="mt-4">
          <p className="text-[14px] font-medium text-on-surface mb-1">
            {Object.values(results).filter(Boolean).length} /{" "}
            {question.pairs.length} correct
          </p>
          {question.pairs.map((pair, i) => (
            <p key={i} className="text-[12px] text-outline">
              {pair.word} → {pair.meaning}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ MAIN QUIZ COMPONENT ============
export function Quiz({ words, onComplete }: QuizProps) {
  const questions = useMemo(() => generateQuestions(words), [words]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const question = questions[qIndex];
  const totalQuestions = questions.length;
  const progress = ((qIndex + (answered ? 1 : 0)) / totalQuestions) * 100;

  function handleQuickFireOption(optionIndex: number) {
    if (answered || !question || question.type !== "quickfire") return;
    const correct = optionIndex === question.correctIndex;
    setAnswered(true);
    setIsCorrect(correct);
    setSelectedAnswer(optionIndex);
    if (correct) setScore((s) => s + 1);
  }

  function handleDragDropComplete(correctCount: number) {
    setScore((s) => s + correctCount);
    setAnswered(true);
    if (question.type === "dragdrop") {
      setIsCorrect(correctCount === question.pairs.length);
    }
  }

  function handleNext() {
    if (qIndex + 1 >= totalQuestions) {
      onComplete(score, totalQuestions);
    } else {
      setQIndex((i) => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setIsCorrect(false);
    }
  }

  if (!question) {
    onComplete(score, 0);
    return null;
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="section-wrap pt-6 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-medium text-primary">
            Quiz Time
          </span>
          <span className="text-[13px] text-outline">
            {qIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Type Badge */}
        <div className="mb-4">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[12px] font-medium text-primary">
            {question.type === "dragdrop"
              ? "Word Match"
              : "Quick Fire"}
          </span>
        </div>

        {/* DRAG AND DROP */}
        {question.type === "dragdrop" && (
          <DragDropQuestion
            question={question}
            onComplete={handleDragDropComplete}
          />
        )}

        {/* QUICK FIRE */}
        {question.type === "quickfire" && (
          <div>
            <p className="text-[18px] font-display font-semibold text-on-surface mb-1">
              {question.word.word}
            </p>
            <p className="text-[12px] text-outline mb-4">
              {question.word.partOfSpeech} &middot;{" "}
              {question.word.hindiMeaning}
            </p>
            <p className="text-[14px] text-outline mb-4">
              What does this word mean?
            </p>
            <div className="space-y-2">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickFireOption(i)}
                  disabled={answered}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all text-[14px] ${
                    answered && i === question.correctIndex
                      ? "border-secondary bg-secondary/5 text-secondary font-medium"
                      : answered && i === selectedAnswer && !isCorrect
                        ? "border-error bg-error/5 text-error"
                        : "border-outline-variant bg-white hover:border-primary/50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback + Next (for quickfire and dragdrop after submit) */}
        {answered && question.type === "quickfire" && (
          <div className="mt-6">
            <div
              className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${
                isCorrect ? "bg-secondary/10" : "bg-error/10"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 size={18} className="text-secondary shrink-0" />
              ) : (
                <XCircle size={18} className="text-error shrink-0" />
              )}
              <p
                className={`text-[14px] font-medium ${
                  isCorrect ? "text-secondary" : "text-error"
                }`}
              >
                {isCorrect ? "Correct!" : "Not quite"}
              </p>
              {!isCorrect && (
                <p className="text-[13px] text-outline ml-auto">
                  {question.word.meaning}
                </p>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary flex items-center justify-center gap-2 transition-all hover:bg-primary-hover"
            >
              {qIndex + 1 >= totalQuestions ? "See Results" : "Next"}
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {answered && question.type === "dragdrop" && (
          <div className="mt-6">
            <button
              onClick={handleNext}
              className="w-full h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary flex items-center justify-center gap-2 transition-all hover:bg-primary-hover"
            >
              {qIndex + 1 >= totalQuestions ? "See Results" : "Next"}
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Score indicator */}
        <div className="flex items-center justify-center gap-1 mt-4">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < qIndex
                  ? "w-4 bg-primary"
                  : i === qIndex
                    ? "w-4 bg-primary/50"
                    : "w-4 bg-outline-variant"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
