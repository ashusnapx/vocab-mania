"use client";

import { WHY_BEST } from "@/lib/why-best-constants";
import { TagLabel } from "@/components/tag-label";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function WhyBestProblem() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <section className="bg-surface-container-low py-16 md:py-24">
      <div ref={ref} className="section-wrap">
        <div className={`mb-12 max-w-2xl md:mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <TagLabel>{WHY_BEST.problem.tag}</TagLabel>
          <h2 className="mt-5 font-display text-[32px] font-medium leading-[1.25] tracking-tight text-on-surface sm:text-[40px] md:text-[48px]">
            {WHY_BEST.problem.headline}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-outline md:text-[18px]">
            {WHY_BEST.problem.subhead}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {WHY_BEST.problem.reasons.map((reason, i) => (
            <div
              key={reason.title}
              className={`group relative rounded-[24px] p-6 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md ${
                isVisible ? `animate-fade-in-up stagger-${i + 1}` : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 glass rounded-[24px] shadow-sm" />
              <div className="relative">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-[20px] font-medium text-on-surface pr-4">
                    {reason.title}
                  </h3>
                  <div className="shrink-0 text-right">
                    <div className="font-display text-[28px] font-medium text-error">
                      {reason.stat}
                    </div>
                    <div className="text-[11px] text-outline">
                      {reason.statLabel}
                    </div>
                  </div>
                </div>
                <p className="text-[15px] leading-relaxed text-outline">
                  {reason.description}
                </p>
                <p className="mt-3 text-[12px] font-medium text-primary/70">
                  {reason.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
