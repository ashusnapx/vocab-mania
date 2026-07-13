"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [theme]);

  return null;
}
