"use client";

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const initialized = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!cancelled) setUser(u);
      } catch {
        if (!cancelled) setUser(null);
      }

      if (!initialized.current) {
        initialized.current = true;
        if (!cancelled) setLoading(false);
      }
    };

    init();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event: string, session: { user: User | null } | null) => {
          setUser(session?.user ?? null);
          if (!initialized.current) {
            initialized.current = true;
            setLoading(false);
          }
        }
      );

      return () => {
        cancelled = true;
        subscription.unsubscribe();
      };
    } catch {
      return () => { cancelled = true; };
    }
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
}
