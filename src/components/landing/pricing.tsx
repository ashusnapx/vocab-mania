"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { PRICING } from "@/lib/constants";

export function Pricing() {
  return (
    <section id="pricing" className="bg-white dark:bg-[#0a0a0b] py-16 md:py-20">
      <div className="section-wrap">
        {/* Header */}
        <div className="mb-12 max-w-2xl md:mb-16">
          <span className="inline-flex items-center rounded-full bg-violet-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-violet-primary dark:text-[#a78bfa]">
            {PRICING.tag}
          </span>
          <h2 className="mt-5 font-display text-[32px] font-semibold leading-[1.2] tracking-[-0.025em] text-midnight-ink sm:text-[40px] dark:text-white">
            {PRICING.headline}
          </h2>
          <p className="mt-3 text-[16px] leading-[1.75] text-graphite md:text-[18px] dark:text-white/50">
            {PRICING.subhead}
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-2 max-w-3xl">
          {PRICING.tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-[20px] p-6 border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                tier.highlighted
                  ? "border-violet-primary/30 bg-white dark:bg-[#12121a] dark:border-[#a78bfa]/20 shadow-[0_4px_20px_rgba(134,47,231,0.08)]"
                  : "border-neutral-100 bg-white dark:bg-[#12121a] dark:border-white/[0.06]"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 right-6 bg-violet-primary px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="font-display text-[18px] font-semibold text-midnight-ink dark:text-white">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-[36px] font-semibold tracking-[-0.025em] text-midnight-ink dark:text-white">{tier.price}</span>
                  <span className="text-[13px] text-graphite dark:text-white/40">{tier.period}</span>
                </div>
                <p className="mt-2 text-[13px] text-graphite dark:text-white/50">{tier.description}</p>

                <div className={`my-5 h-px ${tier.highlighted ? "bg-violet-primary/10 dark:bg-[#a78bfa]/10" : "bg-neutral-100 dark:bg-white/[0.06]"}`} />

                <ul className="space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={14} className="text-violet-primary dark:text-[#a78bfa] mt-0.5 shrink-0" />
                      <span className="text-[13px] text-graphite dark:text-white/60">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={tier.cta.href}
                className={`mt-6 flex h-11 items-center justify-center rounded-xl text-[13px] font-semibold transition-all active:scale-[0.98] ${
                  tier.highlighted
                    ? "bg-violet-primary text-white hover:bg-violet-hover"
                    : "border border-neutral-200 text-midnight-ink hover:bg-neutral-50 dark:border-white/[0.12] dark:text-white dark:hover:bg-white/[0.04]"
                }`}
              >
                {tier.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
