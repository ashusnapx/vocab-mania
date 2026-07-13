"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Normalize coordinates between -1 and 1
    setCoords({
      x: x / (rect.width / 2),
      y: y / (rect.height / 2),
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden bg-[#fffdf8] pt-20 pb-12 dark:bg-[#0a0a0b] md:pt-28 md:pb-20 transition-colors duration-300"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(120, 113, 108, 0.04) 1px, transparent 1px)",
        backgroundSize: "24px 24px"
      }}
    >
      {/* Background ambient glows & floating shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[120px] dark:bg-[#60a5fa]/[0.02]" />
        <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary/[0.04] blur-[100px] dark:bg-[#34d399]/[0.02]" />
        
        {/* Floating abstract outline vectors */}
        <div className="absolute top-16 left-12 w-20 h-20 rounded-full border border-outline-variant/15 dark:border-white/[0.03] animate-pulse hidden md:block" />
        <div className="absolute bottom-24 right-16 w-28 h-28 border border-dashed border-outline-variant/10 rounded-3xl rotate-12 dark:border-white/[0.02] hidden md:block" />
      </div>

      <div className="section-wrap relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-7 space-y-8 text-left animate-fade-in">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-low/50 px-3 py-1.5 text-[12px] font-semibold text-primary dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-[#60a5fa] shadow-sm">
            <Sparkles size={12} className="animate-pulse" />
            <span>Spaced Repetition Redefined for Exams</span>
          </div>

          {/* Heading with Underline & Strike */}
          <h1 className="font-display text-[44px] font-bold leading-[1.12] tracking-tight text-on-surface dark:text-white sm:text-[56px] md:text-[68px]">
            <span className="relative inline-block text-outline/30 dark:text-white/20 mr-2">
              <span className="absolute inset-x-0 top-1/2 h-[3px] bg-red-500/70 -rotate-3 rounded-full" />
              Rote prep.
            </span>
            <br />
            Master vocabulary <br />
            <span className="relative inline-block bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent dark:from-[#60a5fa] dark:via-[#34d399] dark:to-[#fbbf24] pb-2">
              Effortlessly.
              {/* Hand-drawn double SVG wavy underline */}
              <svg className="absolute -bottom-1.5 left-0 w-full h-3 text-secondary/80 dark:text-[#34d399]/70" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q25,0 50,5 T100,5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-[620px] text-[16px] leading-relaxed text-outline/80 dark:text-white/60 sm:text-[18px]">
            A premium learning platform tailored for competitive aspirants. Master spelling boundaries, idioms, and high-frequency vocabulary through dynamic flashcard retrieval and smart adaptive quizzes.
          </p>

          {/* Actions */}
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[14px] font-semibold text-on-primary shadow-lg shadow-primary/10 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/15 active:scale-[0.98] dark:bg-[#60a5fa] dark:text-[#0c1929] dark:shadow-[#60a5fa]/5"
            >
              Get Started Free
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/why-we-are-best"
              className="flex h-12 items-center justify-center rounded-xl border border-outline-variant/30 px-6 text-[14px] font-semibold text-on-surface transition-all duration-200 hover:bg-surface-container/30 active:scale-[0.98] dark:border-white/10 dark:text-white dark:hover:bg-white/[0.03]"
            >
              Learn More
            </Link>
          </div>

          {/* Trust features */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[13px] font-medium text-outline/70 dark:text-white/40">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/15 text-secondary dark:bg-[#34d399]/15 dark:text-[#34d399] text-[10px] font-bold">
                ✓
              </span>
              No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/15 text-secondary dark:bg-[#34d399]/15 dark:text-[#34d399] text-[10px] font-bold">
                ✓
              </span>
              300+ idioms seeded
            </div>
          </div>
        </div>

        {/* Right Column: 3D Tilting Card Preview */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in [--animation-delay:200ms] relative">
          <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-[360px] aspect-[4/5] rounded-[24px] border border-outline-variant/20 bg-surface p-6 shadow-xl dark:border-white/[0.06] dark:bg-surface-container transition-all duration-200 ease-out cursor-pointer"
            style={{
              transform: isHovered 
                ? `perspective(1000px) rotateY(${coords.x * 12}deg) rotateX(${coords.y * -12}deg) scale(1.02)`
                : `perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)`,
              boxShadow: isHovered
                ? `0 20px 40px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.1), ${coords.x * -10}px ${coords.y * -10}px 30px rgba(96, 165, 250, 0.05)`
                : `0 10px 30px rgba(0,0,0,0.03)`,
            }}
          >
            {/* Glossy gradient line top */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[24px] bg-gradient-to-r from-primary via-secondary to-tertiary dark:from-[#60a5fa] dark:via-[#34d399] dark:to-[#fbbf24]" />

            <div className="flex flex-col justify-between h-full pt-4">
              {/* Card Badge */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary dark:bg-[#60a5fa]/10 dark:text-[#60a5fa]">
                  Vocabulary Card
                </span>
                <span className="text-[10px] font-medium text-outline/50 dark:text-white/30">
                  Level 14 • Praveen
                </span>
              </div>

              {/* Floating elements inside mockup */}
              <div className="my-auto text-center space-y-3">
                <h3 className="font-display text-[26px] font-black text-on-surface dark:text-white tracking-tight">
                  Acumen
                </h3>
                <p className="text-[12px] font-medium text-primary dark:text-[#60a5fa] italic">
                  noun • /əˈkjuː.mən/
                </p>
                <div className="h-[1px] w-12 bg-outline-variant/30 mx-auto dark:bg-white/10" />
                <p className="text-[13.5px] leading-relaxed text-outline dark:text-white/60 max-w-[260px] mx-auto">
                  &ldquo;The ability to make good judgments and quick, accurate decisions.&rdquo;
                </p>
                <p className="text-[13px] font-bold text-secondary dark:text-[#34d399]">
                  कुशाग्र बुद्धि, सूक्ष्म दृष्टि
                </p>
              </div>

              {/* Action Preview bar */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 h-9 rounded-xl border border-outline-variant/35 bg-surface-container-low text-[11px] font-bold text-outline/65 flex items-center justify-center dark:border-white/10 dark:bg-white/[0.01] dark:text-white/50">
                    Don&apos;t Know
                  </div>
                  <div className="flex-1 h-9 rounded-xl bg-primary text-[11px] font-bold text-on-primary flex items-center justify-center gap-1 dark:bg-[#60a5fa] dark:text-[#0c1929]">
                    I Know This
                  </div>
                </div>
                
                {/* Stats simulation */}
                <div className="flex justify-between items-center text-[10px] text-outline/40 dark:text-white/20 font-semibold border-t border-outline-variant/15 pt-3 dark:border-white/[0.04]">
                  <span>Familiarity: 82%</span>
                  <span>Next review: 4 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
