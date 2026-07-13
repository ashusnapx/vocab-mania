"use client";

import { useState } from "react";
import { Star, Flame, Sparkles, Check, X, ShieldAlert, Award, ArrowRight } from "lucide-react";

export function BentoFeatures() {
  // Homonym Flip Card state
  const [flipped, setFlipped] = useState(false);

  // Vault Unlock state
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  // Mini Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<"idle" | "correct" | "incorrect">("idle");

  const handleQuizAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === 2) { // "Compliment" (Praise) is correct
      setAnswerState("correct");
    } else {
      setAnswerState("incorrect");
    }
  };

  const handleQuizReset = () => {
    setSelectedAnswer(null);
    setAnswerState("idle");
  };

  return (
    <section className="bg-[#fffdf8] py-20 dark:bg-[#0a0a0b] transition-colors duration-300">
      <div className="section-wrap">
        <div className="mx-auto max-w-2xl text-center mb-16 space-y-3">
          <p className="text-[11px] font-bold text-primary dark:text-[#60a5fa] uppercase tracking-widest">
            Interactive Product Tour
          </p>
          <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight text-on-surface dark:text-white sm:text-[40px]">
            Designed for deliberate practice.
          </h2>
          <p className="text-[15px] leading-relaxed text-outline/80 dark:text-white/50 max-w-[540px] mx-auto">
            Interact with the cards below to see how our micro-learning systems keep engagement high and retention permanent.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-12 auto-rows-[220px]">
          
          {/* Card 1: Interactive Spelling Card (Homonyms) - TALL (Col Span 4, Row Span 2) */}
          <div 
            onClick={() => setFlipped(!flipped)}
            className="md:col-span-3 lg:col-span-4 row-span-2 group relative rounded-[24px] border border-outline-variant/20 bg-surface p-6 shadow-sm dark:border-white/[0.04] dark:bg-surface-container overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-md hover:border-outline-variant/40 dark:hover:border-white/10"
          >
            <div className="flex justify-between items-center z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-[#60a5fa]">
                Interactive Homonyms
              </span>
              <span className="text-[10px] font-semibold text-outline/50 dark:text-white/30">
                Click to Flip
              </span>
            </div>

            {/* Flipping block wrapper */}
            <div className="relative w-full h-[220px] flex items-center justify-center perspective-1000 my-auto">
              <div 
                className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${
                  flipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center backface-hidden">
                  <h3 className="font-display text-[26px] font-black text-on-surface dark:text-white mb-2">
                    Canvas
                  </h3>
                  <p className="text-[12px] font-medium text-outline/70 dark:text-white/40">
                    noun • /ˈkæn.vəs/
                  </p>
                  <p className="text-[13px] text-outline mt-3 dark:text-white/60 max-w-[200px]">
                    A strong, coarse unbleached cloth used for making sails and tents.
                  </p>
                  <span className="text-[11px] font-bold text-[#b45309] dark:text-[#fbbf24] mt-2 block">
                    किरमिच, पाल का कपड़ा
                  </span>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center backface-hidden rotate-y-180">
                  <h3 className="font-display text-[26px] font-black text-on-surface dark:text-white mb-2">
                    Canvass
                  </h3>
                  <p className="text-[12px] font-medium text-outline/70 dark:text-white/40">
                    verb • /ˈkæn.vəs/
                  </p>
                  <p className="text-[13px] text-outline mt-3 dark:text-white/60 max-w-[200px]">
                    To solicit votes from electors or seek support.
                  </p>
                  <span className="text-[11px] font-bold text-[#b45309] dark:text-[#fbbf24] mt-2 block">
                    वोट मांगना, प्रचार करना
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left text-[11px] text-outline/50 dark:text-white/30 font-medium border-t border-outline-variant/10 pt-4 dark:border-white/[0.04] z-10">
              Double-letters are often source of exam spelling errors.
            </div>
          </div>

          {/* Card 2: Interactive Playable Quiz - WIDE & TALL (Col Span 8, Row Span 2) */}
          <div className="md:col-span-3 lg:col-span-5 row-span-2 relative rounded-[24px] border border-outline-variant/20 bg-surface p-6 shadow-sm dark:border-white/[0.04] dark:bg-surface-container overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-[#60a5fa]">
                  Rapid Quiz Demo
                </span>
                {answerState !== "idle" && (
                  <button 
                    onClick={handleQuizReset}
                    className="text-[10px] font-bold text-outline hover:text-on-surface dark:hover:text-white cursor-pointer"
                  >
                    Reset Quiz
                  </button>
                )}
              </div>
              
              <h3 className="text-[15.5px] font-bold text-on-surface dark:text-white leading-snug mb-4">
                Choose the correct word to fill in the blank: <br />
                <span className="text-primary dark:text-[#60a5fa] font-medium">
                  &ldquo;She gave him a nice __________ on his presentation.&rdquo;
                </span>
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {[
                  { text: "Complement (to make complete)", index: 1 },
                  { text: "Compliment (expression of praise)", index: 2 },
                  { text: "Complament (invalid spelling)", index: 3 },
                ].map((opt) => {
                  const isSelected = selectedAnswer === opt.index;
                  let optStyle = "border-outline-variant/30 hover:bg-surface-container-low dark:border-white/10 dark:hover:bg-white/[0.02]";
                  
                  if (isSelected) {
                    if (opt.index === 2) {
                      optStyle = "border-secondary bg-secondary/8 text-secondary dark:border-[#34d399] dark:bg-[#34d399]/8 dark:text-[#34d399]";
                    } else {
                      optStyle = "border-red-500 bg-red-500/8 text-red-500 dark:border-red-400 dark:bg-red-400/8 dark:text-red-400";
                    }
                  } else if (selectedAnswer !== null && opt.index === 2) {
                    // Show correct answer anyway if user selected wrong
                    optStyle = "border-secondary text-secondary dark:border-[#34d399] dark:text-[#34d399]";
                  }

                  return (
                    <button
                      key={opt.index}
                      onClick={() => handleQuizAnswer(opt.index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-[13px] font-medium transition-all flex items-center justify-between ${optStyle}`}
                    >
                      {opt.text}
                      {isSelected && opt.index === 2 && <Check size={14} className="text-secondary dark:text-[#34d399] shrink-0" />}
                      {isSelected && opt.index !== 2 && <X size={14} className="text-red-500 dark:text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer feedback */}
            <div className="h-6 mt-2 flex items-center justify-between text-[11px] font-bold">
              {answerState === "correct" && (
                <span className="text-secondary dark:text-[#34d399] flex items-center gap-1 animate-pulse">
                  <Check size={12} /> Correct! +10 XP awarded to profile.
                </span>
              )}
              {answerState === "incorrect" && (
                <span className="text-red-500 dark:text-red-400">
                  Incorrect! Focus on similar-sounding homonyms.
                </span>
              )}
              {answerState === "idle" && (
                <span className="text-outline/40 dark:text-white/20">
                  Choose an option to check spelling differences.
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Memory Vault - TALL (Col Span 3) */}
          <div 
            onMouseEnter={() => setVaultUnlocked(true)}
            onMouseLeave={() => setVaultUnlocked(false)}
            className="md:col-span-3 lg:col-span-3 row-span-2 group relative rounded-[24px] border border-outline-variant/20 bg-surface p-6 shadow-sm dark:border-white/[0.04] dark:bg-surface-container overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-[#60a5fa]">
                Memory Vault
              </span>
              <span className="text-[10px] font-semibold text-outline/50 dark:text-white/30">
                Hover to Open
              </span>
            </div>

            {/* Vault Interactive Illustration */}
            <div className="relative my-auto flex flex-col items-center justify-center text-center">
              <div 
                className={`flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high transition-transform duration-300 dark:bg-white/[0.04] ${
                  vaultUnlocked ? "scale-110 border border-primary/20 dark:border-[#60a5fa]/20" : ""
                }`}
              >
                <Star 
                  size={24} 
                  className={`transition-all duration-300 ${
                    vaultUnlocked ? "text-tertiary dark:text-[#fbbf24] fill-current rotate-[72deg]" : "text-outline/45"
                  }`} 
                />
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-[14px] font-bold text-on-surface dark:text-white">
                  {vaultUnlocked ? "Vault Unlocked" : "Vault Sealed"}
                </p>
                <p className="text-[11.5px] text-outline dark:text-white/50 max-w-[140px] mx-auto leading-normal">
                  {vaultUnlocked ? "Starred items seeded in study cycle!" : "Star confusing words to keep them locked."}
                </p>
              </div>

              {/* Float indicators */}
              {vaultUnlocked && (
                <div className="absolute top-0 right-4 text-[10px] font-bold text-secondary dark:text-[#34d399] animate-bounce">
                  +10 XP
                </div>
              )}
            </div>

            <div className="text-[10px] text-outline/40 dark:text-white/20 font-semibold border-t border-outline-variant/10 pt-4 dark:border-white/[0.04]">
              Secures retention for exam days.
            </div>
          </div>

          {/* Card 4: Streak Calendar - WIDE (Col Span 6, Row Span 1) */}
          <div className="md:col-span-3 lg:col-span-6 row-span-1 rounded-[24px] border border-outline-variant/20 bg-surface p-6 shadow-sm dark:border-white/[0.04] dark:bg-surface-container flex items-center justify-between hover:shadow-md transition-all duration-300">
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-[#60a5fa]">
                Consistency Heatmap
              </span>
              <h4 className="font-display text-[17px] font-bold text-on-surface dark:text-white">
                Airbnb-Style Streak
              </h4>
              <p className="text-[12px] text-outline dark:text-white/50 max-w-[200px] leading-relaxed">
                Build study habits that stick. Each active day flashes a flame indicator.
              </p>
            </div>

            {/* mini Calendar grid representation */}
            <div className="flex flex-col gap-1 items-end shrink-0">
              <div className="flex gap-1.5 items-center mb-1">
                <Flame size={14} className="text-secondary dark:text-[#34d399] fill-current animate-pulse" />
                <span className="text-[11px] font-bold text-on-surface dark:text-white">14 Days Streak</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 14 }).map((_, idx) => {
                  const isActive = idx === 3 || idx === 4 || idx === 5 || idx === 8 || idx === 10 || idx === 11 || idx === 12 || idx === 13;
                  return (
                    <div 
                      key={idx}
                      className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center text-[7px] font-black transition-colors ${
                        isActive 
                          ? "bg-gradient-to-br from-red-500 to-orange-500 border-transparent text-white"
                          : "bg-surface-container-low border-outline-variant/20 dark:border-white/[0.04] dark:bg-white/[0.02]"
                      }`}
                    >
                      {isActive && "🔥"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 5: Progression Ranks - WIDE (Col Span 6, Row Span 1) */}
          <div className="md:col-span-3 lg:col-span-6 row-span-1 rounded-[24px] border border-outline-variant/20 bg-surface p-6 shadow-sm dark:border-white/[0.04] dark:bg-surface-container flex items-center justify-between hover:shadow-md transition-all duration-300">
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-[#60a5fa]">
                Infinite Ranks
              </span>
              <h4 className="font-display text-[17px] font-bold text-on-surface dark:text-white">
                Dynamic Ranks & Badges
              </h4>
              <p className="text-[12px] text-outline dark:text-white/50 max-w-[220px] leading-relaxed">
                Move dynamically from Prarambhik to Acharya or Maharathi. Locked to dynamic mathematical progression.
              </p>
            </div>

            {/* mini progression badges */}
            <div className="flex gap-2">
              {[
                { emoji: "🐣", name: "Level 2", color: "#78716c", active: false },
                { emoji: "⚔️", name: "Level 14", color: "#2563eb", active: true },
                { emoji: "🎓", name: "Level 25", color: "#059669", active: false },
              ].map((badge) => (
                <div 
                  key={badge.name} 
                  className={`p-2.5 rounded-xl border flex flex-col items-center transition-all ${
                    badge.active
                      ? "border-primary bg-primary/8 dark:border-[#60a5fa] dark:bg-[#60a5fa]/8 scale-105"
                      : "border-outline-variant/10 opacity-30"
                  }`}
                >
                  <span className="text-[16px] mb-0.5">{badge.emoji}</span>
                  <span className="text-[9px] font-black text-on-surface dark:text-white">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
