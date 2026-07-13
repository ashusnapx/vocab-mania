"use client";

import Link from "next/link";
import { APP_NAME, FOOTER } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-fog dark:bg-[#111318] pt-14 pb-10 border-t border-neutral-100 dark:border-white/[0.04]">
      <div className="section-wrap">
        <div className="grid gap-10 md:grid-cols-6 lg:grid-cols-12 mb-10">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-4 space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-primary text-[12px] font-bold text-white shadow-sm">
                V
              </div>
              <span className="font-display text-[15px] font-semibold text-midnight-ink dark:text-white">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-[13px] leading-[1.7] text-graphite dark:text-white/40 max-w-[240px]">
              {FOOTER.tagline}
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-4 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER.columns.map((group) => (
              <div key={group.title} className="space-y-3">
                <h4 className="text-[11px] font-bold text-graphite/50 dark:text-white/25 uppercase tracking-[0.1em]">
                  {group.title}
                </h4>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] font-medium text-graphite hover:text-midnight-ink transition-colors dark:text-white/45 dark:hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-neutral-100 dark:border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-graphite/50 dark:text-white/25">
            {FOOTER.copyright}
          </p>
          <div className="flex gap-4 text-[12px] font-medium text-graphite/40 dark:text-white/20">
            <span>Made in India</span>
            <span>·</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
