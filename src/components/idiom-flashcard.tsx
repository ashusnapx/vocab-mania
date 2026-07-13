"use client";

import { useState, useCallback } from "react";
import { Star, ArrowRight, RotateCcw, Quote, CornerDownRight } from "lucide-react";

interface IdiomFlashcardProps {
  idiom: Record<string, unknown>;
  onAction: (action: "know" | "vault" | "dont_know") => void;
  disabled?: boolean;
}

export function IdiomFlashcard({ idiom, onAction, disabled }: IdiomFlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  const item = idiom;
  const idiomText = (item.idiom as string) ?? "";
  const meaning = (item.meaning as string) ?? "";
  const hindiMeaning = (item.hindi as string) ?? "";
  const type = ((item.type as string) ?? "idiom").toLowerCase();

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
          className="absolute inset-0 w-full rounded-[24px] border border-amber-500/10 bg-surface shadow-md dark:bg-[#121215] dark:border-white/[0.04] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            pointerEvents: flipped ? "none" : "auto",
            minHeight: "280px",
            backgroundImage: "radial-gradient(circle at 10% 10%, rgba(245, 158, 11, 0.03) 0%, transparent 50%)",
          }}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-primary to-amber-600" />

          {/* Top category details */}
          <div className="px-6 pt-5 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-widest text-outline/50 uppercase dark:text-white/30">
              Expression Pathway
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-[#fbbf24] uppercase tracking-wider">
              {type === "phrase" ? "Phrase" : "Idiom"}
            </span>
          </div>

          {/* Core Text */}
          <div className="px-8 py-10 flex-1 flex flex-col items-center justify-center space-y-4">
            <Quote size={20} className="text-amber-500/35 fill-current" />
            <h2 className="font-serif text-[24px] font-black text-on-surface text-center leading-relaxed tracking-tight dark:text-white max-w-sm italic">
              &ldquo;{idiomText}&rdquo;
            </h2>
          </div>

          {/* Prompt */}
          <div className="px-6 pb-5 flex justify-center items-center gap-1.5 text-[11px] font-mono font-bold text-outline/65 dark:text-white/30 border-t border-outline-variant/10 dark:border-white/[0.03] pt-3.5">
            <RotateCcw size={12} className="animate-pulse" />
            <span>Click card to reveal meaning</span>
          </div>
        </div>

        {/* ===== DESIGNER BACK FACE ===== */}
        <div
          className="w-full rounded-[24px] border border-amber-500/10 bg-surface shadow-md dark:bg-[#121215] dark:border-white/[0.04] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: flipped ? "auto" : "none",
            minHeight: "280px",
            backgroundImage: "radial-gradient(circle at 90% 90%, rgba(245, 158, 11, 0.02) 0%, transparent 60%)",
          }}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-primary to-amber-500" />

          <div className="p-6 space-y-6 text-left">
            {/* Header: Title */}
            <div className="flex items-baseline justify-between border-b border-outline-variant/10 pb-3 dark:border-white/[0.03] gap-4">
              <h3 className="font-serif text-[18px] font-black text-amber-600 dark:text-[#fbbf24] leading-normal italic">
                &ldquo;{idiomText}&rdquo;
              </h3>
              <span className="text-[10px] font-mono font-bold text-outline/65 uppercase tracking-wider shrink-0">
                ({type})
              </span>
            </div>

            {/* Core Translation & Meaning */}
            <div className="space-y-3.5">
              <p className="text-[14.5px] font-medium leading-relaxed text-on-surface dark:text-white">
                {meaning}
              </p>

              {/* Hindi Translation Highlight Block */}
              {hindiMeaning && (
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-3 py-1 rounded-xl text-[13px] font-black dark:bg-[#34d399]/10 dark:text-[#34d399] dark:border-[#34d399]/20 shadow-sm">
                  <CornerDownRight size={13} className="stroke-[2.5]" />
                  <span>{hindiMeaning}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-2.5 pt-4 border-t border-outline-variant/10 dark:border-white/[0.03]">
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
