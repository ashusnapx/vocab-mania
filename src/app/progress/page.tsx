"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { WORD_DATABASE } from "@/lib/words";
import { Flame, BookOpen, Star, TrendingUp } from "lucide-react";

export default function ProgressPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const [stats, setStats] = useState({
    totalWords: WORD_DATABASE.length,
    learned: 0,
    mastered: 0,
    reviewing: 0,
    vaulted: 0,
    streak: 0,
    sessionsCompleted: 0,
    accuracy: 0,
  });

  const [weeklySessions, setWeeklySessions] = useState<
    { day: string; count: number }[]
  >([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (!user) return;

    const fetchStats = async () => {
      // Progress
      const { data: progress } = await supabase
        .from("user_progress")
        .select("status, repetitions")
        .eq("user_id", user.id);

      const learned = progress?.filter((p: { repetitions: number }) => p.repetitions > 0).length || 0;
      const mastered = progress?.filter((p: { status: string }) => p.status === "mastered").length || 0;
      const reviewing = progress?.filter(
        (p: { status: string }) => p.status === "reviewing"
      ).length || 0;

      // Vault
      const { count: vaulted } = await supabase
        .from("memory_vault")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Sessions
      const { data: sessions } = await supabase
        .from("learning_sessions")
        .select("completed_at, words_correct, words_incorrect")
        .eq("user_id", user.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false });

      const sessionsCompleted = sessions?.length || 0;
      const totalCorrect =
        sessions?.reduce((sum: number, s: { words_correct: number | null }) => sum + (s.words_correct || 0), 0) || 0;
      const totalAttempted =
        sessions?.reduce(
          (sum: number, s: { words_correct: number | null; words_incorrect: number | null }) =>
            sum + (s.words_correct || 0) + (s.words_incorrect || 0),
          0
        ) || 0;
      const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

      // Profile for streak
      const { data: profile } = await supabase
        .from("profiles")
        .select("last_active_date, streak_days")
        .eq("id", user.id)
        .single();

      const streak = profile?.streak_days || 0;

      type SessionRow = { completed_at: string; words_correct: number | null; words_incorrect: number | null };
      const typedSessions = (sessions || []) as SessionRow[];

      // Weekly data
      const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);

      const weekSessions =
        typedSessions.filter(
          (s) => new Date(s.completed_at) >= startOfWeek
        ) || [];

      const dailyCounts = daysOfWeek.map((day, i) => {
        const dayStart = new Date(startOfWeek);
        dayStart.setDate(startOfWeek.getDate() + i);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);

        const count = weekSessions.filter((s) => {
          const d = new Date(s.completed_at);
          return d >= dayStart && d < dayEnd;
        }).length;

        return { day, count };
      });

      setStats({
        totalWords: WORD_DATABASE.length,
        learned,
        mastered,
        reviewing,
        vaulted: vaulted || 0,
        streak,
        sessionsCompleted,
        accuracy,
      });

      setWeeklySessions(dailyCounts);
    };

    fetchStats();
  }, [user, loading, supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-[14px] text-outline">Loading...</div>
      </div>
    );
  }

  const maxWeeklyCount = Math.max(...weeklySessions.map((d) => d.count), 1);

  return (
    <div className="min-h-screen bg-surface">
      <div className="section-wrap py-8">
        <h1 className="font-display text-[22px] font-semibold text-on-surface mb-6">
          Your Progress
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-surface p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 mb-2">
              <Flame size={16} className="text-red-500" />
            </div>
            <p className="font-display text-[22px] font-bold text-on-surface">
              {stats.streak}
            </p>
            <p className="text-[12px] text-outline">Day streak</p>
          </div>
          <div className="card-surface p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 mb-2">
              <BookOpen size={16} className="text-primary" />
            </div>
            <p className="font-display text-[22px] font-bold text-on-surface">
              {stats.learned}
            </p>
            <p className="text-[12px] text-outline">Words learned</p>
          </div>
          <div className="card-surface p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 mb-2">
              <TrendingUp size={16} className="text-secondary" />
            </div>
            <p className="font-display text-[22px] font-bold text-on-surface">
              {stats.accuracy}%
            </p>
            <p className="text-[12px] text-outline">Accuracy</p>
          </div>
          <div className="card-surface p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tertiary/10 mb-2">
              <Star size={16} className="text-tertiary" />
            </div>
            <p className="font-display text-[22px] font-bold text-on-surface">
              {stats.vaulted}
            </p>
            <p className="text-[12px] text-outline">In vault</p>
          </div>
        </div>

        {/* Memory Map */}
        <div className="card-surface p-5 mb-6">
          <h2 className="font-display text-[16px] font-semibold text-on-surface mb-4">
            Memory Map
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-outline flex items-center gap-2">
                <span className="text-[16px]">🌱</span> Learning
              </span>
              <span className="text-[14px] font-medium text-on-surface">{stats.reviewing}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-outline flex items-center gap-2">
                <span className="text-[16px]">🌿</span> Growing
              </span>
              <span className="text-[14px] font-medium text-on-surface">
                {stats.learned - stats.mastered - stats.reviewing}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-outline flex items-center gap-2">
                <span className="text-[16px]">🌳</span> Mastered
              </span>
              <span className="text-[14px] font-medium text-on-surface">{stats.mastered}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-outline flex items-center gap-2">
                <span className="text-[16px]">🛡️</span> Vault
              </span>
              <span className="text-[14px] font-medium text-on-surface">{stats.vaulted}</span>
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="card-surface p-5">
          <h2 className="font-display text-[16px] font-semibold text-on-surface mb-4">
            This Week
          </h2>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklySessions.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary/10 rounded-lg relative overflow-hidden" style={{ height: "80px" }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-lg transition-all"
                    style={{
                      height: `${Math.max((d.count / maxWeeklyCount) * 100, d.count > 0 ? 20 : 0)}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-outline">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
