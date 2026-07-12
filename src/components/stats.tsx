"use client";

import { STATS } from "@/lib/constants";
import { useCounter } from "@/hooks/use-scroll-animation";

function StatItem({ value, suffix, label, delta }: { value: number; suffix: string; label: string; delta: string }) {
  const { ref, count } = useCounter(value, 2000);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <div className="font-display text-[36px] font-medium tracking-tight text-on-surface sm:text-[40px]">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[13px] text-outline">{delta}</div>
      <div className="mt-1 text-[12px] font-medium uppercase tracking-[0.06em] text-outline/70">
        {label}
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="bg-surface-container-low py-12 md:py-16">
      <div className="section-wrap">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`${
                i < STATS.length - 1
                  ? "border-r border-outline-variant/40 pr-6"
                  : "pr-0"
              } max-lg:border-r-0 max-lg:pr-0 max-lg:border-b max-lg:pb-6`}
            >
              <StatItem {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
