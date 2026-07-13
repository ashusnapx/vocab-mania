"use client";

import { WHY_BEST } from "@/lib/why-best-constants";
import { TagLabel } from "@/components/tag-label";
import { useScrollAnimation, useCounter } from "@/hooks/use-scroll-animation";

function StatCard({ value, label, description }: { value: string; label: string; description: string }) {
  const numericPart = value.replace(/[^0-9]/g, "");
  const suffix = value.replace(/[0-9]/g, "");
  const isNumeric = numericPart.length > 0 && numericPart === value.replace(/[^0-9]/g, "");

  return (
    <div className="flex flex-col gap-1">
      <div className="font-display text-[36px] font-medium tracking-tight text-on-surface sm:text-[40px]">
        {isNumeric ? <CounterValue value={Number(numericPart)} suffix={suffix} /> : value}
      </div>
      <div className="text-[15px] font-medium text-on-surface">{label}</div>
      <div className="text-[13px] text-outline">{description}</div>
    </div>
  );
}

function CounterValue({ value, suffix }: { value: number; suffix: string }) {
  const { ref, count } = useCounter(value, 2000);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export function WhyBestEvidence() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <section className="bg-surface-container-low py-16 md:py-24">
      <div ref={ref} className="section-wrap">
        <div className={`mb-12 max-w-2xl md:mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <TagLabel>{WHY_BEST.evidence.tag}</TagLabel>
          <h2 className="mt-5 font-display text-[32px] font-medium leading-[1.25] tracking-tight text-on-surface sm:text-[40px] md:text-[48px]">
            {WHY_BEST.evidence.headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_BEST.evidence.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`rounded-[20px] bg-surface p-6 shadow-sm ${
                isVisible ? `animate-fade-in-up stagger-${i + 1}` : "opacity-0"
              }`}
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
