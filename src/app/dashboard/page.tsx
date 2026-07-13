"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { WORD_DATABASE } from "@/lib/words";
import { ProgressBar } from "@/components/progress-bar";
import { Flame, BookOpen, Target, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<{
    streak_days: number;
    daily_goal: number;
    last_active_date: string | null;
  } | null>(null);
  const [stats, setStats] = useState({
    learned: 0,
    mastered: 0,
    vaulted: 0,
    sessionsToday: 0,
  });
  const [recentSessions, setRecentSessions] = useState<{
    correct: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (!user) return;

    const fetchData = async () => {
      // Profile
      const { data: p } = await supabase
        .from("profiles")
        .select("streak_days, daily_goal, last_active_date")
        .eq("id", user.id)
        .single();
      setProfile(p);

      // Progress counts
      const { data: progress } = await supabase
        .from("user_progress")
        .select("status, repetitions")
        .eq("user_id", user.id);

      const learned = progress?.filter((r: { repetitions: number }) => r.repetitions > 0).length || 0;
      const mastered =
        progress?.filter((r: { status: string }) => r.status === "mastered").length || 0;

      // Vault
      const { count: vaulted } = await supabase
        .from("memory_vault")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Today's sessions
      const today = new Date().toISOString().split("T")[0];
      const { data: todaySessions } = await supabase
        .from("learning_sessions")
        .select("words_correct, words_incorrect")
        .eq("user_id", user.id)
        .gte("created_at", `${today}T00:00:00`)
        .not("completed_at", "is", null);

      const sessionsToday = todaySessions?.length || 0;
      const correctToday =
        todaySessions?.reduce((sum: number, s: { words_correct: number | null }) => sum + (s.words_correct || 0), 0) || 0;
      const totalToday =
        todaySessions?.reduce(
          (sum: number, s: { words_correct: number | null; words_incorrect: number | null }) =>
            sum + (s.words_correct || 0) + (s.words_incorrect || 0),
          0
        ) || 0;

      setStats({ learned, mastered, vaulted: vaulted || 0, sessionsToday });
      if (totalToday > 0) {
        setRecentSessions({ correct: correctToday, total: totalToday });
      }
    };

    fetchData();
  }, [user, loading, supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-[14px] text-outline">Loading...</div>
      </div>
    );
  }

  const streak = profile?.streak_days || 0;
  const dailyGoal = profile?.daily_goal || 10;

  return (
    <div className="min-h-screen bg-surface">
      <div className="section-wrap py-8">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="font-display text-[22px] font-semibold text-on-surface mb-1">
            Welcome back
          </h1>
          <p className="text-[14px] text-outline">
            {streak > 0
              ? `${streak} day streak — keep it going`
              : "Start today's session to build your streak"}
          </p>
        </div>

        {/* Streak + Goal */}
        <div className="card-surface p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <Flame size={18} className="text-red-500" />
              </div>
              <div>
                <p className="font-display text-[18px] font-bold text-on-surface">{streak}</p>
                <p className="text-[12px] text-outline">Day streak</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Target size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-display text-[18px] font-bold text-on-surface">{dailyGoal}</p>
                <p className="text-[12px] text-outline">Words / day</p>
              </div>
            </div>
          </div>
          <ProgressBar
            current={stats.learned}
            total={WORD_DATABASE.length}
            label={`${stats.learned} / ${WORD_DATABASE.length} words learned`}
            color="primary"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            href="/learn"
            className="card-surface p-5 group hover:border-primary/20 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3">
              <BookOpen size={18} className="text-primary" />
            </div>
            <p className="text-[15px] font-medium text-on-surface mb-0.5">
              Learn
            </p>
            <p className="text-[12px] text-outline mb-3">
              {recentSessions
                ? `Last: ${recentSessions.correct}/${recentSessions.total} correct`
                : "Start a new session"}
            </p>
            <span className="text-[13px] font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Start <ArrowRight size={12} />
            </span>
          </Link>

          <Link
            href="/memory-vault"
            className="card-surface p-5 group hover:border-tertiary/20 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary/10 mb-3">
              <Star size={18} className="text-tertiary" />
            </div>
            <p className="text-[15px] font-medium text-on-surface mb-0.5">
              Memory Vault
            </p>
            <p className="text-[12px] text-outline mb-3">
              {stats.vaulted} words saved
            </p>
            <span className="text-[13px] font-medium text-tertiary flex items-center gap-1 group-hover:gap-2 transition-all">
              Review <ArrowRight size={12} />
            </span>
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="card-surface p-5">
          <h2 className="font-display text-[14px] font-medium text-on-surface mb-3">
            Quick stats
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="font-display text-[20px] font-bold text-on-surface">{stats.learned}</p>
              <p className="text-[12px] text-outline">Learned</p>
            </div>
            <div className="text-center">
              <p className="font-display text-[20px] font-bold text-secondary">{stats.mastered}</p>
              <p className="text-[12px] text-outline">Mastered</p>
            </div>
            <div className="text-center">
              <p className="font-display text-[20px] font-bold text-on-surface">
                {stats.sessionsToday}
              </p>
              <p className="text-[12px] text-outline">Sessions today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
