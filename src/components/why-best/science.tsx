"use client";

import { WHY_BEST } from "@/lib/why-best-constants";
import { TagLabel } from "@/components/tag-label";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const colorMap = {
  primary: {
    bg: "bg-primary-container",
    text: "text-on-primary-container",
    number: "text-primary",
    border: "border-primary/20",
  },
  secondary: {
    bg: "bg-secondary-container",
    text: "text-on-secondary-container",
    number: "text-secondary",
    border: "border-secondary/20",
  },
  tertiary: {
    bg: "bg-tertiary-container",
    text: "text-on-tertiary-container",
    number: "text-tertiary",
    border: "border-tertiary/20",
  },
};

export function WhyBestScience() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.03 });

  return (
    <section id="science" className="bg-surface py-16 md:py-24">
      <div ref={ref} className="section-wrap">
        <div className={`mb-12 max-w-2xl md:mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <TagLabel>{WHY_BEST.science.tag}</TagLabel>
          <h2 className="mt-5 font-display text-[32px] font-medium leading-[1.25] tracking-tight text-on-surface sm:text-[40px] md:text-[48px]">
            {WHY_BEST.science.headline}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-outline md:text-[18px]">
            {WHY_BEST.science.subhead}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_BEST.science.principles.map((p, i) => {
            const colors = colorMap[p.color];
            return (
              <div
                key={p.number}
                className={`group relative rounded-[20px] border ${colors.border} p-5 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.01] ${
                  isVisible ? `animate-fade-in-up stagger-${(i % 8) + 1}` : "opacity-0"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`font-display text-[28px] font-medium ${colors.number} opacity-30`}>
                    {p.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[17px] font-medium text-on-surface">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-outline">
                      {p.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full ${colors.bg} px-2.5 py-0.5 text-[11px] font-medium ${colors.text}`}>
                        {p.impact}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-outline/60">
                      {p.source}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
