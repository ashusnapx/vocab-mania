"use client";

import { Check, X } from "lucide-react";

const COMPARISONS = [
  {
    feature: "Adaptive MCQ Distractors",
    us: true,
    them: false,
    detail: "Dynamic distractors pull similar spellings and definitions.",
  },
  {
    feature: "Memory Vault Star Loops",
    us: true,
    them: false,
    detail: "Isolates starred words into revision queues automatically.",
  },
  {
    feature: "Comprehensive Top 300 Idioms",
    us: true,
    them: true,
    detail: "Fully parsed study decks with explanations.",
  },
  {
    feature: "Self-Balancing Level System",
    us: true,
    them: false,
    detail: "Quadratic leveling algorithm ensures progression scales.",
  },
  {
    feature: "Anti-Cheat Reward Validation",
    us: true,
    them: false,
    detail: "Server-side transaction logging prevents XP grinding.",
  },
  {
    feature: "Airbnb-Style Streak Calendar",
    us: true,
    them: false,
    detail: "Monthly heatmap log motivates daily engagement.",
  },
];

export function Comparison() {
  return (
    <section className="bg-[#fffdf8] py-20 dark:bg-[#0a0a0b] border-t border-outline-variant/10 dark:border-white/[0.03] transition-colors duration-300">
      <div className="section-wrap">
        <div className="mx-auto max-w-2xl text-center mb-16 space-y-3">
          <p className="text-[11px] font-bold text-primary dark:text-[#60a5fa] uppercase tracking-widest">
            A Better Way to Learn
          </p>
          <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight text-on-surface dark:text-white sm:text-[40px]">
            Why choose Vocab Mania?
          </h2>
          <p className="text-[15px] leading-relaxed text-outline/80 dark:text-white/50 max-w-[500px] mx-auto">
            Traditional flashcard lists encourage passive reading. Our interactive environment forces real recall.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[24px] border border-outline-variant/20 bg-surface shadow-sm dark:border-white/[0.04] dark:bg-surface-container">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/15 dark:border-white/[0.04] bg-surface-container-low/40">
                  <th className="px-6 py-4.5 text-[13px] font-bold text-outline dark:text-white/40">
                    Feature
                  </th>
                  <th className="px-6 py-4.5 text-[13px] font-bold text-primary dark:text-[#60a5fa]">
                    Vocab Mania
                  </th>
                  <th className="px-6 py-4.5 text-[13px] font-bold text-outline dark:text-white/40">
                    Other Apps
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 dark:divide-white/[0.03]">
                {COMPARISONS.map((row) => (
                  <tr 
                    key={row.feature} 
                    className="hover:bg-surface-container-low/30 transition-colors"
                  >
                    <td className="px-6 py-4.5">
                      <p className="text-[14px] font-bold text-on-surface dark:text-white">
                        {row.feature}
                      </p>
                      <p className="text-[11px] text-outline dark:text-white/40 mt-0.5">
                        {row.detail}
                      </p>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary/15 text-secondary dark:bg-[#34d399]/10 dark:text-[#34d399]">
                        <Check size={14} className="stroke-[3]" />
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      {row.them ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary/10 text-secondary dark:bg-[#34d399]/10 dark:text-[#34d399]">
                          <Check size={14} />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-red-500 dark:bg-red-400/10 dark:text-red-400">
                          <X size={14} />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
