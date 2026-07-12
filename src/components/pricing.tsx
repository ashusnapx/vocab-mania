"use client";

import { PRICING } from "@/lib/constants";
import { TagLabel } from "./tag-label";
import { PillButton } from "./pill-button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function Pricing() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <section id="pricing" className="bg-surface-container py-16 md:py-24">
      <div ref={ref} className="section-wrap">
        <div className={`mb-12 max-w-2xl md:mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <TagLabel>{PRICING.tag}</TagLabel>
          <h2 className="mt-5 font-display text-[32px] font-medium leading-[1.25] tracking-tight text-on-surface sm:text-[40px] md:text-[48px]">
            {PRICING.headline}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-outline md:text-[18px]">
            {PRICING.subhead}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PRICING.tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-[24px] p-6 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md ${
                tier.highlighted
                  ? "bg-primary-container shadow-lg md:-translate-y-4 md:ring-2 md:ring-primary"
                  : "bg-surface"
              } ${isVisible ? `animate-fade-in-up stagger-${i + 2}` : "opacity-0"}`}
            >
              {/* Badge for highlighted */}
              {tier.highlighted && (
                <div className="mb-4 inline-flex w-fit rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-on-primary">
                  Most Popular
                </div>
              )}

              <h3 className={`text-[20px] font-medium ${tier.highlighted ? "text-on-primary-container" : "text-on-surface"}`}>
                {tier.name}
              </h3>

              <div className="mt-3 flex items-baseline gap-1">
                <span className={`font-display text-[40px] font-medium tracking-tight ${tier.highlighted ? "text-on-primary-container" : "text-on-surface"}`}>
                  {tier.price}
                </span>
                <span className={`text-[14px] ${tier.highlighted ? "text-on-primary-container/60" : "text-outline"}`}>
                  {tier.period}
                </span>
              </div>

              <p className={`mt-2 text-[14px] ${tier.highlighted ? "text-on-primary-container/70" : "text-outline"}`}>
                {tier.description}
              </p>

              <div className={`my-6 h-px ${tier.highlighted ? "bg-primary/20" : "bg-outline-variant/40"}`} />

              <ul className="flex flex-1 flex-col gap-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg className={`mt-0.5 h-4 w-4 shrink-0 ${tier.highlighted ? "text-on-primary-container" : "text-primary"}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className={`text-[14px] ${tier.highlighted ? "text-on-primary-container" : "text-outline"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <PillButton
                  label={tier.cta.label}
                  href={tier.cta.href}
                  variant={tier.highlighted ? "filled" : "outlined"}
                  size="lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
