import { HERO } from "@/lib/constants";
import { PillButton } from "./pill-button";
import { TagLabel } from "./tag-label";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-md-surface pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Organic blur shapes — signature MD3 atmospheric depth */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-md-primary/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-md-tertiary/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-md-secondary/[0.05] blur-3xl" />

      <div className="section-wrap relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Tag */}
          <div className="mb-6 flex justify-center">
            <TagLabel>{HERO.tag}</TagLabel>
          </div>

          {/* Display headline — 56px, font-medium, tight leading */}
          <h1 className="text-[40px] font-medium leading-[1.12] tracking-tight text-md-on-surface sm:text-[48px] md:text-[56px]">
            {HERO.headline}
          </h1>

          {/* Subhead — Body Large */}
          <p className="mx-auto mt-6 max-w-xl text-[18px] leading-relaxed text-md-on-surface-variant sm:text-[20px]">
            {HERO.subhead}
          </p>

          {/* CTAs — pill buttons, filled + outlined pair */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillButton
              label={HERO.primaryCta.label}
              href={HERO.primaryCta.href}
              variant="filled"
              size="lg"
            />
            <PillButton
              label={HERO.secondaryCta.label}
              href={HERO.secondaryCta.href}
              variant="outlined"
              size="lg"
            />
          </div>

          {/* Pre-order info block */}
          <p className="mt-5 text-[14px] text-md-on-surface-variant/70">
            {HERO.info}
          </p>
        </div>

        {/* Hero visual — 4 preview cards floating on tonal surfaces */}
        <div className="relative mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Words Learned card */}
          <div className="group rounded-[24px] bg-md-surface-container p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02]">
            <div className="text-[12px] font-medium text-md-on-surface-variant">
              Words Learned
            </div>
            <div className="mt-2 text-[28px] font-medium text-md-on-surface">
              2,847
            </div>
            <div className="mt-1 text-[12px] text-md-primary">
              +12% this week
            </div>
          </div>

          {/* Daily Streak card — secondary container */}
          <div className="group rounded-[24px] bg-md-secondary-container p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02]">
            <div className="text-[12px] font-medium text-md-on-secondary-container">
              Daily Streak
            </div>
            <div className="mt-2 text-[28px] font-medium text-md-on-secondary-container">
              14 days
            </div>
            <div className="mt-1 text-[12px] text-md-on-secondary-container/70">
              Keep going!
            </div>
          </div>

          {/* Accuracy card */}
          <div className="group rounded-[24px] bg-md-surface-container p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02]">
            <div className="text-[12px] font-medium text-md-on-surface-variant">
              Accuracy
            </div>
            <div className="mt-2 text-[28px] font-medium text-md-on-surface">
              94%
            </div>
            <div className="mt-1 text-[12px] text-md-tertiary">
              Above average
            </div>
          </div>

          {/* Current Level card */}
          <div className="group rounded-[24px] bg-md-surface-container p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02]">
            <div className="text-[12px] font-medium text-md-on-surface-variant">
              Current Level
            </div>
            <div className="mt-2 text-[28px] font-medium text-md-on-surface">
              Advanced
            </div>
            <div className="mt-1 text-[12px] text-md-secondary">
              Top 8% of learners
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
