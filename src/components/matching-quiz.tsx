"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, X, Loader2, Sparkles, ArrowRight } from "lucide-react";

export interface MatchPair {
  id: string;
  term: string;
  definition: string;
}

interface MatchingQuizProps {
  pairs: MatchPair[];
  onComplete: (score: number, total: number) => void;
}

interface DragState {
  termId: string;
  termText: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export function MatchingQuiz({ pairs, onComplete }: MatchingQuizProps) {
  // Shuffle definitions once on load
  const shuffledPairs = useMemo(() => {
    const arr = [...pairs];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [pairs]);

  // States
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [termSlots, setTermSlots] = useState<Record<string, string | null>>({}); // definitionId -> termId
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, "correct" | "incorrect">>({});
  const [score, setScore] = useState(0);

  // Drag States
  const [drag, setDrag] = useState<DragState | null>(null);
  const [activeHoverSlotId, setActiveHoverSlotId] = useState<string | null>(null);

  // Initialize slots
  useEffect(() => {
    const initialSlots: Record<string, string | null> = {};
    shuffledPairs.forEach((p) => {
      initialSlots[p.id] = null;
    });
    setTermSlots(initialSlots);
  }, [shuffledPairs]);

  const placedTermIds = useMemo(() => {
    return new Set(Object.values(termSlots).filter(Boolean) as string[]);
  }, [termSlots]);

  const allFilled = useMemo(() => {
    return Object.values(termSlots).every((v) => v !== null);
  }, [termSlots]);

  // CLICK-TO-MATCH FALLBACKS
  const handleTermClick = (termId: string) => {
    if (submitted || submitting) return;
    if (selectedTermId === termId) {
      setSelectedTermId(null);
    } else {
      setSelectedTermId(termId);
    }
  };

  const handleSlotClick = (definitionId: string) => {
    if (submitted || submitting) return;

    if (selectedTermId) {
      const nextSlots = { ...termSlots };
      // Clear from previous slot if any
      for (const dId in nextSlots) {
        if (nextSlots[dId] === selectedTermId) {
          nextSlots[dId] = null;
        }
      }
      nextSlots[definitionId] = selectedTermId;
      setTermSlots(nextSlots);
      setSelectedTermId(null);
    } else if (termSlots[definitionId]) {
      setTermSlots((prev) => ({ ...prev, [definitionId]: null }));
    }
  };

  const handleRemoveMatch = (e: React.MouseEvent, definitionId: string) => {
    e.stopPropagation();
    if (submitted || submitting) return;
    setTermSlots((prev) => ({ ...prev, [definitionId]: null }));
  };

  // POINTER EVENT DRAG & DROP ENGINE
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, termId: string, termText: string) => {
    if (submitted || submitting) return;
    e.preventDefault();

    // Select this term for click-to-match fallback as well
    setSelectedTermId(termId);

    setDrag({
      termId,
      termText,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    });
  };

  useEffect(() => {
    if (!drag) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDrag((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentX: e.clientX,
          currentY: e.clientY,
        };
      });

      // Collision detection using elementFromPoint
      const elem = document.elementFromPoint(e.clientX, e.clientY);
      const slotElement = elem?.closest("[data-slot-id]");
      const slotId = slotElement ? slotElement.getAttribute("data-slot-id") : null;
      setActiveHoverSlotId(slotId);
    };

    const handlePointerUp = () => {
      // If dropped over a valid slot
      if (activeHoverSlotId) {
        setTermSlots((prevSlots) => {
          const nextSlots = { ...prevSlots };
          // Remove term from its previous slot
          for (const dId in nextSlots) {
            if (nextSlots[dId] === drag.termId) {
              nextSlots[dId] = null;
            }
          }
          nextSlots[activeHoverSlotId] = drag.termId;
          return nextSlots;
        });
        setSelectedTermId(null);
      }

      setDrag(null);
      setActiveHoverSlotId(null);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [drag, activeHoverSlotId]);

  // Grade Matches
  const handleSubmit = () => {
    if (!allFilled || submitted || submitting) return;
    setSubmitting(true);

    const nextFeedback: Record<string, "correct" | "incorrect"> = {};
    let correctCount = 0;

    for (const defId in termSlots) {
      const placedTermId = termSlots[defId];
      if (placedTermId === defId) {
        nextFeedback[defId] = "correct";
        correctCount += 1;
      } else {
        nextFeedback[defId] = "incorrect";
      }
    }

    setFeedback(nextFeedback);
    setScore(correctCount);
    setSubmitted(true);
    setSubmitting(false);
  };

  const handleReset = () => {
    const clearedSlots: Record<string, string | null> = {};
    shuffledPairs.forEach((p) => {
      clearedSlots[p.id] = null;
    });
    setTermSlots(clearedSlots);
    setSelectedTermId(null);
    setSubmitted(false);
    setSubmitting(false);
    setFeedback({});
    setScore(0);
  };

  const handleNext = () => {
    onComplete(score, pairs.length);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-surface border border-outline-variant/20 shadow-md rounded-[22px] dark:bg-[#121215] dark:border-white/[0.04] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      
      {/* Header instructions */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant/10 dark:border-white/[0.03]">
        <div className="text-left">
          <h3 className="font-display text-[15.5px] font-bold text-on-surface dark:text-white flex items-center gap-1.5">
            <HelpCircle size={15} className="text-primary dark:text-[#60a5fa]" />
            Matching Challenge
          </h3>
          <p className="text-[12px] text-outline dark:text-white/40 mt-0.5">
            Drag words to dropzones, or click a word then its definition target to match.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[220px]">
        
        {/* Left Column: Draggable/Selectable Words */}
        <div className="md:col-span-5 flex flex-wrap md:flex-col gap-2.5 justify-start items-start">
          <p className="text-[10px] font-mono font-bold text-outline/50 uppercase tracking-widest w-full mb-1 text-left dark:text-white/20">
            Drag Words
          </p>
          
          {pairs.map((t) => {
            const isPlaced = placedTermIds.has(t.id);
            const isSelected = selectedTermId === t.id;
            const isCurrentlyDragging = drag?.termId === t.id;

            return (
              <button
                key={t.id}
                onPointerDown={(e) => handlePointerDown(e, t.id, t.term)}
                onClick={() => handleTermClick(t.id)}
                disabled={submitted || submitting || isPlaced}
                style={{ touchAction: "none" }}
                className={`px-4 py-2 rounded-xl border text-[13px] font-bold select-none cursor-grab flex items-center gap-1.5 transition-all ${
                  isPlaced
                    ? "opacity-30 border-transparent bg-surface-container-low text-outline/30 cursor-not-allowed dark:bg-white/[0.01]"
                    : isCurrentlyDragging
                      ? "opacity-0 scale-95"
                      : isSelected
                        ? "border-primary bg-primary/10 text-primary dark:border-[#60a5fa] dark:bg-[#60a5fa]/10 dark:text-[#60a5fa] scale-[1.02] shadow-sm shadow-primary/5"
                        : "border-outline-variant/35 bg-surface text-on-surface hover:bg-surface-container hover:border-outline-variant/65 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-white dark:hover:bg-white/[0.04]"
                }`}
              >
                {t.term}
              </button>
            );
          })}

          {placedTermIds.size === pairs.length && (
            <p className="text-[12px] text-secondary font-bold py-3 flex items-center gap-1 dark:text-[#34d399] animate-pulse">
              <Sparkles size={13} />
              All matches locked!
            </p>
          )}
        </div>

        {/* Right Column: Definitions & Droppable targets */}
        <div className="md:col-span-7 flex flex-col gap-3">
          <p className="text-[10px] font-mono font-bold text-outline/50 uppercase tracking-widest mb-1 text-left dark:text-white/20">
            Definition Slots
          </p>

          {shuffledPairs.map((p) => {
            const placedTermId = termSlots[p.id];
            const placedTerm = pairs.find((x) => x.id === placedTermId);
            const status = feedback[p.id];
            const isHoveredSlot = activeHoverSlotId === p.id;

            // Compute border glow states
            let borderClass = "border-outline-variant/20 bg-surface dark:border-white/[0.04] dark:bg-white/[0.02]";
            if (submitted) {
              borderClass =
                status === "correct"
                  ? "border-emerald-500/40 bg-emerald-500/[0.01] dark:border-[#34d399]/40"
                  : "border-red-500/40 bg-red-500/[0.01] dark:border-red-500/30";
            } else if (isHoveredSlot) {
              borderClass = "border-primary bg-primary/[0.04] dark:border-[#60a5fa] dark:bg-[#60a5fa]/[0.04] scale-[1.01] shadow-sm";
            } else if (placedTermId) {
              borderClass = "border-primary/30 bg-primary/[0.01] dark:border-[#60a5fa]/20";
            }

            return (
              <div
                key={p.id}
                data-slot-id={p.id}
                onClick={() => handleSlotClick(p.id)}
                className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all ${borderClass}`}
              >
                <div className="flex-1 min-w-0 text-left space-y-2.5">
                  {/* Definition */}
                  <p className="text-[13px] text-on-surface/90 leading-relaxed font-bold dark:text-white/80">
                    {p.definition}
                  </p>

                  {/* Drag drop target slot container */}
                  <div className="flex flex-col gap-1.5 items-start">
                    {placedTerm ? (
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-[11.5px] font-black text-primary dark:bg-[#60a5fa]/10 dark:text-[#60a5fa] animate-fade-in">
                        <span>{placedTerm.term}</span>
                        {!submitted && !submitting && (
                          <button
                            onClick={(e) => handleRemoveMatch(e, p.id)}
                            className="text-primary/60 hover:text-primary dark:text-[#60a5fa]/60 dark:hover:text-[#60a5fa] cursor-pointer"
                            title="Remove Match"
                          >
                            <X size={12} className="stroke-[3]" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className={`inline-block text-[11px] font-mono font-bold px-2 py-0.5 border border-dashed rounded-lg transition-all ${
                        isHoveredSlot 
                          ? "border-primary text-primary dark:border-[#60a5fa] dark:text-[#60a5fa]" 
                          : "border-outline-variant/30 text-outline/35 dark:border-white/10 dark:text-white/20"
                      }`}>
                        Drop or Tap here
                      </span>
                    )}

                    {/* Show correct answer if incorrect */}
                    {submitted && status === "incorrect" && (
                      <div className="text-[11px] font-bold text-secondary dark:text-[#34d399] mt-1 flex items-center gap-1 bg-secondary/8 px-2 py-0.5 rounded-md w-fit dark:bg-[#34d399]/10">
                        <span>Correct:</span>
                        <span className="underline">{p.term}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score verification check icons */}
                {submitted && status === "correct" && (
                  <CheckCircle2 size={16} className="text-secondary shrink-0 dark:text-[#34d399] stroke-[3]" />
                )}
                {submitted && status === "incorrect" && (
                  <XCircle size={16} className="text-red-500 shrink-0 dark:text-red-400 stroke-[3]" />
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Action Controls */}
      <div className="mt-6 flex gap-2.5 border-t border-outline-variant/10 dark:border-white/[0.03] pt-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allFilled || submitting}
            className="flex-1 h-11 rounded-xl bg-primary text-[13px] font-bold text-on-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-1.5 dark:bg-[#60a5fa] dark:text-[#0c1929]"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Evaluating...
              </>
            ) : (
              "Submit Matches"
            )}
          </button>
        ) : (
          <>
            <button
              onClick={handleReset}
              className="h-11 px-4 rounded-xl border border-outline-variant/35 text-outline hover:bg-surface-container transition-all flex items-center gap-1.5 active:scale-[0.98] text-[13px] font-bold dark:border-white/10 dark:text-white/60"
            >
              <RotateCcw size={13} />
              Reset
            </button>
            <button
              onClick={handleNext}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-[13px] font-bold text-white hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
            >
              Continue
              <ArrowRight size={14} />
            </button>
          </>
        )}
      </div>

      {/* DYNAMIC ABSOLUTE FLOATING DRAG PORTAL */}
      {drag && (
        <div
          className="fixed pointer-events-none z-50 px-3.5 py-2 rounded-xl border border-primary bg-primary/15 text-[13px] font-black text-primary shadow-xl dark:border-[#60a5fa] dark:bg-[#60a5fa]/15 dark:text-[#60a5fa] flex items-center justify-center"
          style={{
            left: `${drag.currentX}px`,
            top: `${drag.currentY}px`,
            transform: "translate(-50%, -115%) scale(1.08)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
          }}
        >
          {drag.termText}
        </div>
      )}

    </div>
  );
}
