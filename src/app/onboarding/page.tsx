"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/auth-context";
import { BookOpen, Target, Flame, Sparkles } from "lucide-react";

const GOALS = [
  { words: 5, label: "5 / day", time: "~10 min", icon: BookOpen },
  { words: 10, label: "10 / day", time: "~15 min", icon: Target },
  { words: 15, label: "15 / day", time: "~25 min", icon: Flame },
  { words: 20, label: "20 / day", time: "~35 min", icon: Sparkles },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const supabase = createClient();
  const [goal, setGoal] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleStart = async () => {
    if (!user || !goal) return;
    setSaving(true);

    await supabase.from("profiles").upsert({
      id: user.id,
      daily_goal: goal,
      onboarding_completed: true,
    });

    router.push("/dashboard");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-[14px] text-outline">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="font-display text-[26px] font-semibold text-on-surface mb-2">
            One last thing
          </h1>
          <p className="text-[15px] text-outline">
            How many words do you want to learn each day?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {GOALS.map((g) => (
            <button
              key={g.words}
              onClick={() => setGoal(g.words)}
              className={`rounded-xl border-2 p-5 text-left transition-all ${
                goal === g.words
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant/30 hover:border-primary/30"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3">
                <g.icon size={18} className="text-primary" />
              </div>
              <span className="text-[16px] font-medium text-on-surface block">{g.label}</span>
              <span className="text-[13px] text-outline">{g.time}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleStart}
          disabled={!goal || saving}
          className="w-full h-12 rounded-xl bg-primary text-[15px] font-medium text-on-primary transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Setting up..." : "Start Learning"}
        </button>
      </div>
    </div>
  );
}
