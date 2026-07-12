import Link from "next/link";
import { FOOTER, APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-md-surface-container-high py-12 md:py-16">
      <div className="section-wrap">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-md-primary text-[14px] font-bold text-md-on-primary">
                V
              </div>
              <span className="text-[18px] font-medium text-md-on-surface">
                {APP_NAME}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-md-on-surface-variant">
              {FOOTER.tagline}
            </p>
          </div>

          {/* Link columns */}
          {FOOTER.columns.map((col) => (
            <div key={col.title}>
              <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-md-on-surface-variant">
                {col.title}
              </span>
              <div className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[14px] text-md-on-surface-variant transition-colors duration-200 hover:text-md-on-surface"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start gap-4 border-t border-md-outline-variant/40 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-md-on-surface-variant/70">
            {FOOTER.copyright}
          </p>
          <div className="flex gap-5">
            <Link
              href="#privacy"
              className="text-[13px] text-md-on-surface-variant/70 transition-colors duration-200 hover:text-md-on-surface"
            >
              Privacy
            </Link>
            <Link
              href="#terms"
              className="text-[13px] text-md-on-surface-variant/70 transition-colors duration-200 hover:text-md-on-surface"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
