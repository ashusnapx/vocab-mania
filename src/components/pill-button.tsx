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
  filled: "bg-primary text-on-primary shadow-sm hover:bg-primary/90 hover:shadow-md",
  tonal: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80",
  outlined: "border border-outline bg-transparent text-primary hover:bg-primary/8",
  text: "bg-transparent text-primary hover:bg-primary/8",
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

  // If logged in and pointing to an auth page, redirect to dashboard
  const resolvedHref = user && AUTH_ROUTES.includes(href) ? "/progress" : href;

  // If logged in, change label for auth CTAs
  const resolvedLabel =
    user && href === "/signup"
      ? "Go to Progress"
      : user && href === "/login"
        ? "Go to Progress"
        : label;

  return (
    <Link
      href={resolvedHref}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 ${variants[variant]} ${sizes[size]}`}
    >
      {resolvedLabel}
    </Link>
  );
}
