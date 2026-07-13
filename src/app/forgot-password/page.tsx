"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="card-surface p-8">
            <p className="font-display text-[20px] font-semibold text-on-surface mb-2">
              Check your email
            </p>
            <p className="text-[14px] text-outline mb-6">
              We sent a password reset link to <strong>{email}</strong>.
            </p>
            <Link
              href="/login"
              className="text-[14px] text-primary font-medium hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-[13px] text-outline hover:text-on-surface transition-colors mb-6">
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
          <h1 className="font-display text-[24px] font-semibold text-on-surface mb-1">
            Reset password
          </h1>
          <p className="text-[14px] text-outline">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-12 px-4 rounded-xl border border-outline-variant/40 text-[14px] text-on-surface placeholder:text-outline bg-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />

          {error && (
            <p className="text-[13px] text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Sending..." : "Send reset link"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
