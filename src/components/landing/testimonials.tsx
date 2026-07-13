"use client";

import { TESTIMONIALS } from "@/lib/constants";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="bg-fog dark:bg-[#111318] py-16 md:py-20">
      <div className="section-wrap">
        {/* Header */}
        <div className="mb-12 max-w-2xl md:mb-16">
          <span className="inline-flex items-center rounded-full bg-violet-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-violet-primary dark:text-[#a78bfa]">
            TESTIMONIALS
          </span>
          <h2 className="mt-5 font-display text-[32px] font-semibold leading-[1.2] tracking-[-0.025em] text-midnight-ink sm:text-[40px] dark:text-white">
            Aspirants kya keh rahe hain
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-[20px] p-6 bg-white border border-neutral-100 dark:bg-[#12121a] dark:border-white/[0.06] flex flex-col justify-between hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-3">
                <Quote size={18} className="text-violet-primary/20 dark:text-[#a78bfa]/20 fill-current" />
                <p className="text-[14px] leading-[1.7] text-midnight-ink/85 dark:text-white/70">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-5 mt-5 border-t border-neutral-100 dark:border-white/[0.06]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-primary text-[12px] font-bold text-white">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-midnight-ink dark:text-white">{t.name}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-graphite dark:text-white/40">
                    <span>{t.role}</span>
                    <span className="h-1 w-1 rounded-full bg-graphite/30 dark:bg-white/10" />
                    <span className="text-violet-primary dark:text-[#a78bfa] font-medium">{t.stat}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
