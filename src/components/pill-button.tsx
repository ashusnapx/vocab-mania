"use client";

import Link from "next/link";
import { useUser } from "@/lib/auth-context";

type PillButtonProps = {
  label: string;
  href: string;
  variant?: "filled" | "tonal" | "outlined" | "text";
  size?: "sm" | "md" | "lg";
};

const variants = {
  filled: "bg-violet-primary text-white shadow-sm hover:bg-violet-hover hover:shadow-md",
  tonal: "bg-violet-primary/10 text-violet-primary hover:bg-violet-primary/15 dark:bg-[#a78bfa]/10 dark:text-[#a78bfa]",
  outlined: "border border-mist-border/60 bg-transparent text-midnight-ink hover:bg-fog dark:border-white/[0.12] dark:text-white dark:hover:bg-white/[0.06]",
  text: "bg-transparent text-violet-primary hover:bg-violet-primary/10 dark:text-[#a78bfa] dark:hover:bg-[#a78bfa]/10",
};

const sizes = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-10 px-6 text-[14px]",
  lg: "h-12 px-8 text-[16px]",
};

const AUTH_ROUTES = ["/signup", "/login", "/forgot-password"];

export function PillButton({
  label,
  href,
  variant = "filled",
  size = "md",
}: PillButtonProps) {
  const { user } = useUser();

  const resolvedHref = user && AUTH_ROUTES.includes(href) ? "/progress" : href;

  const resolvedLabel =
    user && href === "/signup"
      ? "Go to Dashboard"
      : user && href === "/login"
        ? "Go to Dashboard"
        : label;

  return (
    <Link
      href={resolvedHref}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-primary focus-visible:ring-offset-2 active:scale-[0.97] ${variants[variant]} ${sizes[size]}`}
    >
      {resolvedLabel}
    </Link>
  );
}
