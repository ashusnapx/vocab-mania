"use client";

import { HOW_IT_WORKS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white dark:bg-[#0a0a0b] py-16 md:py-20">
      <div className="section-wrap">
        {/* Header */}
        <div className="mb-12 max-w-2xl md:mb-16">
          <span className="inline-flex items-center rounded-full bg-violet-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-violet-primary dark:text-[#a78bfa]">
            {HOW_IT_WORKS.tag}
          </span>
          <h2 className="mt-5 font-display text-[32px] font-semibold leading-[1.2] tracking-[-0.025em] text-midnight-ink sm:text-[40px] dark:text-white">
            {HOW_IT_WORKS.headline}
          </h2>
          <p className="mt-3 text-[16px] leading-[1.75] text-graphite md:text-[18px] dark:text-white/50">
            {HOW_IT_WORKS.subhead}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {HOW_IT_WORKS.steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mb-5 inline-flex">
                <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-violet-primary text-[18px] font-bold text-white shadow-[0_8px_24px_rgba(134,47,231,0.2)]">
                  {step.number}
                </div>
              </div>
              <h3 className="font-display text-[18px] font-semibold tracking-[-0.025em] text-midnight-ink dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.75] text-graphite dark:text-white/50 max-w-[300px] mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
