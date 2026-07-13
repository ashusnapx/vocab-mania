"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("annually");

  return (
    <section className="bg-[#fffdf8] py-20 dark:bg-[#0a0a0b] border-t border-outline-variant/10 dark:border-white/[0.03] transition-colors duration-300">
      <div className="section-wrap">
        <div className="mx-auto max-w-2xl text-center mb-10 space-y-3">
          <p className="text-[11px] font-bold text-primary dark:text-[#60a5fa] uppercase tracking-widest">
            Flexible Plans
          </p>
          <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight text-on-surface dark:text-white sm:text-[40px]">
            Simple, honest pricing.
          </h2>
          <p className="text-[15px] leading-relaxed text-outline/80 dark:text-white/50 max-w-[440px] mx-auto">
            Choose the plan that suits your prep frequency. Save 20% by subscribing annually.
          </p>
        </div>

        {/* Toggle billing period */}
        <div className="flex justify-center mb-12">
          <div className="relative flex rounded-xl bg-surface-container-low p-1 border border-outline-variant/30 dark:border-white/[0.06] dark:bg-white/[0.02]">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 text-[12px] font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                billingPeriod === "monthly"
                  ? "bg-surface shadow-sm text-on-surface dark:bg-white/[0.06] dark:text-white"
                  : "text-outline/80 hover:text-on-surface dark:hover:text-white"
              }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annually")}
              className={`relative px-4 py-2 text-[12px] font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                billingPeriod === "annually"
                  ? "bg-surface shadow-sm text-on-surface dark:bg-white/[0.06] dark:text-white"
                  : "text-outline/80 hover:text-on-surface dark:hover:text-white"
              }`}
            >
              Billed Annually
              <span className="bg-secondary/15 text-secondary dark:bg-[#34d399]/15 dark:text-[#34d399] px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto items-stretch">
          
          {/* Plan 1: Free */}
          <div className="rounded-[24px] border border-outline-variant/20 bg-surface p-6 shadow-sm dark:border-white/[0.04] dark:bg-surface-container flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-[18px] font-bold text-on-surface dark:text-white">
                  Basic Starter
                </h3>
                <p className="text-[12.5px] text-outline/80 dark:text-white/50 mt-1">
                  Fundamental daily vocabulary loops.
                </p>
              </div>

              <div className="flex items-baseline">
                <span className="font-display text-[32px] font-black text-on-surface dark:text-white">
                  ₹0
                </span>
                <span className="text-[13px] text-outline/60 dark:text-white/30 font-medium ml-1">
                  / forever
                </span>
              </div>

              <div className="h-[1px] bg-outline-variant/10 dark:bg-white/[0.04]" />

              <ul className="space-y-3.5">
                {[
                  "15 items per study session limit",
                  "Seeded 300+ idioms library access",
                  "Basic spelling and definition tests",
                  "Limited revision Memory Vault slots",
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-[13px] font-medium text-outline/90 dark:text-white/70">
                    <Check size={14} className="text-secondary dark:text-[#34d399] mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/signup"
              className="mt-8 flex h-11 items-center justify-center rounded-xl border border-outline-variant/35 text-[13px] font-semibold text-on-surface transition-all hover:bg-surface-container/40 dark:border-white/10 dark:text-white dark:hover:bg-white/[0.02]"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Plan 2: Pro (Elevated Card) */}
          <div className="relative rounded-[24px] border border-primary bg-surface p-6 shadow-md dark:border-[#60a5fa] dark:bg-surface-container flex flex-col justify-between hover:shadow-lg transition-all duration-300 scale-[1.01]">
            <div className="absolute top-4 right-4 bg-primary/10 text-primary dark:bg-[#60a5fa]/10 dark:text-[#60a5fa] px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-display text-[18px] font-bold text-on-surface dark:text-white">
                  Exam Pro Rank
                </h3>
                <p className="text-[12.5px] text-outline/80 dark:text-white/50 mt-1">
                  Full library access with custom quiz builders.
                </p>
              </div>

              <div className="flex items-baseline">
                <span className="font-display text-[32px] font-black text-on-surface dark:text-white">
                  ₹{billingPeriod === "annually" ? "199" : "249"}
                </span>
                <span className="text-[13px] text-outline/60 dark:text-white/30 font-medium ml-1">
                  / month
                </span>
              </div>

              <div className="h-[1px] bg-outline-variant/10 dark:bg-white/[0.04]" />

              <ul className="space-y-3.5">
                {[
                  "Unlimited cards per study session",
                  "Priority Spaced Repetition scheduler",
                  "Full spelling pair and homonyms traps",
                  "Infinite revision Vault capacity",
                  "Server-side rolling XP validations",
                  "Advanced stats analytics Dashboard",
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-[13px] font-medium text-outline/90 dark:text-white/70">
                    <Check size={14} className="text-secondary dark:text-[#34d399] mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/signup"
              className="mt-8 flex h-11 items-center justify-center rounded-xl bg-primary text-[13px] font-semibold text-on-primary shadow-sm hover:opacity-95 dark:bg-[#60a5fa] dark:text-[#0c1929]"
            >
              Get Premium Access
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
