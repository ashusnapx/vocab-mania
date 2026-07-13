"use client";

import { useEffect, useState } from "react";
import { STATS } from "@/lib/constants";

function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;
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

export function SocialProof() {
  return (
    <section className="bg-white dark:bg-[#0a0a0b] py-14 border-y border-neutral-100 dark:border-white/[0.04]">
      <div className="section-wrap">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center space-y-1.5">
              <div className="font-display text-[32px] font-semibold tracking-[-0.025em] text-midnight-ink dark:text-white sm:text-[40px]">
                <Counter target={stat.value} />{stat.suffix}
              </div>
              <p className="text-[13px] font-medium text-graphite dark:text-white/50">
                {stat.delta}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-graphite/50 dark:text-white/25">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
