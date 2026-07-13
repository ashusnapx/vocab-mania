"use client";

import { HERO } from "@/lib/constants";
import { PillButton } from "./pill-button";
import { TagLabel } from "./tag-label";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import dynamic from "next/dynamic";

const GradientBlinds = dynamic(
  () => import("./gradient-blinds/gradient-blinds").then((mod) => mod.default),
  { ssr: false }
);

export function Hero() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="relative overflow-hidden bg-surface pt-24 pb-16 md:pt-15 md:pb-24">
      {/* Gradient Blinds background */}
      <div className="pointer-events-none absolute inset-0">
        <GradientBlinds
          gradientColors={["#2563eb", "#059669", "#d97706", "#2563eb"]}
          angle={135}
          noise={0.4}
          blindCount={14}
          blindMinWidth={50}
          spotlightRadius={0.6}
          spotlightSoftness={1.2}
          spotlightOpacity={0.8}
          mouseDampening={0.15}
          distortAmount={0.3}
          shineDirection="left"
          mixBlendMode="normal"
        />
        {/* Soft overlay to blend with surface color */}
        <div className="absolute inset-0 bg-surface/70" />
      </div>

      <div ref={ref} className="section-wrap relative z-10">
        <div className={`mx-auto max-w-3xl text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          {/* Tag */}
          <div className="mb-6 flex justify-center">
            <TagLabel>{HERO.tag}</TagLabel>
          </div>

          {/* Display headline with gradient text on key phrase */}
          <h1 className="font-display text-[40px] font-medium leading-[1.12] tracking-tight text-on-surface sm:text-[48px] md:text-[56px]">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_200%] animate-gradient bg-clip-text text-transparent">
              {HERO.headline.split(",")[0]},
            </span>
            <br />
            {HERO.headline.split(", ").slice(1).join(" ")}
          </h1>

          {/* Subhead */}
          <p className="mx-auto mt-6 max-w-xl text-[18px] leading-relaxed text-outline sm:text-[20px]">
            {HERO.subhead}
          </p>

          {/* CTAs with glow ring on primary */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <div className="animate-pulse-glow rounded-full">
              <PillButton
                label={HERO.primaryCta.label}
                href={HERO.primaryCta.href}
                variant="filled"
                size="lg"
              />
            </div>
            <PillButton
              label={HERO.secondaryCta.label}
              href={HERO.secondaryCta.href}
              variant="outlined"
              size="lg"
            />
          </div>

          {/* Info */}
          <p className="mt-5 text-[14px] text-outline/70">
            {HERO.info}
          </p>
        </div>

        {/* Hero preview cards */}
        <div className={`relative mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4 ${isVisible ? "animate-fade-in-up stagger-3" : "opacity-0"}`}>
          <div className="group rounded-[24px] bg-surface-container/80 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02]">
            <div className="text-[12px] font-medium text-outline">Words Learned</div>
            <div className="mt-2 text-[28px] font-medium text-on-surface">2,847</div>
            <div className="mt-1 text-[12px] text-primary">+12% this week</div>
          </div>
          <div className="group rounded-[24px] bg-secondary-container/80 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02]">
            <div className="text-[12px] font-medium text-on-secondary-container">Daily Streak</div>
            <div className="mt-2 text-[28px] font-medium text-on-secondary-container">14 days</div>
            <div className="mt-1 text-[12px] text-on-secondary-container/70">Keep going!</div>
          </div>
          <div className="group rounded-[24px] bg-surface-container/80 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02]">
            <div className="text-[12px] font-medium text-outline">Accuracy</div>
            <div className="mt-2 text-[28px] font-medium text-on-surface">94%</div>
            <div className="mt-1 text-[12px] text-secondary">Above average</div>
          </div>
          <div className="group rounded-[24px] bg-surface-container/80 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02]">
            <div className="text-[12px] font-medium text-outline">Current Level</div>
            <div className="mt-2 text-[28px] font-medium text-on-surface">Advanced</div>
            <div className="mt-1 text-[12px] text-secondary">Top 8% of learners</div>
          </div>
        </div>
      </div>
    </section>
  );
}
