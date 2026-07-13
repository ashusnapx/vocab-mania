"use client";

import { useEffect, useState } from "react";

const STATS = [
  { label: "Enrolled Learners", target: 12400, prefix: "", suffix: "+" },
  { label: "Practice Sessions Completed", target: 82100, prefix: "", suffix: "+" },
  { label: "Daily Streaks Maintained", target: 89, prefix: "", suffix: "%" },
  { label: "Retention Rate Improvement", target: 94, prefix: "", suffix: "%" },
];

export function SocialProof() {
  return (
    <section className="bg-[#fffdf8] py-16 dark:bg-[#0a0a0b] border-y border-outline-variant/10 dark:border-white/[0.03] transition-colors duration-300">
      <div className="section-wrap">
        <div className="mx-auto max-w-4xl text-center mb-10">
          <p className="text-[11px] font-bold text-primary dark:text-[#60a5fa] uppercase tracking-widest">
            Numbers that Inspire Confidence
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center space-y-2">
              <div className="font-display text-[32px] font-black text-on-surface dark:text-white sm:text-[40px] tracking-tight">
                {stat.prefix}
                <Counter target={stat.target} />
                {stat.suffix}
              </div>
              <p className="text-[13px] font-medium text-outline/80 dark:text-white/50 max-w-[160px] mx-auto leading-normal">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    // Linear progression over 1.5 seconds
    const duration = 1200;
    const incrementTime = Math.max(Math.floor(duration / 30), 15);
    const step = Math.ceil(end / (duration / incrementTime));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}</span>;
}
