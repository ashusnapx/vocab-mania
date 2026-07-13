"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", data.user.id)
      .single();

    router.push("/learn");
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0a0a0b] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-[15px] font-bold text-on-primary dark:bg-[#60a5fa] dark:text-[#0c1929]">
              V
            </div>
            <span className="font-display text-[20px] font-medium text-on-surface dark:text-white">
              Vocab Mania
            </span>
          </Link>
          <h1 className="font-display text-[24px] font-semibold text-on-surface dark:text-white mb-1">
            Welcome back
          </h1>
          <p className="text-[14px] text-outline dark:text-white/50">
            Sign in to continue learning
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full h-12 rounded-xl border border-outline-variant/40 text-[14px] font-medium text-on-surface transition-all hover:bg-surface-hover active:scale-[0.98] flex items-center justify-center gap-3 mb-4 dark:border-white/[0.1] dark:text-white dark:hover:bg-white/[0.06]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-outline-variant/40 dark:bg-white/[0.08]" />
          <span className="text-[12px] text-outline dark:text-white/40">or</span>
          <div className="flex-1 h-px bg-outline-variant/40 dark:bg-white/[0.08]" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl border border-outline-variant/40 text-[14px] text-on-surface placeholder:text-outline bg-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 dark:border-white/[0.1] dark:text-white dark:placeholder:text-white/30 dark:bg-white/[0.04] dark:focus:border-[#60a5fa]"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 pr-12 rounded-xl border border-outline-variant/40 text-[14px] text-on-surface placeholder:text-outline bg-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 dark:border-white/[0.1] dark:text-white dark:placeholder:text-white/30 dark:bg-white/[0.04] dark:focus:border-[#60a5fa]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors dark:text-white/40 dark:hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-[13px] text-error dark:text-[#f87171]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 dark:bg-[#60a5fa] dark:text-[#0c1929] dark:hover:bg-[#60a5fa]/90"
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center">
          <Link
            href="/forgot-password"
            className="text-[13px] text-primary hover:underline dark:text-[#60a5fa]"
          >
            Forgot password?
          </Link>
          <p className="text-[13px] text-outline dark:text-white/50">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline dark:text-[#60a5fa]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
