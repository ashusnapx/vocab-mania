"use client";

import { useState, useCallback } from "react";
import { Star, ArrowRight, RotateCcw, HelpCircle, CornerDownRight } from "lucide-react";

interface WordFlashcardProps {
  word: Record<string, unknown>;
  onAction: (action: "know" | "vault" | "dont_know") => void;
  disabled?: boolean;
}

export function WordFlashcard({ word, onAction, disabled }: WordFlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  const w = word;
  const wordText = (w.word as string) ?? "";
  const partOfSpeech = (w.part_of_speech ?? w.partOfSpeech ?? "") as string;
  const meaning = (w.meaning as string) ?? "";
  const hindiMeaning = (w.hindi_meaning ?? w.hindiMeaning ?? "") as string;
  const example = (w.example as string) ?? "";
  const category = (w.category as string) ?? "Word";
  const synonyms = (w.synonyms as string[]) ?? [];
  const pronunciation = (w.pronunciation as string) ?? "";

  const handleFlip = useCallback(() => {
    if (!disabled) setFlipped((f) => !f);
  }, [disabled]);

  const handleAction = useCallback(
    (action: "know" | "vault" | "dont_know") => (e: React.MouseEvent) => {
      e.stopPropagation();
      onAction(action);
    },
    [onAction]
  );

  return (
    <div className="w-full max-w-md mx-auto" style={{ perspective: "1200px" }}>
      <div
        className="relative w-full cursor-pointer transition-all duration-300"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
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
        
        {/* ===== DESIGNER FRONT FACE ===== */}
        <div
          className="absolute inset-0 w-full rounded-[24px] border border-indigo-500/10 bg-surface shadow-md dark:bg-[#121215] dark:border-white/[0.04] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            pointerEvents: flipped ? "none" : "auto",
            backgroundImage: "radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)",
          }}
        >
          {/* Subtle colored top stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-[#fbbf24] to-indigo-600" />

          {/* Top meta details */}
          <div className="px-6 pt-5 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-widest text-outline/50 uppercase dark:text-white/30">
              Vocabulary Path
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-[#60a5fa] uppercase tracking-wider">
              {category || "Word"}
            </span>
          </div>

          {/* Main Word block */}
          <div className="px-8 py-16 text-center space-y-4">
            <h2 className="font-display text-[40px] font-black tracking-tight text-on-surface dark:text-white leading-tight">
              {wordText}
            </h2>

            {/* Pronunciation & POS under monospace format */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-container-low border border-outline-variant/20 dark:bg-white/[0.02] dark:border-white/[0.04]">
              <span className="text-[11.5px] font-mono font-bold text-indigo-600 dark:text-[#60a5fa]">
                {partOfSpeech}
              </span>
              {pronunciation && (
                <>
                  <span className="h-2 w-[1px] bg-outline-variant/30" />
                  <span className="text-[11.5px] font-mono text-outline/70 dark:text-white/40">
                    {pronunciation}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Tap instructions */}
          <div className="px-6 pb-5 flex justify-center items-center gap-1.5 text-[11px] font-mono font-bold text-outline/65 dark:text-white/30 border-t border-outline-variant/10 dark:border-white/[0.03] pt-3.5">
            <RotateCcw size={12} className="animate-pulse" />
            <span>Click card to reveal context</span>
          </div>
        </div>

        {/* ===== DESIGNER BACK FACE ===== */}
        <div
          className="w-full rounded-[24px] border border-indigo-500/10 bg-surface shadow-md dark:bg-[#121215] dark:border-white/[0.04] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: flipped ? "auto" : "none",
            backgroundImage: "radial-gradient(circle at 90% 90%, rgba(99, 102, 241, 0.02) 0%, transparent 60%)",
          }}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-[#fbbf24] to-indigo-500" />

          <div className="p-6 space-y-6 text-left">
            {/* Header: Word Title */}
            <div className="flex items-baseline gap-2.5 border-b border-outline-variant/10 pb-3 dark:border-white/[0.03]">
              <h3 className="font-display text-[24px] font-black text-indigo-600 dark:text-[#60a5fa] leading-none">
                {wordText}
              </h3>
              <span className="text-[11px] font-mono font-bold text-outline/65 capitalize">
                ({partOfSpeech})
              </span>
            </div>

            {/* Core Definition block */}
            <div className="space-y-2">
              <p className="text-[14.5px] font-medium leading-relaxed text-on-surface dark:text-white">
                {meaning}
              </p>

              {/* Hindi Meaning as a clean Highlight block */}
              {hindiMeaning && (
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-3 py-1 rounded-xl text-[13px] font-black dark:bg-[#34d399]/10 dark:text-[#34d399] dark:border-[#34d399]/20 shadow-sm">
                  <CornerDownRight size={13} className="stroke-[2.5]" />
                  <span>{hindiMeaning}</span>
                </div>
              )}
            </div>

            {/* Example sentence styled as a premium blockquote */}
            {example && (
              <div className="relative pl-3.5 border-l-3 border-indigo-500/40 py-1 bg-surface-container-lowest/40 dark:bg-white/[0.01]">
                <p className="text-[10px] font-mono font-bold text-outline/50 uppercase tracking-widest mb-1.5 dark:text-white/20">
                  Sentence Context
                </p>
                <p className="text-[13px] font-serif italic text-on-surface/90 dark:text-white/80 leading-relaxed">
                  &ldquo;{example}&rdquo;
                </p>
              </div>
            )}

            {/* Synonyms pill group */}
            {synonyms.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-mono font-bold text-outline/50 uppercase tracking-widest dark:text-white/20">
                  Equivalent Synonyms
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {synonyms.slice(0, 4).map((syn) => (
                    <span
                      key={syn}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-500/5 text-indigo-600 border border-indigo-500/10 dark:bg-indigo-500/15 dark:text-[#60a5fa] dark:border-indigo-500/20"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom study Action Keys */}
            <div className="flex gap-2.5 pt-2 border-t border-outline-variant/10 dark:border-white/[0.03]">
              <button
                onClick={handleAction("dont_know")}
                disabled={disabled}
                className="flex-1 h-10 rounded-xl border border-red-500/30 bg-red-500/5 text-[12px] font-bold text-red-600 hover:bg-red-500/10 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed dark:border-red-500/20 dark:text-red-400 dark:bg-red-500/10 transition-all"
              >
                Don&apos;t Know
              </button>
              <button
                onClick={handleAction("vault")}
                disabled={disabled}
                className="h-10 px-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 text-[12px] font-bold text-amber-600 hover:bg-amber-500/10 active:scale-[0.97] flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed dark:border-amber-500/20 dark:text-[#fbbf24] dark:bg-amber-500/10 transition-all"
              >
                <Star size={13} className="fill-current" />
                Vault
              </button>
              <button
                onClick={handleAction("know")}
                disabled={disabled}
                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-[12.5px] font-bold text-white hover:opacity-95 active:scale-[0.97] flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 disabled:opacity-40 disabled:cursor-not-allowed dark:from-[#34d399] dark:to-[#059669] dark:text-[#022c22] transition-all"
              >
                Know This
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Back flip prompts */}
            <div className="flex items-center justify-center gap-1 mt-2 text-[11px] font-mono font-bold text-outline/50 dark:text-white/20">
              <RotateCcw size={11} />
              <span>Click card to inspect front face</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
