"use client";

import { SOCIAL_PROOF } from "@/lib/constants";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function SocialProof() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="bg-surface-container-low py-10 md:py-14">
      <div ref={ref} className="section-wrap">
        <div className={`flex flex-col items-center gap-8 md:flex-row md:justify-between ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          {/* Left — rating */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="h-5 w-5 text-tertiary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="text-[16px] font-medium text-on-surface">{SOCIAL_PROOF.stats.rating}</span>
            <span className="text-[14px] text-outline">
              on {SOCIAL_PROOF.stats.platform} · {SOCIAL_PROOF.stats.reviews} reviews
            </span>
          </div>

          {/* Right — exam badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-[13px] font-medium text-outline/60">Covers:</span>
            {SOCIAL_PROOF.exams.map((exam) => (
              <div
                key={exam.name}
                className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03]"
              >
                <span className="text-[14px]">{exam.icon}</span>
                <span className="text-[12px] font-medium text-on-surface">{exam.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
