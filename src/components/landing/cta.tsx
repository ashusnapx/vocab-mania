"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Cta() {
  return (
    <section className="bg-[#fffdf8] py-20 dark:bg-[#0a0a0b] border-t border-outline-variant/10 dark:border-white/[0.03] transition-colors duration-300">
      <div className="section-wrap">
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary bg-[length:150%_150%] p-8 md:p-12 text-center text-on-primary shadow-xl">
          {/* Ambient shapes background */}
          <div className="absolute inset-0 bg-black/5 mix-blend-overlay" />
          <div className="absolute -top-32 -left-32 h-[300px] w-[300px] rounded-full bg-white/[0.08] blur-[50px]" />
          <div className="absolute -bottom-32 -right-32 h-[300px] w-[300px] rounded-full bg-white/[0.08] blur-[50px]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight sm:text-[44px]">
              Ready to upgrade your verbal rank?
            </h2>
            <p className="text-[15px] md:text-[16px] leading-relaxed text-white/80 max-w-[500px] mx-auto">
              Join thousands of aspirants who are mastering homonyms, idioms, and high-frequency vocabulary through deliberate, active practice.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4">
              <Link
                href="/signup"
                className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-[14px] font-bold text-primary transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-[0.98]"
              >
                Sign Up for Free
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/why-we-are-best"
                className="flex h-12 items-center justify-center rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5 px-7 text-[14px] font-bold text-white transition-all duration-200 active:scale-[0.98]"
              >
                Read Success Stories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
