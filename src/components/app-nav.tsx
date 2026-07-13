"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, BookOpen, Star, BarChart3, Settings } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const APP_NAV = [
  { label: "Progress", href: "/progress", icon: BarChart3 },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Vault", href: "/memory-vault", icon: Star },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-outline-variant/40 bg-surface/90 shadow-md backdrop-blur-2xl"
            : "border-transparent bg-surface/60 backdrop-blur-xl"
        }`}
      >
        <div className="section-wrap flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-[13px] font-bold text-on-primary">
              V
            </div>
            <span className="font-display text-[16px] font-medium text-on-surface">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {APP_NAV.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-outline hover:bg-primary/8 hover:text-on-surface"
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-primary/8 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 top-14 z-40 border-t border-outline-variant/30 bg-surface px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {APP_NAV.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[14px] font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface hover:bg-primary/8"
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
