"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How does the Spaced Repetition system work?",
    a: "When you view flashcards, marking words as 'I Know' updates their status in the database. The platform uses this data to schedule reviews at increasing intervals, ensuring words are queried right before you forget them.",
  },
  {
    q: "Why are homonyms and idioms unlocked automatically?",
    a: "Unlike standard vocabulary words which generate dynamic quiz distractors, homonyms and idioms represent static databases. We unlock them from the start so you can jump directly into learning and quizzing Top 300 folders without delay.",
  },
  {
    q: "How is user level and rank computed?",
    a: "Your level is calculated dynamically on-the-fly using a quadratic formula: Level = floor(sqrt(XP / 20)) + 1. Levels are grouped into tier badges (Prarambhik, Saksham, Praveen, Daksh, Acharya, Maharathi) with custom badges.",
  },
  {
    q: "What is the daily XP cap system?",
    a: "To prevent automation hacks and grinding, we enforce a rolling daily soft-cap on the server side: 100% XP rate up to 300 XP, 50% rate up to 600 XP, and 25% rate beyond that. All gains log to transaction histories.",
  },
  {
    q: "Can I use the app on mobile devices?",
    a: "Yes! Vocab Mania is a fully responsive Progressive Web App. The bento features reflow, and navigation converts to compact, touch-optimized side drawers on all mobile screen viewports.",
  },
];

export function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-[#fffdf8] py-20 dark:bg-[#0a0a0b] border-t border-outline-variant/10 dark:border-white/[0.03] transition-colors duration-300">
      <div className="section-wrap max-w-3xl">
        <div className="text-center mb-16 space-y-3">
          <p className="text-[11px] font-bold text-primary dark:text-[#60a5fa] uppercase tracking-widest">
            Common Inquiries
          </p>
          <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight text-on-surface dark:text-white sm:text-[40px]">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={faq.q}
                className="rounded-2xl border border-outline-variant/20 bg-surface dark:border-white/[0.04] dark:bg-surface-container overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between px-6 py-4.5 text-left text-[14.5px] font-bold text-on-surface hover:bg-surface-container-low transition-colors dark:text-white dark:hover:bg-white/[0.02]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-outline transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? "rotate-180 text-on-surface dark:text-white" : ""
                    }`}
                  />
                </button>
                
                <div 
                  className={`transition-all duration-250 ease-in-out ${
                    isOpen ? "max-h-[200px] border-t border-outline-variant/10 dark:border-white/[0.04]" : "max-h-0"
                  } overflow-hidden`}
                >
                  <p className="px-6 py-5 text-[13.5px] leading-relaxed text-outline/80 dark:text-white/60">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
