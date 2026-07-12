"use client";

import { HOW_IT_WORKS } from "@/lib/constants";
import { TagLabel } from "./tag-label";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const stepIcons: Record<string, string> = {
  touch_app:
    "M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6C13 6.67 12.33 6 11.5 6S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z",
  psychology:
    "M13 13v8h8v-8h-8zM3 21h8v-8H3v8zM3 3v8h8V3H3zm13.66-1.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65zM12 1H3.5C2.12 1 1 2.12 1 3.5v9C1 13.88 2.12 15 3.5 15H5v7c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-7h1.5c1.38 0 2.5-1.12 2.5-2.5v-9C21 1.12 19.88 1 18.5 1H12z",
  trending_up:
    "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
};

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <section id="how-it-works" className="bg-surface py-16 md:py-24">
      <div ref={ref} className="section-wrap">
        <div className={`mb-12 max-w-2xl md:mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <TagLabel>{HOW_IT_WORKS.tag}</TagLabel>
          <h2 className="mt-5 font-display text-[32px] font-medium leading-[1.25] tracking-tight text-on-surface sm:text-[40px] md:text-[48px]">
            {HOW_IT_WORKS.headline}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-outline md:text-[18px]">
            {HOW_IT_WORKS.subhead}
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Animated progress line — desktop: from center of 1st column to center of 3rd column */}
          <div className="pointer-events-none absolute top-14 hidden h-px lg:block" style={{ left: "16.66%", width: "66.66%" }}>
            <div className={`h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-[cubic-bezier(0.2,0,0,1)] ${isVisible ? "w-full" : "w-0"}`} />
          </div>

          {HOW_IT_WORKS.steps.map((step, i) => (
            <div
              key={step.number}
              className={`group relative ${isVisible ? `animate-fade-in-up stagger-${i + 2}` : "opacity-0"}`}
            >
              {/* Badge with glow */}
              <div className="relative mb-5 inline-flex">
                <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-primary/0 opacity-0 blur-xl transition-all duration-500 group-hover:bg-primary/20 group-hover:opacity-100" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary-container text-[18px] font-bold text-on-primary-container transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:bg-primary group-hover:text-on-primary group-hover:shadow-md group-hover:scale-110">
                  {step.number}
                </div>
              </div>

              {/* Step icon */}
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d={stepIcons[step.icon] || ""} />
                </svg>
              </div>

              <h3 className="text-[24px] font-medium text-on-surface">
                {step.title}
              </h3>
              <p className="mt-2 text-[16px] leading-relaxed text-outline">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
