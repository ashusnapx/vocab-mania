"use client";

import { Nav } from "@/components/nav";
import { AppNav } from "@/components/app-nav";
import { useUser } from "@/lib/auth-context";

export function NavRouter() {
  const { user, loading } = useUser();

  if (loading) return null;

  // Logged-in users always see AppNav
  if (user) return <AppNav />;

  // Logged-out users see marketing Nav
  return <Nav />;
}
