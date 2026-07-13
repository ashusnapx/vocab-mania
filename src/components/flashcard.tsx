"use client";

import { useState, useCallback } from "react";
import { Star, Eye, ArrowRight, RotateCcw } from "lucide-react";
import type { Word } from "@/lib/words";

interface FlashcardProps {
  word: Word;
  onAction: (action: "know" | "dont_know" | "vault") => void;
  disabled?: boolean;
}

export function Flashcard({ word, onAction, disabled }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  const handleAction = useCallback(
    (action: "know" | "dont_know" | "vault") => (e: React.MouseEvent) => {
      e.stopPropagation();
      onAction(action);
    },
    [onAction]
  );

  return (
    <div className="w-full max-w-lg mx-auto" style={{ perspective: "1200px" }}>
      <div
        className="relative w-full cursor-pointer"
        style={{ transformStyle: "preserve-3d", transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" , transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleFlip();
          }
        }}
      >
        {/* ===== FRONT FACE ===== */}
        <div
          className="absolute inset-0 w-full rounded-[20px] border border-outline-variant/20 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          style={{ backfaceVisibility: "hidden", pointerEvents: flipped ? "none" : "auto" }}
        >
          {/* Top accent bar */}
          <div className="h-1.5 w-full rounded-t-[20px] bg-gradient-to-r from-primary via-secondary to-tertiary" />

          <div className="flex flex-col items-center justify-center px-8 py-16">
            {/* Part of speech badge */}
            <span className="mb-4 rounded-full bg-primary/8 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-primary">
              {word.partOfSpeech}
            </span>

            {/* Word */}
            <h2 className="font-display text-[40px] font-bold leading-tight text-on-surface text-center mb-1">
              {word.word}
            </h2>

            {/* Pronunciation */}
            <p className="text-[14px] text-outline mb-5 font-mono">
              {word.pronunciation}
            </p>

            {/* Year badges */}
            {word.yearsAsked && word.yearsAsked.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mb-8">
                {word.yearsAsked.map((yr) => (
                  <span
                    key={yr}
                    className="rounded-md bg-tertiary/8 px-2 py-0.5 text-[11px] font-medium text-tertiary"
                  >
                    CGL {yr}
                  </span>
                ))}
              </div>
            )}

            {/* Tap hint */}
            <div className="flex items-center gap-2 text-[13px] text-outline/70">
              <Eye size={14} />
              Tap to reveal meaning
            </div>
          </div>
        </div>

        {/* ===== BACK FACE ===== */}
        <div
          className="w-full rounded-[20px] border border-outline-variant/20 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", pointerEvents: flipped ? "auto" : "none" }}
        >
          {/* Top accent bar */}
          <div className="h-1.5 w-full rounded-t-[20px] bg-gradient-to-r from-secondary via-primary to-tertiary" />

          <div className="p-6">
            {/* Word header */}
            <div className="mb-4">
              <h2 className="font-display text-[26px] font-bold text-on-surface mb-1">
                {word.word}
              </h2>
              <div className="flex gap-2">
                <span className="rounded-full bg-primary/8 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-primary">
                  {word.partOfSpeech}
                </span>
                {word.yearsAsked && word.yearsAsked.length > 0 && (
                  <span className="rounded-full bg-tertiary/8 px-2.5 py-0.5 text-[11px] font-medium text-tertiary">
                    CGL {word.yearsAsked.join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Hindi meaning */}
            <div className="mb-3 rounded-xl bg-primary/5 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary mb-0.5">
                Hindi
              </p>
              <p className="text-[18px] font-semibold text-primary">{word.hindiMeaning}</p>
            </div>

            {/* English meaning */}
            <div className="mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-outline mb-0.5">
                English
              </p>
              <p className="text-[15px] text-on-surface leading-relaxed">{word.meaning}</p>
            </div>

            {/* Example */}
            <div className="rounded-xl bg-surface-container-low px-4 py-3 mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-outline mb-1">
                Example
              </p>
              <p className="text-[14px] text-on-surface italic leading-relaxed">
                &ldquo;{word.example}&rdquo;
              </p>
            </div>

            {/* Synonyms + Antonyms */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-secondary/5 px-3 py-2.5 border border-secondary/10">
                <p className="text-[10px] font-bold uppercase tracking-wide text-secondary mb-1">
                  Synonyms
                </p>
                <p className="text-[12px] text-on-surface leading-relaxed">
                  {word.synonyms.join(", ")}
                </p>
              </div>
              <div className="rounded-xl bg-error/5 px-3 py-2.5 border border-error/10">
                <p className="text-[10px] font-bold uppercase tracking-wide text-error mb-1">
                  Antonyms
                </p>
                <p className="text-[12px] text-on-surface leading-relaxed">
                  {word.antonyms.join(", ")}
                </p>
              </div>
            </div>

            {/* Root */}
            <div className="rounded-xl bg-tertiary/5 px-3 py-2.5 border border-tertiary/10 mb-5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-tertiary mb-1">
                Root
              </p>
              <p className="text-[12px] text-on-surface leading-relaxed">{word.root}</p>
            </div>

            {/* Actions — stopPropagation prevents card flip */}
            <div className="flex gap-3">
              <button
                onClick={handleAction("dont_know")}
                disabled={disabled}
                className="flex-1 h-11 rounded-xl border-2 border-outline-variant/30 text-[13px] font-semibold text-on-surface/80 transition-all hover:bg-surface-container-lowest hover:border-outline-variant/50 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Don&apos;t Know
              </button>
              <button
                onClick={handleAction("vault")}
                disabled={disabled}
                className="h-11 px-4 rounded-xl border-2 border-tertiary/25 text-[13px] font-semibold text-tertiary transition-all hover:bg-tertiary/5 active:scale-[0.97] flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Star size={15} />
                Vault
              </button>
              <button
                onClick={handleAction("know")}
                disabled={disabled}
                className="flex-1 h-11 rounded-xl bg-primary text-[13px] font-semibold text-on-primary transition-all hover:bg-primary/90 active:scale-[0.97] flex items-center justify-center gap-1.5 shadow-[0_1px_4px_rgba(37,99,235,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Know This
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Flip back hint */}
            <div className="flex items-center justify-center gap-1.5 mt-4 text-[12px] text-outline/50">
              <RotateCcw size={12} />
              Tap card to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
