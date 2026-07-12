import { CTA } from "@/lib/constants";
import { PillButton } from "./pill-button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-md-surface py-16 md:py-24">
      {/* Atmospheric blur shapes — layered organic depth */}
      <div className="pointer-events-none absolute -top-36 left-1/4 h-[450px] w-[450px] rounded-full bg-md-primary/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 right-1/4 h-[400px] w-[400px] rounded-full bg-md-tertiary/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-md-secondary/[0.04] blur-3xl" />

      <div className="section-wrap relative">
        {/* CTA card — shadow-lg, large radius, primary container */}
        <div className="mx-auto max-w-3xl rounded-[32px] bg-md-primary-container p-10 text-center shadow-lg md:p-16">
          <h2 className="text-[32px] font-medium leading-[1.25] tracking-tight text-md-on-primary-container sm:text-[40px] md:text-[48px]">
            {CTA.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-md-on-primary-container/80 md:text-[18px]">
            {CTA.body}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillButton
              label={CTA.primaryCta.label}
              href={CTA.primaryCta.href}
              variant="filled"
              size="lg"
            />
            <PillButton
              label={CTA.secondaryCta.label}
              href={CTA.secondaryCta.href}
              variant="outlined"
              size="lg"
            />
          </div>
          <p className="mt-4 text-[14px] text-md-on-primary-container/60">
            {CTA.info}
          </p>
        </div>
      </div>
    </section>
  );
}
