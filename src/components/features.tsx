import { FEATURES } from "@/lib/constants";
import { TagLabel } from "./tag-label";

const iconPaths: Record<string, string> = {
  schedule:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
  auto_awesome:
    "M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z",
  quiz:
    "M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z",
  analytics:
    "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
  school:
    "M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z",
  emoji_events:
    "M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z",
};

export function Features() {
  return (
    <section id="features" className="bg-md-surface-container py-16 md:py-24">
      <div className="section-wrap">
        {/* Section header */}
        <div className="mb-12 max-w-2xl md:mb-16">
          <TagLabel>{FEATURES.tag}</TagLabel>
          <h2 className="mt-5 text-[32px] font-medium leading-[1.25] tracking-tight text-md-on-surface sm:text-[40px] md:text-[48px]">
            {FEATURES.headline}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-md-on-surface-variant md:text-[18px]">
            {FEATURES.subhead}
          </p>
        </div>

        {/* Feature grid — 3 columns, cards with shadow progression + hover scale */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.items.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-[24px] bg-md-surface p-6 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md hover:scale-[1.02] ${
                i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Glow that reveals on hover — progressive disclosure */}
              <div className="pointer-events-none absolute -top-14 -right-14 h-36 w-36 rounded-full bg-md-primary/0 opacity-0 blur-2xl transition-all duration-500 group-hover:bg-md-primary/10 group-hover:opacity-100" />

              <div className="relative">
                {/* Icon in secondary container */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[16px] bg-md-secondary-container transition-colors duration-300 group-hover:bg-md-primary-container">
                  <svg
                    className="h-6 w-6 text-md-on-secondary-container transition-colors duration-300 group-hover:text-md-on-primary-container"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={iconPaths[feature.icon] || ""} />
                  </svg>
                </div>

                {/* Category label */}
                <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-md-primary">
                  {feature.category}
                </span>

                {/* Title */}
                <h3 className="mt-2 text-[20px] font-medium text-md-on-surface">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-[15px] leading-relaxed text-md-on-surface-variant">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
