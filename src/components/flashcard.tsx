"use client";

import { useState, useCallback } from "react";
import { Star, ArrowRight, RotateCcw, CornerDownRight } from "lucide-react";

interface FlashcardProps {
  pair: Record<string, unknown>;
  onAction: (action: "know" | "vault" | "dont_know") => void;
  disabled?: boolean;
}

export function Flashcard({ pair, onAction, disabled }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

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

  const id = pair.id as number;
  const word1 = (pair.word1 as string) ?? "";
  const pos1 = (pair.pos1 as string) ?? "";
  const meaning1 = (pair.meaning1 as string) ?? "";
  const hindi1 = (pair.hindi1 as string) ?? "";
  const word2 = (pair.word2 as string) ?? "";
  const pos2 = (pair.pos2 as string) ?? "";
  const meaning2 = (pair.meaning2 as string) ?? "";
  const hindi2 = (pair.hindi2 as string) ?? "";

  return (
    <div className="w-full max-w-md mx-auto" style={{ perspective: "1200px" }}>
      <div
        className="relative w-full cursor-pointer"
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
          className="absolute inset-0 w-full rounded-[24px] border border-emerald-500/10 bg-surface shadow-md dark:bg-[#121215] dark:border-white/[0.04] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            pointerEvents: flipped ? "none" : "auto",
            backgroundImage: "radial-gradient(circle at 10% 10%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)",
          }}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-[#fbbf24] to-emerald-600" />

          {/* Top category details */}
          <div className="px-6 pt-5 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-widest text-outline/50 uppercase dark:text-white/30">
              Precision Pathway
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-[#34d399] uppercase tracking-wider">
              Pair #{id}
            </span>
          </div>

          {/* Homonym word comparison block */}
          <div className="px-6 py-14 flex items-center justify-center gap-4">
            <div className="text-center space-y-1 flex-1">
              <h2 className="font-display text-[28px] font-black text-on-surface dark:text-white leading-tight">
                {word1}
              </h2>
              <span className="inline-block text-[10px] font-mono font-bold text-emerald-600 dark:text-[#34d399] bg-emerald-500/5 px-2 py-0.5 rounded-md">
                {pos1}
              </span>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container border border-outline-variant/35 text-[11px] font-black text-outline/80 dark:bg-white/[0.03] dark:border-white/10 dark:text-white/50">
              vs
            </div>

            <div className="text-center space-y-1 flex-1">
              <h2 className="font-display text-[28px] font-black text-on-surface dark:text-white leading-tight">
                {word2}
              </h2>
              <span className="inline-block text-[10px] font-mono font-bold text-emerald-600 dark:text-[#34d399] bg-emerald-500/5 px-2 py-0.5 rounded-md">
                {pos2}
              </span>
            </div>
          </div>

          {/* Prompt */}
          <div className="px-6 pb-5 flex justify-center items-center gap-1.5 text-[11px] font-mono font-bold text-outline/65 dark:text-white/30 border-t border-outline-variant/10 dark:border-white/[0.03] pt-3.5">
            <RotateCcw size={12} className="animate-pulse" />
            <span>Click card to reveal definitions</span>
          </div>
        </div>

        {/* ===== DESIGNER BACK FACE ===== */}
        <div
          className="w-full rounded-[24px] border border-emerald-500/10 bg-surface shadow-md dark:bg-[#121215] dark:border-white/[0.04] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: flipped ? "auto" : "none",
            backgroundImage: "radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.02) 0%, transparent 60%)",
          }}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-[#fbbf24] to-emerald-500" />

          <div className="p-6 space-y-5 text-left">
            
            {/* Word 1 card segment */}
            <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.01] dark:bg-white/[0.01] space-y-2">
              <div className="flex items-baseline gap-2 border-b border-outline-variant/10 pb-1.5 dark:border-white/[0.03]">
                <h4 className="font-display text-[16px] font-black text-emerald-600 dark:text-[#34d399]">
                  {word1}
                </h4>
                <span className="text-[10px] font-mono font-bold text-outline/65">({pos1})</span>
              </div>
              <p className="text-[13.5px] font-medium leading-relaxed text-on-surface dark:text-white">
                {meaning1}
              </p>
              {hindi1 && (
                <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-lg text-[12px] font-black dark:bg-[#34d399]/15 dark:text-[#34d399]">
                  <CornerDownRight size={11} className="stroke-[2.5]" />
                  <span>{hindi1}</span>
                </div>
              )}
            </div>

            {/* Word 2 card segment */}
            <div className="p-4 rounded-xl border border-indigo-500/10 bg-indigo-500/[0.01] dark:bg-white/[0.01] space-y-2">
              <div className="flex items-baseline gap-2 border-b border-outline-variant/10 pb-1.5 dark:border-white/[0.03]">
                <h4 className="font-display text-[16px] font-black text-indigo-600 dark:text-[#60a5fa]">
                  {word2}
                </h4>
                <span className="text-[10px] font-mono font-bold text-outline/65">({pos2})</span>
              </div>
              <p className="text-[13.5px] font-medium leading-relaxed text-on-surface dark:text-white">
                {meaning2}
              </p>
              {hindi2 && (
                <div className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded-lg text-[12px] font-black dark:bg-indigo-500/15 dark:text-[#60a5fa]">
                  <CornerDownRight size={11} className="stroke-[2.5]" />
                  <span>{hindi2}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-3 border-t border-outline-variant/10 dark:border-white/[0.03]">
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
