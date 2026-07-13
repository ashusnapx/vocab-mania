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
    const onScroll = () => setScrolled(window.scrollY > 10);
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-mist-border/40 bg-white/80 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#0a0a0b]/85"
          : "border-b border-transparent bg-white dark:bg-transparent"
      }`}
    >
      <div className="section-wrap flex h-14 items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-primary text-[14px] font-bold text-white transition-all duration-300 group-hover:scale-105 group-hover:rotate-6 shadow-sm">
            V
          </div>
          <span className="font-display text-[16px] font-semibold tracking-tight text-midnight-ink dark:text-white transition-colors duration-200">
            {APP_NAME}
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-[15px] font-medium text-graphite transition-all duration-200 hover:text-violet-primary dark:text-white/60 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-mist-border/60 bg-transparent text-graphite transition-all duration-200 hover:bg-fog dark:border-white/[0.08] dark:text-white/60 dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            <ThemeIcon size={16} />
          </button>

          <Link
            href={user ? "/progress" : NAV_CTA.href}
            className="inline-flex items-center justify-center rounded-xl bg-violet-primary px-5 py-2 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-violet-hover active:scale-[0.97] shadow-sm"
          >
            {user ? "Dashboard" : NAV_CTA.label}
          </Link>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-mist-border/60 bg-transparent text-graphite dark:border-white/[0.08] dark:text-white/60"
            aria-label="Toggle theme"
          >
            <ThemeIcon size={16} />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-mist-border/60 bg-transparent text-graphite dark:border-white/[0.08] dark:text-white/60"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 top-14 z-40 bg-white/95 dark:bg-[#0a0a0b]/95 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1 p-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium text-midnight-ink transition-all hover:bg-fog dark:text-white dark:hover:bg-white/[0.06]"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={user ? "/progress" : NAV_CTA.href}
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-violet-primary py-3.5 text-center text-[15px] font-semibold text-white hover:bg-violet-hover transition-all"
            >
              {user ? "Go to Dashboard" : NAV_CTA.label}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
