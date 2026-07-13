"use client";

import { FEATURES } from "@/lib/constants";
import { Clock, Sparkles, Brain, School, BarChart3, Star } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  schedule: Clock,
  auto_awesome: Sparkles,
  quiz: Brain,
  school: School,
  analytics: BarChart3,
  emoji_events: Star,
};

export function Features() {
  return (
    <section id="features" className="bg-fog dark:bg-[#111318] py-16 md:py-20">
      <div className="section-wrap">
        {/* Header */}
        <div className="mb-12 max-w-2xl md:mb-16">
          <span className="inline-flex items-center rounded-full bg-violet-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-violet-primary dark:text-[#a78bfa]">
            {FEATURES.tag}
          </span>
          <h2 className="mt-5 font-display text-[32px] font-semibold leading-[1.2] tracking-[-0.025em] text-midnight-ink sm:text-[40px] dark:text-white">
            {FEATURES.headline}
          </h2>
          <p className="mt-3 text-[16px] leading-[1.75] text-graphite md:text-[18px] dark:text-white/50">
            {FEATURES.subhead}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.items.map((feature) => {
            const Icon = iconMap[feature.icon] || Clock;
            return (
              <div
                key={feature.title}
                className="rounded-[20px] p-5 bg-white border border-neutral-100 dark:bg-[#12121a] dark:border-white/[0.06] transition-all duration-200 hover:shadow-md hover:border-violet-primary/15 dark:hover:border-[#a78bfa]/15"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-primary/10 dark:bg-[#a78bfa]/10">
                  <Icon size={18} className="text-violet-primary dark:text-[#a78bfa]" />
                </div>
                <h3 className="font-display text-[16px] font-semibold tracking-[-0.025em] text-midnight-ink dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-graphite dark:text-white/50">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
