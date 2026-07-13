"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HERO } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#0a0a0b] pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Subtle gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 h-[400px] w-[400px] rounded-full opacity-20 dark:opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(134,47,231,0.5) 0%, transparent 70%)" }}
        />
        <div className="absolute top-1/3 -right-20 h-[300px] w-[300px] rounded-full opacity-15 dark:opacity-8 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,95,228,0.4) 0%, transparent 70%)" }}
        />
      </div>

      <div className="section-wrap relative z-10 max-w-[680px] mx-auto text-center">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/60 bg-white/60 px-3 py-1.5 text-[12px] font-semibold text-violet-primary dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#a78bfa] backdrop-blur-sm">
          <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          {HERO.tag}
        </div>

        {/* Headline */}
        <h1 className="mt-7 font-display text-[40px] font-semibold leading-[1.15] tracking-[-0.025em] text-midnight-ink dark:text-white sm:text-[52px] md:text-[60px]">
          {HERO.headline}
        </h1>

        {/* Subhead */}
        <p className="mt-5 text-[16px] leading-[1.75] text-graphite dark:text-white/50 md:text-[18px] max-w-[560px] mx-auto">
          {HERO.subhead}
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={HERO.primaryCta.href}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-primary px-7 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-violet-hover active:scale-[0.97] shadow-sm"
          >
            {HERO.primaryCta.label}
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            href={HERO.secondaryCta.href}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200/60 px-7 text-[15px] font-medium text-midnight-ink transition-all duration-200 hover:bg-neutral-50 active:scale-[0.98] dark:border-white/[0.12] dark:text-white dark:hover:bg-white/[0.04]"
          >
            {HERO.secondaryCta.label}
          </Link>
        </div>

        {/* Trust */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] font-medium text-graphite/60 dark:text-white/30">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-green-500" />
            No credit card required
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-green-500" />
            300+ idioms seeded
          </div>
        </div>
      </div>
    </section>
  );
}
