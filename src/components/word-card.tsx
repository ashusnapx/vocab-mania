"use client";

import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Word } from "@/lib/words";

interface WordCardProps {
  word: Word;
  mode: "learn" | "review" | "quiz";
  onKnow?: () => void;
  onDontKnow?: () => void;
  onConfidence?: (level: 1 | 2 | 3 | 4 | 5) => void;
  showHindi?: boolean;
  children?: React.ReactNode;
}

export function WordCard({
  word,
  mode,
  onKnow,
  onDontKnow,
  onConfidence,
  showHindi = false,
  children,
}: WordCardProps) {
  const [revealed, setRevealed] = useState(mode === "learn");
  const [selectedConfidence, setSelectedConfidence] = useState<1 | 2 | 3 | 4 | 5 | null>(null);

  const difficultyColor = {
    easy: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    hard: "bg-red-50 text-red-700 border-red-200",
  }[word.difficulty];

  const handleConfidence = (level: 1 | 2 | 3 | 4 | 5) => {
    setSelectedConfidence(level);
    onConfidence?.(level);
  };

  return (
    <div className="card-surface w-full max-w-xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-outline-variant/30 p-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-display text-[28px] font-semibold text-on-surface">
              {word.word}
            </h2>
            <span className="text-[13px] text-outline font-medium">{word.pronunciation}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[12px] font-medium text-primary capitalize">
              {word.partOfSpeech}
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-[12px] font-medium capitalize ${difficultyColor}`}>
              {word.difficulty}
            </span>
          </div>
        </div>
        {mode === "learn" && (
          <button
            onClick={() => setRevealed(!revealed)}
            className="rounded-full p-2 transition-colors hover:bg-primary/8 text-outline"
            title={revealed ? "Hide meaning" : "Show meaning"}
          >
            {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Meaning */}
        {revealed ? (
          <div className="space-y-2">
            <p className="text-[17px] text-on-surface leading-relaxed">{word.meaning}</p>
            {showHindi && (
              <p className="text-[16px] text-primary font-medium">{word.hindiMeaning}</p>
            )}
          </div>
        ) : (
          <div className="flex h-16 items-center justify-center rounded-xl bg-primary/5 border border-dashed border-primary/20">
            <p className="text-[15px] text-outline">Tap to reveal the meaning</p>
          </div>
        )}

        {/* Example */}
        {revealed && (
          <div className="rounded-xl bg-primary/[0.04] border border-primary/10 p-4">
            <p className="text-[14px] text-outline mb-1 font-medium">Example</p>
            <p className="text-[15px] text-on-surface italic leading-relaxed">
              &ldquo;{word.example}&rdquo;
            </p>
          </div>
        )}

        {/* Roots + Synonyms + Antonyms */}
        {revealed && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-tertiary/[0.06] p-3 border border-tertiary/10">
              <p className="text-[12px] font-medium text-tertiary mb-1">Root</p>
              <p className="text-[14px] text-on-surface">{word.root}</p>
            </div>
            <div className="rounded-xl bg-green-500/[0.06] p-3 border border-green-500/10">
              <p className="text-[12px] font-medium text-green-600 mb-1">Synonyms</p>
              <p className="text-[14px] text-on-surface leading-snug">{word.synonyms.join(", ")}</p>
            </div>
            <div className="rounded-xl bg-red-500/[0.06] p-3 border border-red-500/10">
              <p className="text-[12px] font-medium text-red-500 mb-1">Antonyms</p>
              <p className="text-[14px] text-on-surface leading-snug">{word.antonyms.join(", ")}</p>
            </div>
          </div>
        )}

        {/* Confidence rating (review mode) */}
        {revealed && mode === "review" && onConfidence && (
          <div className="pt-2">
            <p className="text-[13px] text-outline mb-2 text-center">How well did you know this?</p>
            <div className="flex justify-center gap-2">
              {([1, 2, 3, 4, 5] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => handleConfidence(level)}
                  className={`h-10 w-10 rounded-full text-[13px] font-medium transition-all ${
                    selectedConfidence === level
                      ? level >= 4
                        ? "bg-green-500 text-white scale-110"
                        : level >= 3
                          ? "bg-primary text-white scale-110"
                          : "bg-red-500 text-white scale-110"
                      : "bg-surface-hover text-outline hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex justify-between px-1 mt-1">
              <span className="text-[11px] text-outline">No idea</span>
              <span className="text-[11px] text-outline">Instant recall</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {mode === "learn" && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={onDontKnow}
              className="flex-1 h-12 rounded-xl border border-outline-variant/40 text-[14px] font-medium text-on-surface transition-colors hover:bg-surface-hover"
            >
              I don&apos;t know
            </button>
            <button
              onClick={onKnow}
              className="flex-1 h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary transition-all hover:bg-primary-hover active:scale-[0.98]"
            >
              I know this
            </button>
          </div>
        )}

        {mode === "review" && onKnow && (
          <div className="pt-2">
            <button
              onClick={onKnow}
              className="w-full h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary transition-all hover:bg-primary-hover active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Next word
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
