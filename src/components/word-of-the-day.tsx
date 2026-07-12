"use client";

import { WORD_OF_THE_DAY } from "@/lib/constants";
import { TagLabel } from "./tag-label";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function WordOfTheDay() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section className="bg-surface py-16 md:py-24">
      <div ref={ref} className="section-wrap">
        <div className={`mx-auto max-w-2xl ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="text-center">
            <TagLabel>{WORD_OF_THE_DAY.tag}</TagLabel>
          </div>

          <div className="mt-8 overflow-hidden rounded-[32px] bg-surface-container shadow-md">
            {/* Word header */}
            <div className="relative bg-gradient-to-r from-primary to-secondary p-8 text-center md:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
              <div className="relative">
                <h3 className="font-display text-[40px] font-medium text-white md:text-[56px]">
                  {WORD_OF_THE_DAY.word}
                </h3>
                <div className="mt-2 text-[16px] text-white/80">{WORD_OF_THE_DAY.pronunciation}</div>
                <div className="mt-1 text-[14px] text-white/60 italic">{WORD_OF_THE_DAY.partOfSpeech}</div>
              </div>
            </div>

            {/* Word body */}
            <div className="p-8 md:p-12">
              <div className="flex flex-col gap-6">
                {/* Definition */}
                <div>
                  <span className="mb-2 block text-[12px] font-medium uppercase tracking-[0.06em] text-primary">Definition</span>
                  <p className="text-[18px] text-on-surface">{WORD_OF_THE_DAY.definition}</p>
                </div>

                {/* Example */}
                <div>
                  <span className="mb-2 block text-[12px] font-medium uppercase tracking-[0.06em] text-primary">Example</span>
                  <p className="text-[16px] italic leading-relaxed text-outline">
                    &ldquo;{WORD_OF_THE_DAY.example}&rdquo;
                  </p>
                </div>

                {/* Mnemonic */}
                <div className="rounded-[16px] bg-secondary-container p-4">
                  <span className="mb-1 block text-[12px] font-medium uppercase tracking-[0.06em] text-on-secondary-container">Memory Trick</span>
                  <p className="text-[15px] text-on-secondary-container">
                    {WORD_OF_THE_DAY.mnemonic}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
