"use client";

import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const FOOTER_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Spaced Flashcards", href: "/learn" },
      { label: "Adaptive Quizzes", href: "/quiz" },
      { label: "Memory Vault", href: "/memory-vault" },
      { label: "Dynamic Ranks", href: "/progress" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Spelling Rules", href: "/why-we-are-best" },
      { label: "Idioms Decks", href: "/learn" },
      { label: "Study Guides", href: "/progress" },
      { label: "Community", href: "/why-we-are-best" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why Vocab Mania", href: "/why-we-are-best" },
      { label: "Pricing Options", href: "/#pricing" },
      { label: "FAQ Support", href: "/#faq" },
      { label: "Contact Us", href: "/settings" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/why-we-are-best" },
      { label: "Terms of Service", href: "/why-we-are-best" },
      { label: "Data Safety", href: "/settings" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#fffdf8] pt-16 pb-12 dark:bg-[#0a0a0b] border-t border-outline-variant/15 dark:border-white/[0.04] transition-colors duration-300">
      <div className="section-wrap">
        
        {/* Top section with columns */}
        <div className="grid gap-10 md:grid-cols-6 lg:grid-cols-12 mb-12">
          
          {/* Brand Identity Column */}
          <div className="md:col-span-2 lg:col-span-4 space-y-4 text-left">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-[13px] font-black text-on-primary shadow-sm dark:bg-[#60a5fa] dark:text-[#0c1929]">
                V
              </div>
              <span className="font-display text-[16px] font-bold text-on-surface dark:text-white">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-[13.5px] leading-relaxed text-outline/80 dark:text-white/40 max-w-[240px]">
              Deliberate vocabulary acquisition loops tailored for competitive Indian examinations.
            </p>
          </div>

          {/* Dynamic Link Groups */}
          <div className="md:col-span-4 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title} className="space-y-3.5 text-left">
                <h4 className="text-[11px] font-bold text-outline dark:text-white/30 uppercase tracking-widest">
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href}
                        className="text-[13.5px] font-medium text-outline/80 hover:text-on-surface transition-colors dark:text-white/50 dark:hover:text-white"
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

        {/* Bottom copyright and legal disclaimer */}
        <div className="pt-8 border-t border-outline-variant/10 dark:border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12.5px] text-outline/65 dark:text-white/30 font-medium">
            &copy; {new Date().getFullYear()} Vocab Mania. Crafted with deliberate focus.
          </p>
          <div className="flex gap-4 text-[12px] font-medium text-outline/50 dark:text-white/20">
            <span>Made in India</span>
            <span>•</span>
            <span>All rights reserved</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
