"use client";

import { WHY_BEST } from "@/lib/why-best-constants";
import { PillButton } from "@/components/pill-button";
import { TagLabel } from "@/components/tag-label";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function WhyBestHero() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className='relative overflow-hidden bg-surface pt-28 pb-16 md:pt-36 md:pb-24'>
      <div className='pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/[0.06] blur-3xl animate-blob' />
      <div
        className='pointer-events-none absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-secondary/[0.05] blur-3xl animate-blob'
        style={{ animationDelay: "2s" }}
      />

      <div ref={ref} className='section-wrap relative'>
        <div
          className={`mx-auto max-w-3xl text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <div className='mb-6 flex justify-center'>
            <TagLabel>{WHY_BEST.hero.tag}</TagLabel>
          </div>

          <h1 className='font-display text-[40px] font-medium leading-[1.12] tracking-tight text-on-surface sm:text-[48px] md:text-[56px]'>
            <span className='bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_200%] animate-gradient bg-clip-text text-transparent'>
              {WHY_BEST.hero.headline.split(".")[0]}.
            </span>
          </h1>

          <p className='mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-outline sm:text-[20px]'>
            {WHY_BEST.hero.subhead}
          </p>

          <div className='mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <div className='animate-pulse-glow rounded-full'>
              <PillButton
                label='Start learning free'
                href='/signup'
                variant='filled'
                size='lg'
              />
            </div>
            <PillButton
              label='See the science below'
              href='#science'
              variant='outlined'
              size='lg'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
