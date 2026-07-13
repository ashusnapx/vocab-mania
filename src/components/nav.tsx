"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { APP_NAME, NAV_LINKS, NAV_CTA } from "@/lib/constants";
import { useUser } from "@/lib/auth-context";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300">
      <div 
        className={`flex w-full max-w-5xl items-center justify-between h-14 px-6 rounded-full border transition-all duration-300 relative ${
          scrolled
            ? "border-neutral-200/80 bg-white/80 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0a0a0b]/80 shadow-lg"
            : "border-neutral-200/30 bg-white/50 backdrop-blur-md dark:border-white/[0.04] dark:bg-[#0a0a0b]/40 shadow-sm"
        }`}
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-black text-on-primary transition-all duration-300 group-hover:scale-105 group-hover:rotate-6 shadow-sm dark:bg-[#60a5fa] dark:text-[#0c1929]">
            V
          </div>
          <span className="font-display text-[15px] font-bold tracking-tight text-neutral-900 dark:text-white">
            {APP_NAME}
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-[13.5px] font-bold text-neutral-600 transition-all duration-200 hover:text-neutral-900 hover:bg-neutral-100/55 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/[0.03]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/60 bg-transparent text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900 dark:border-white/[0.08] dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer"
            aria-label="Toggle theme"
          >
            <ThemeIcon size={14} />
          </button>

          <Link
            href={user ? "/learn" : NAV_CTA.href}
            className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4.5 text-[13px] font-bold text-on-primary transition-all duration-200 hover:opacity-95 active:scale-[0.97] shadow-sm dark:bg-[#60a5fa] dark:text-[#0c1929]"
          >
            {user ? "Go to Study" : NAV_CTA.label}
          </Link>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/60 bg-transparent text-neutral-600 dark:border-white/[0.08] dark:text-white/60 cursor-pointer"
            aria-label="Toggle theme"
          >
            <ThemeIcon size={14} />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/60 bg-transparent text-neutral-600 dark:border-white/[0.08] dark:text-white/60 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>

        {/* MOBILE DRAWER (FLOATING CARD DESIGN) */}
        {mobileOpen && (
          <div className="absolute top-16 left-0 right-0 z-40 rounded-[22px] border border-neutral-200/70 bg-white/95 p-5 shadow-xl dark:border-white/10 dark:bg-[#0c0c0e]/95 md:hidden animate-fade-in-up" style={{ animationDuration: "0.2s" }}>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-bold text-neutral-800 transition-all hover:bg-neutral-50 dark:text-white dark:hover:bg-white/[0.06]"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href={user ? "/learn" : NAV_CTA.href}
                onClick={() => setMobileOpen(false)}
                className="mt-4 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-[14px] font-bold text-on-primary hover:opacity-95 transition-all dark:bg-[#60a5fa] dark:text-[#0c1929]"
              >
                {user ? "Go to Study" : NAV_CTA.label}
              </Link>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
