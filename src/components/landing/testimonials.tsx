"use client";

import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Anish Kumar",
    role: "SSC CGL Candidate",
    stat: "Score: 135/135 in English",
    content: "The dynamic spelling traps for homonyms were an absolute lifesaver. Standard books don't challenge you the way Vocab Mania's quiz engine does. The vault system let me target my final week revision in minutes.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
  },
  {
    name: "Preeti Verma",
    role: "Bank PO Aspirant",
    stat: "Vocab: 820+ Words Mastered",
    content: "I loved the Airbnb streak calendar. Checking in every morning to keep my flame growing kept me disciplined. The level progression badge felt very satisfying to level up from Saksham to Acharya.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  },
  {
    name: "Shivam Singh",
    role: "NDA Candidate",
    stat: "Accuracy: 96.4% in Quizzes",
    content: "Seeding 300+ idioms with Hindi meanings is a brilliant addition. I studied them on the dynamic cards and completed all quiz modules. It is extremely fast and effective compared to reading static PDFs.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
];

export function Testimonials() {
  return (
    <section className="bg-[#fffdf8] py-20 dark:bg-[#0a0a0b] border-t border-outline-variant/10 dark:border-white/[0.03] transition-colors duration-300">
      <div className="section-wrap">
        <div className="mx-auto max-w-2xl text-center mb-16 space-y-3">
          <p className="text-[11px] font-bold text-primary dark:text-[#60a5fa] uppercase tracking-widest">
            Aspirant Success Stories
          </p>
          <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight text-on-surface dark:text-white sm:text-[40px]">
            Trusted by top rankers.
          </h2>
          <p className="text-[15px] leading-relaxed text-outline/80 dark:text-white/50 max-w-[480px] mx-auto">
            See how competitive aspirants are transforming their English section prep using our dynamic retrieval platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={t.name}
              className="relative rounded-[24px] border border-outline-variant/20 bg-surface p-6 shadow-sm dark:border-white/[0.04] dark:bg-surface-container flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-4">
                <Quote size={20} className="text-outline/15 dark:text-white/10 fill-current" />
                <p className="text-[14px] leading-relaxed text-on-surface/90 dark:text-white/70">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-outline-variant/10 mt-6 dark:border-white/[0.04]">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="h-10 w-10 rounded-full object-cover border border-outline-variant/20 dark:border-white/10"
                />
                <div>
                  <h4 className="text-[13.5px] font-bold text-on-surface dark:text-white leading-normal">
                    {t.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-outline/80 mt-0.5 dark:text-white/40">
                    <span>{t.role}</span>
                    <span className="h-1 w-1 rounded-full bg-outline/30 dark:bg-white/10" />
                    <span className="text-secondary dark:text-[#34d399]">{t.stat}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
