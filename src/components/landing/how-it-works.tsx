"use client";

import { useState } from "react";
import { Star, Brain, Award, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Collect & Star Confusions",
    description: "Go through high-frequency flashcard decks. Star confusing synonyms, homonyms, or idioms on the fly to seal them instantly in your Memory Vault.",
    icon: Star,
    color: "#fbbf24",
  },
  {
    number: "02",
    title: "Adaptive Retention Quizzes",
    description: "Our system generates adaptive quiz sessions. Homonyms fetch spelling pair traps, and words pull customized contextual distractors to challenge your retention.",
    icon: Brain,
    color: "#2563eb",
  },
  {
    number: "03",
    title: "Dynamically Scale Ranks",
    description: "Earn XP points on quiz accuracy and daily streaks. Watch your numeric levels progress and unlock high-tier badges like Saksham, Praveen, and Acharya.",
    icon: Award,
    color: "#059669",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="bg-[#fffdf8] py-20 dark:bg-[#0a0a0b] border-t border-outline-variant/10 dark:border-white/[0.03] transition-colors duration-300">
      <div className="section-wrap">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left: Content & Interactive timeline */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-primary dark:text-[#60a5fa] uppercase tracking-widest">
                The Study Engine
              </p>
              <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight text-on-surface dark:text-white sm:text-[40px]">
                How Vocab Mania Works
              </h2>
              <p className="text-[15px] leading-relaxed text-outline/80 dark:text-white/50 max-w-[480px]">
                Our architecture focuses on spaced recall. Instead of passive reading, we trigger retrieval to establish permanent neural pathways.
              </p>
            </div>

            {/* Steps list */}
            <div className="space-y-4 relative">
              {/* Connecting line */}
              <div className="absolute left-[26px] top-6 bottom-6 w-0.5 bg-outline-variant/30 dark:bg-white/10" />

              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep === idx;

                return (
                  <div
                    key={step.number}
                    onMouseEnter={() => setActiveStep(idx)}
                    className={`relative flex gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "border-outline-variant bg-surface-container shadow-sm dark:border-white/10"
                        : "border-transparent hover:bg-surface-container/20"
                    }`}
                  >
                    {/* Circle icon */}
                    <div 
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                        isActive ? "scale-105 shadow-sm" : "opacity-60"
                      }`}
                      style={{ 
                        backgroundColor: isActive ? `${step.color}15` : "transparent",
                        border: `1px solid ${isActive ? `${step.color}30` : "rgba(120,113,108,0.15)"}`
                      }}
                    >
                      <Icon size={16} style={{ color: isActive ? step.color : "#78716c" }} />
                    </div>

                    {/* Step details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-outline/50 dark:text-white/30">
                          {step.number}
                        </span>
                        <h4 className="font-display text-[15.5px] font-bold text-on-surface dark:text-white">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-[13.5px] leading-relaxed text-outline/80 dark:text-white/50">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Immersive visual preview wrapper */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] aspect-[4/3] rounded-[24px] border border-outline-variant/20 bg-surface p-6 shadow-xl dark:border-white/[0.06] dark:bg-surface-container flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.02] to-secondary/[0.02]" />

              {/* Dynamic preview block */}
              {activeStep === 0 && (
                <div className="my-auto space-y-4 text-center animate-fade-in">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fbbf24]/10 text-[#fbbf24]">
                    <Star size={24} className="fill-current" />
                  </div>
                  <h4 className="font-display text-[18px] font-bold text-on-surface dark:text-white">
                    Step 1: Build Your Vault
                  </h4>
                  <p className="text-[13px] text-outline dark:text-white/60 max-w-[280px] mx-auto leading-relaxed">
                    Instantly save words like &ldquo;Transient&rdquo; or &ldquo;Evanescent&rdquo; during flashcard loops. Keep them isolated for revision.
                  </p>
                </div>
              )}

              {activeStep === 1 && (
                <div className="my-auto space-y-4 text-center animate-fade-in">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563eb]/10 text-[#2563eb]">
                    <Brain size={24} />
                  </div>
                  <h4 className="font-display text-[18px] font-bold text-on-surface dark:text-white">
                    Step 2: Fight Distractors
                  </h4>
                  <p className="text-[13px] text-outline dark:text-white/60 max-w-[280px] mx-auto leading-relaxed">
                    Custom-built options like spelling mutations and related definitions verify that you genuinely recognize correct word semantics.
                  </p>
                </div>
              )}

              {activeStep === 2 && (
                <div className="my-auto space-y-4 text-center animate-fade-in">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#059669]/10 text-[#059669]">
                    <Award size={24} />
                  </div>
                  <h4 className="font-display text-[18px] font-bold text-on-surface dark:text-white">
                    Step 3: Level Up Ranks
                  </h4>
                  <p className="text-[13px] text-outline dark:text-white/60 max-w-[280px] mx-auto leading-relaxed">
                    Experience levels recalculated in real time from your XP transactions. Unlock Maharathi and Acharya ranks to confirm your mastery.
                  </p>
                </div>
              )}

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 z-10">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeStep === i ? "w-6 bg-primary dark:bg-[#60a5fa]" : "w-1.5 bg-outline-variant/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
