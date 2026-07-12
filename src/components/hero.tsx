"use client";

import { HERO } from "@/lib/constants";
import { PillButton } from "./pill-button";
import { TagLabel } from "./tag-label";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function Hero() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="relative overflow-hidden bg-surface pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Animated organic blobs — slowly drifting */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/[0.06] blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-secondary/[0.05] blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-tertiary/[0.04] blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      {/* Floating word chips — background drift, very subtle */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        {HERO.floatingWords.map((w, i) => {
          const isReverse = i % 2 === 0;
          const row = i % 4;
          const col = (i * 7) % 80;
          const opacity = 0.2 + (i % 4) * 0.04;
          const blur = 0.5 + (i % 3) * 0.5;
          const duration = 14 + (i % 5) * 2;
          const topPos = row === 0 ? 6 + col * 0.15 : row === 1 ? 25 + col * 0.2 : row === 2 ? 55 + col * 0.15 : 78 + col * 0.1;

          return (
            <div
              key={`${w.word}-${i}`}
              className={`absolute rounded-full px-4 py-2 shadow-none backdrop-blur-sm ${isReverse ? "animate-drift-reverse" : "animate-drift"}`}
              style={{
                left: `${8 + ((i * 13) % 75)}%`,
                top: `${topPos}%`,
                opacity,
                filter: `blur(${blur}px)`,
                ["--drift-duration" as string]: `${duration}s`,
                ["--word-opacity" as string]: String(opacity),
                ["--word-y" as string]: `${4 + (i % 3) * 2}px`,
                animationDelay: `${i * 1.5}s`,
              }}
            >
              <span className="text-[13px] font-medium text-on-surface/70">{w.word}</span>
              <span className="ml-1.5 text-[11px] text-outline/50">— {w.meaning}</span>
            </div>
          );
        })}
      </div>

      <div ref={ref} className="section-wrap relative">
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
          <div className="group rounded-[24px] bg-surface-container p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02]">
            <div className="text-[12px] font-medium text-outline">Words Learned</div>
            <div className="mt-2 text-[28px] font-medium text-on-surface">2,847</div>
            <div className="mt-1 text-[12px] text-primary">+12% this week</div>
          </div>
          <div className="group rounded-[24px] bg-secondary-container p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02]">
            <div className="text-[12px] font-medium text-on-secondary-container">Daily Streak</div>
            <div className="mt-2 text-[28px] font-medium text-on-secondary-container">14 days</div>
            <div className="mt-1 text-[12px] text-on-secondary-container/70">Keep going!</div>
          </div>
          <div className="group rounded-[24px] bg-surface-container p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02]">
            <div className="text-[12px] font-medium text-outline">Accuracy</div>
            <div className="mt-2 text-[28px] font-medium text-on-surface">94%</div>
            <div className="mt-1 text-[12px] text-secondary">Above average</div>
          </div>
          <div className="group rounded-[24px] bg-surface-container p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02]">
            <div className="text-[12px] font-medium text-outline">Current Level</div>
            <div className="mt-2 text-[28px] font-medium text-on-surface">Advanced</div>
            <div className="mt-1 text-[12px] text-secondary">Top 8% of learners</div>
          </div>
        </div>
      </div>
    </section>
  );
}
