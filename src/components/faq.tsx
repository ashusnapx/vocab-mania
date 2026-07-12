"use client";

import { useState } from "react";
import { FAQ } from "@/lib/constants";
import { TagLabel } from "./tag-label";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="faq" className="bg-surface py-16 md:py-24">
      <div ref={ref} className="section-wrap">
        <div className={`mx-auto max-w-2xl ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="mb-12 text-center">
            <TagLabel>{FAQ.tag}</TagLabel>
            <h2 className="mt-5 font-display text-[32px] font-medium leading-[1.25] tracking-tight text-on-surface sm:text-[40px] md:text-[48px]">
              {FAQ.headline}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {FAQ.items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`overflow-hidden rounded-[16px] transition-all duration-300 ${
                    isOpen ? "bg-surface-container shadow-sm" : "bg-surface-container-low hover:bg-surface-container"
                  } ${isVisible ? `animate-fade-in-up stagger-${i + 1}` : "opacity-0"}`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-4 text-[16px] font-medium text-on-surface">
                      {item.question}
                    </span>
                    <svg
                      className={`h-5 w-5 shrink-0 text-outline transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                    </svg>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
                    style={{
                      maxHeight: isOpen ? "200px" : "0px",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p className="px-6 pb-5 text-[15px] leading-relaxed text-outline">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
