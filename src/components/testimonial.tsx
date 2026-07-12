import { TESTIMONIAL } from "@/lib/constants";
import { TagLabel } from "./tag-label";

export function Testimonial() {
  return (
    <section className="bg-md-surface-container py-16 md:py-24">
      <div className="section-wrap">
        <div className="mx-auto max-w-3xl">
          {/* Card on surface-container with shadow-lg, glass-morphism elements */}
          <div className="relative overflow-hidden rounded-[32px] bg-md-surface p-8 shadow-lg md:p-12">
            {/* Atmospheric blur decorations */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-md-primary/[0.08] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-md-tertiary/[0.06] blur-3xl" />

            <div className="relative">
              <div className="mb-6">
                <TagLabel>Testimonial</TagLabel>
              </div>

              <blockquote className="text-[20px] font-medium leading-relaxed text-md-on-surface sm:text-[24px]">
                &ldquo;{TESTIMONIAL.quote}&rdquo;
              </blockquote>

              <footer className="mt-8 flex items-center gap-4 border-t border-md-outline-variant/40 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-md-primary text-[16px] font-bold text-md-on-primary">
                  {TESTIMONIAL.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-[16px] font-medium text-md-on-surface">
                    {TESTIMONIAL.author}
                  </div>
                  <div className="text-[14px] text-md-on-surface-variant">
                    {TESTIMONIAL.role}
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
