"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTA } from "@/lib/constants";

export function Cta() {
  return (
    <section className="bg-white dark:bg-[#0a0a0b] py-16 md:py-20">
      <div className="section-wrap">
        <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-br from-violet-primary to-[#5f259e] p-8 md:p-12 text-center text-white shadow-xl">
          {/* Ambient */}
          <div className="absolute -top-24 -left-24 h-[200px] w-[200px] rounded-full bg-white/[0.08] blur-[40px]" />
          <div className="absolute -bottom-24 -right-24 h-[200px] w-[200px] rounded-full bg-white/[0.08] blur-[40px]" />

          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="font-display text-[32px] font-semibold leading-[1.2] tracking-[-0.025em] sm:text-[40px]">
              {CTA.headline}
            </h2>
            <p className="mt-4 text-[15px] leading-[1.75] text-white/80">
              {CTA.body}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={CTA.primaryCta.href}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-[15px] font-semibold text-violet-primary transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-[0.98]"
              >
                {CTA.primaryCta.label}
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href={CTA.secondaryCta.href}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[15px] font-medium text-white hover:border-white/40 hover:bg-white/5 transition-all duration-200 active:scale-[0.98]"
              >
                {CTA.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
