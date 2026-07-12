import Link from "next/link";
import { FOOTER, APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-surface-container-high py-12 md:py-16">
      <div className="section-wrap">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-primary text-[14px] font-bold text-on-primary">
                V
              </div>
              <span className="font-display text-[18px] font-medium text-on-surface">
                {APP_NAME}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-outline">
              {FOOTER.tagline}
            </p>

            {/* Newsletter input — M3 filled text field */}
            <div className="mt-6">
              <label htmlFor="footer-email" className="mb-1.5 block text-[12px] font-medium text-outline">
                Stay updated
              </label>
              <div className="flex gap-2">
                <input
                  id="footer-email"
                  type="email"
                  placeholder="your@email.com"
                  className="h-10 flex-1 rounded-t-[8px] border-b-2 border-b-outline bg-surface-container-low px-3 text-[14px] text-on-surface placeholder:text-outline/50 transition-colors duration-200 focus:border-b-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button className="h-10 rounded-full bg-primary px-4 text-[13px] font-medium text-on-primary transition-all duration-300 hover:bg-primary/90 active:scale-95">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER.columns.map((col) => (
            <div key={col.title}>
              <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-outline">
                {col.title}
              </span>
              <div className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[14px] text-outline transition-colors duration-200 hover:text-on-surface"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 border-t border-outline-variant/40 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-outline/70">{FOOTER.copyright}</p>
          <div className="flex gap-5">
            <Link href="#privacy" className="text-[13px] text-outline/70 transition-colors duration-200 hover:text-on-surface">Privacy</Link>
            <Link href="#terms" className="text-[13px] text-outline/70 transition-colors duration-200 hover:text-on-surface">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
