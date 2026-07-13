"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, BookOpen, Star, BarChart3, Settings, Brain } from "lucide-react";
import { useTheme } from "next-themes";
import { APP_NAME } from "@/lib/constants";

const APP_NAV = [
  { label: "Progress", href: "/progress", icon: BarChart3 },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Quiz", href: "/quiz", icon: Brain },
  { label: "Vault", href: "/memory-vault", icon: Star },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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

  const cycleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-black text-on-primary transition-all duration-300 group-hover:scale-105 group-hover:rotate-6 shadow-sm dark:bg-[#60a5fa] dark:text-[#0c1929]">
            V
          </div>
          <span className="font-display text-[15px] font-bold text-neutral-900 dark:text-white hidden sm:block">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {APP_NAV.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13.5px] font-bold transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary dark:bg-[#60a5fa]/10 dark:text-[#60a5fa]"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/[0.03]"
                }`}
              >
                <Icon size={14} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={cycleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            <ThemeIcon size={14} />
          </button>
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={cycleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            <ThemeIcon size={14} />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>

        {/* Mobile overlay (Floating Card Drawer) */}
        {mobileOpen && (
          <div className="absolute top-16 left-0 right-0 z-40 rounded-[22px] border border-neutral-200/70 bg-white/95 p-5 shadow-xl dark:border-white/10 dark:bg-[#0c0c0e]/95 md:hidden animate-fade-in-up" style={{ animationDuration: "0.2s" }}>
            <div className="flex flex-col gap-1">
              {APP_NAV.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14.5px] font-bold transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary dark:bg-[#60a5fa]/10 dark:text-[#60a5fa]"
                        : "text-neutral-800 hover:bg-neutral-50 dark:text-white dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
