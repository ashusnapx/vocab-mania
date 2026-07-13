"use client";

import { useState } from "react";
import { Star, Eye, ArrowRight } from "lucide-react";
import type { Word } from "@/lib/words";

interface FlashcardProps {
  word: Word;
  onAction: (action: "know" | "dont_know" | "vault") => void;
}

export function Flashcard({ word, onAction }: FlashcardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Card */}
      <div className="card-surface overflow-hidden">
        {/* Front — Word only (recall phase) */}
        {!revealed && (
          <div
            className="flex flex-col items-center justify-center py-16 px-6 cursor-pointer select-none"
            onClick={() => setRevealed(true)}
          >
            <h2 className="font-display text-[36px] font-semibold text-on-surface mb-2">
              {word.word}
            </h2>
            <p className="text-[14px] text-outline mb-1">{word.pronunciation}</p>
            <div className="flex gap-2 mb-6">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[12px] font-medium text-primary capitalize">
                {word.partOfSpeech}
              </span>
              {word.yearsAsked && word.yearsAsked.length > 0 && (
                <span className="rounded-full bg-tertiary/10 px-2.5 py-0.5 text-[12px] font-medium text-tertiary">
                  CGL {word.yearsAsked.join(", ")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[13px] text-outline">
              <Eye size={14} />
              Tap to reveal meaning
            </div>
          </div>
        )}

        {/* Back — Meaning + actions */}
        {revealed && (
          <div className="p-6">
            {/* Word header */}
            <div className="mb-4">
              <h2 className="font-display text-[28px] font-semibold text-on-surface mb-1">
                {word.word}
              </h2>
              <div className="flex gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[12px] font-medium text-primary capitalize">
                  {word.partOfSpeech}
                </span>
                {word.yearsAsked && word.yearsAsked.length > 0 && (
                  <span className="rounded-full bg-tertiary/10 px-2.5 py-0.5 text-[12px] font-medium text-tertiary">
                    CGL {word.yearsAsked.join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Hindi meaning */}
            <div className="mb-3">
              <p className="text-[12px] text-outline font-medium mb-0.5">Hindi</p>
              <p className="text-[18px] text-primary font-medium">{word.hindiMeaning}</p>
            </div>

            {/* English meaning */}
            <div className="mb-3">
              <p className="text-[12px] text-outline font-medium mb-0.5">English</p>
              <p className="text-[15px] text-on-surface">{word.meaning}</p>
            </div>

            {/* Example */}
            <div className="rounded-xl bg-surface-hover p-4 mb-4">
              <p className="text-[12px] text-outline font-medium mb-1">Example</p>
              <p className="text-[14px] text-on-surface italic">&ldquo;{word.example}&rdquo;</p>
            </div>

            {/* Synonyms + Antonyms */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-secondary/[0.06] p-3 border border-secondary/10">
                <p className="text-[11px] font-medium text-secondary mb-0.5">Synonyms</p>
                <p className="text-[13px] text-on-surface">{word.synonyms.join(", ")}</p>
              </div>
              <div className="rounded-xl bg-red-500/[0.06] p-3 border border-red-500/10">
                <p className="text-[11px] font-medium text-red-500 mb-0.5">Antonyms</p>
                <p className="text-[13px] text-on-surface">{word.antonyms.join(", ")}</p>
              </div>
            </div>

            {/* Root */}
            <div className="rounded-xl bg-tertiary/[0.06] p-3 border border-tertiary/10 mb-6">
              <p className="text-[11px] font-medium text-tertiary mb-0.5">Root</p>
              <p className="text-[13px] text-on-surface">{word.root}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => onAction("dont_know")}
                className="flex-1 h-12 rounded-xl border-2 border-outline-variant/40 text-[14px] font-medium text-on-surface transition-all hover:bg-surface-hover active:scale-[0.98]"
              >
                Don&apos;t Know
              </button>
              <button
                onClick={() => onAction("vault")}
                className="h-12 px-4 rounded-xl border-2 border-tertiary/30 text-[14px] font-medium text-tertiary transition-all hover:bg-tertiary/5 active:scale-[0.98] flex items-center gap-1.5"
              >
                <Star size={16} />
                Vault
              </button>
              <button
                onClick={() => onAction("know")}
                className="flex-1 h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary transition-all hover:bg-primary-hover active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                Know This
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
