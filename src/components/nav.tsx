"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { APP_NAME, NAV_LINKS, NAV_CTA } from "@/lib/constants";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-md-outline-variant/30 bg-md-surface/80 backdrop-blur-xl">
      <div className="section-wrap flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-md-primary text-[14px] font-bold text-md-on-primary">
            V
          </div>
          <span className="text-[18px] font-medium text-md-on-surface">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-[14px] font-medium text-md-on-surface-variant transition-all duration-200 hover:bg-md-primary/8 hover:text-md-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2 active:scale-95"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA — pill button */}
        <Link
          href={NAV_CTA.href}
          className="hidden rounded-full bg-md-primary px-6 py-2.5 text-[14px] font-medium text-md-on-primary shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-md-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2 active:scale-95 md:inline-flex"
        >
          {NAV_CTA.label}
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-md-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2 active:scale-95 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-md-outline-variant/30 bg-md-surface-container px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-[12px] px-4 py-3 text-[14px] font-medium text-md-on-surface transition-colors duration-200 hover:bg-md-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={NAV_CTA.href}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-md-primary px-6 py-3 text-center text-[14px] font-medium text-md-on-primary transition-all duration-300 hover:bg-md-primary/90 active:scale-95"
            >
              {NAV_CTA.label}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
