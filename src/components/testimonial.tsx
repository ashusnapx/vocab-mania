"use client";

import { useState, useEffect, useCallback } from "react";
import { TESTIMONIALS } from "@/lib/constants";
import { TagLabel } from "./tag-label";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function Testimonial() {
  const [current, setCurrent] = useState(0);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const t = TESTIMONIALS[current];

  return (
    <section className="bg-surface-container py-16 md:py-24">
      <div ref={ref} className="section-wrap">
        <div className={`mx-auto max-w-3xl ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="relative overflow-hidden rounded-[32px] bg-surface p-8 shadow-lg md:p-12">
            {/* Blur decorations */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-primary/[0.08] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-secondary/[0.06] blur-3xl" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <TagLabel>Testimonial</TagLabel>
                {/* Dots */}
                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === current
                          ? "w-6 bg-primary"
                          : "w-2 bg-outline-variant hover:bg-outline"
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Star rating */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-tertiary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-[20px] font-medium leading-relaxed text-on-surface transition-all duration-300 sm:text-[24px]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <footer className="mt-8 flex items-center gap-4 border-t border-outline-variant/40 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-[16px] font-bold text-on-primary">
                  {t.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-[16px] font-medium text-on-surface">{t.author}</div>
                  <div className="text-[14px] text-outline">{t.role}</div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
