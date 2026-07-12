import { HOW_IT_WORKS } from "@/lib/constants";
import { TagLabel } from "./tag-label";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-md-surface py-16 md:py-24">
      <div className="section-wrap">
        {/* Section header */}
        <div className="mb-12 max-w-2xl md:mb-16">
          <TagLabel>{HOW_IT_WORKS.tag}</TagLabel>
          <h2 className="mt-5 text-[32px] font-medium leading-[1.25] tracking-tight text-md-on-surface sm:text-[40px] md:text-[48px]">
            {HOW_IT_WORKS.headline}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-md-on-surface-variant md:text-[18px]">
            {HOW_IT_WORKS.subhead}
          </p>
        </div>

        {/* Steps — numbered badges with glow reveal on hover */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <div key={step.number} className="group relative">
              {/* Numbered badge with hidden glow that reveals on hover */}
              <div className="relative mb-5 inline-flex">
                <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-md-primary/0 opacity-0 blur-xl transition-all duration-500 group-hover:bg-md-primary/20 group-hover:opacity-100" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-[20px] bg-md-primary-container text-[18px] font-bold text-md-on-primary-container transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:bg-md-primary group-hover:text-md-on-primary group-hover:shadow-md">
                  {step.number}
                </div>
              </div>

              {/* Dashed connector — desktop only */}
              {i < HOW_IT_WORKS.steps.length - 1 && (
                <div className="pointer-events-none absolute left-7 top-7 hidden h-px w-full border-t border-dashed border-md-outline-variant lg:block" />
              )}

              {/* Content */}
              <h3 className="text-[24px] font-medium text-md-on-surface">
                {step.title}
              </h3>
              <p className="mt-2 text-[16px] leading-relaxed text-md-on-surface-variant">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
