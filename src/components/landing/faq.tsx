"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ } from "@/lib/constants";

export function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-fog dark:bg-[#111318] py-16 md:py-20">
      <div className="section-wrap max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center rounded-full bg-violet-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-violet-primary dark:text-[#a78bfa]">
            {FAQ.tag}
          </span>
          <h2 className="mt-5 font-display text-[32px] font-semibold leading-[1.2] tracking-[-0.025em] text-midnight-ink sm:text-[40px] dark:text-white">
            {FAQ.headline}
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {FAQ.items.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-[16px] border border-neutral-100 bg-white dark:border-white/[0.06] dark:bg-[#12121a] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-[15px] font-medium text-midnight-ink hover:bg-neutral-50/50 transition-colors dark:text-white dark:hover:bg-white/[0.02]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-graphite shrink-0 ml-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`transition-all duration-200 overflow-hidden ${isOpen ? "max-h-[200px]" : "max-h-0"}`}
                >
                  <p className="px-5 pb-4 text-[14px] leading-[1.75] text-graphite dark:text-white/50">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
