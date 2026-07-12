import { STATS } from "@/lib/constants";

export function Stats() {
  return (
    <section className="bg-md-surface-container-low py-12 md:py-16">
      <div className="section-wrap">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-1 ${
                i < STATS.length - 1
                  ? "border-r border-md-outline-variant/40 pr-6"
                  : "pr-0"
              } max-lg:border-r-0 max-lg:pr-0 max-lg:border-b max-lg:pb-6`}
            >
              <div className="text-[36px] font-medium tracking-tight text-md-on-surface sm:text-[40px]">
                {stat.value}
              </div>
              <div className="text-[13px] text-md-on-surface-variant">
                {stat.delta}
              </div>
              <div className="mt-1 text-[12px] font-medium uppercase tracking-[0.06em] text-md-on-surface-variant/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
