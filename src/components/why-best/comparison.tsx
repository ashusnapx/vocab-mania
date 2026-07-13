"use client";

import { WHY_BEST } from "@/lib/why-best-constants";
import { TagLabel } from "@/components/tag-label";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function WhyBestComparison() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <section className="bg-surface-container py-16 md:py-24">
      <div ref={ref} className="section-wrap">
        <div className={`mb-12 max-w-2xl md:mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <TagLabel>{WHY_BEST.comparison.tag}</TagLabel>
          <h2 className="mt-5 font-display text-[32px] font-medium leading-[1.25] tracking-tight text-on-surface sm:text-[40px] md:text-[48px]">
            {WHY_BEST.comparison.headline}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-outline md:text-[18px]">
            {WHY_BEST.comparison.subhead}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_BEST.comparison.competitors.map((comp, i) => (
            <div
              key={comp.name}
              className={`relative flex flex-col rounded-[20px] p-5 transition-all duration-300 ${
                "isUs" in comp && comp.isUs
                  ? "bg-primary-container shadow-lg md:-translate-y-2 md:ring-2 md:ring-primary"
                  : "bg-surface shadow-sm"
              } ${isVisible ? `animate-fade-in-up stagger-${i + 1}` : "opacity-0"}`}
            >
              {"isUs" in comp && comp.isUs && (
                <div className="mb-3 inline-flex w-fit rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-on-primary">
                  Our Approach
                </div>
              )}
              <h3 className={`text-[18px] font-medium ${
                "isUs" in comp && comp.isUs ? "text-on-primary-container" : "text-on-surface"
              }`}>
                {comp.name}
              </h3>
              <p className={`mt-1 text-[13px] ${
                "isUs" in comp && comp.isUs ? "text-on-primary-container/70" : "text-outline"
              }`}>
                {comp.description}
              </p>

              <div className="mt-4 flex-1">
                {"problems" in comp && comp.problems && (
                  <ul className="flex flex-col gap-2">
                    {comp.problems.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-error/60" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                        <span className="text-[13px] text-outline">{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {"strengths" in comp && comp.strengths && (
                  <ul className="flex flex-col gap-2">
                    {comp.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-secondary" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        <span className="text-[13px] text-on-primary-container">{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
