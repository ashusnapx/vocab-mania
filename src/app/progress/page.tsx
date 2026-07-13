"use client";

import { useState } from "react";
import { useUser } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useProgress, useSessions, useProfile } from "@/lib/queries";
import { WORD_DATABASE } from "@/lib/words";
import { getLevelProgress } from "@/lib/xp";
import {
  Flame,
  BookOpen,
  Star,
  TrendingUp,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Zap,
} from "lucide-react";

const PAGE_SIZE = 10;

export default function ProgressPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [ikPage, setIkPage] = useState(1);

  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: progress = [] } = useProgress(user?.id);
  const { data: sessions = [] } = useSessions(user?.id);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 size={20} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const learned = progress.filter(
    (p: { repetitions: number }) => p.repetitions > 0
  ).length;
  const mastered = progress.filter(
    (p: { status: string }) => p.status === "mastered"
  ).length;
  const reviewing = progress.filter(
    (p: { status: string }) => p.status === "reviewing"
  ).length;
  const streak = profile?.current_streak || 0;

  const totalCorrect = sessions.reduce(
    (sum: number, s: { words_correct: number | null }) =>
      sum + (s.words_correct || 0),
    0
  );
  const totalAttempted = sessions.reduce(
    (
      sum: number,
      s: { words_correct: number | null; words_incorrect: number | null }
    ) => sum + (s.words_correct || 0) + (s.words_incorrect || 0),
    0
  );
  const accuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const vaulted = progress.filter(
    (p: { status: string }) => p.status === "vaulted"
  ).length;

  // Mastered words for "I Know" table
  const masteredWordIds = progress
    .filter((p: { status: string }) => p.status === "mastered")
    .map((p: { word_id: string }) => p.word_id);
  const masteredWords = WORD_DATABASE.filter((w) =>
    masteredWordIds.includes(w.id)
  );
  const ikTotalPages = Math.max(1, Math.ceil(masteredWords.length / PAGE_SIZE));
  const ikPageWords = masteredWords.slice(
    (ikPage - 1) * PAGE_SIZE,
    ikPage * PAGE_SIZE
  );

  // Weekly data
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  type SessionRow = {
    completed_at: string;
    words_correct: number | null;
    words_incorrect: number | null;
  };
  const typedSessions = (sessions || []) as SessionRow[];
  const weekSessions = typedSessions.filter(
    (s) => new Date(s.completed_at) >= startOfWeek
  );

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

  const maxWeeklyCount = Math.max(...dailyCounts.map((d) => d.count), 1);

  function renderIkPagination() {
    if (ikTotalPages <= 1) return null;
    const pages: (number | "...")[] = [];
    if (ikTotalPages <= 5) {
      for (let i = 1; i <= ikTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (ikPage > 3) pages.push("...");
      const start = Math.max(2, ikPage - 1);
      const end = Math.min(ikTotalPages - 1, ikPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (ikPage < ikTotalPages - 2) pages.push("...");
      pages.push(ikTotalPages);
    }
    return pages;
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="section-wrap py-8">
        <h1 className="font-display text-[22px] font-semibold text-on-surface mb-6">
          Your Progress
        </h1>

        {/* XP & Level Card */}
        {(() => {
          const userXP = profile?.xp || 0;
          const { current, next, progress: levelProgress, xpNeeded } = getLevelProgress(userXP);
          return (
            <div className="card-surface p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${current.color}15` }}
                  >
                    <Zap size={20} style={{ color: current.color }} />
                  </div>
                  <div>
                    <p className="font-display text-[16px] font-bold text-on-surface">
                      {current.name}
                    </p>
                    <p className="text-[11px] text-outline">{current.hindiName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-[18px] font-bold text-on-surface">
                    {userXP} XP
                  </p>
                  {next && (
                    <p className="text-[11px] text-outline">
                      {xpNeeded} XP to {next.name}
                    </p>
                  )}
                </div>
              </div>
              {/* Level progress bar */}
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${levelProgress}%`,
                    backgroundColor: current.color,
                  }}
                />
              </div>
              {/* Level milestones */}
              <div className="flex justify-between mt-2">
                {[
                  { name: "Prarambhik", min: 0 },
                  { name: "Saksham", min: 100 },
                  { name: "Praveen", min: 300 },
                  { name: "Daksh", min: 600 },
                  { name: "Mastry", min: 1000 },
                ].map((lvl) => (
                  <span
                    key={lvl.name}
                    className={`text-[9px] ${userXP >= lvl.min ? "text-on-surface font-medium" : "text-outline/50"}`}
                  >
                    {lvl.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-surface p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 mb-2">
              <Flame size={16} className="text-red-500" />
            </div>
            <p className="font-display text-[22px] font-bold text-on-surface">
              {streak}
            </p>
            <p className="text-[12px] text-outline">Day streak</p>
          </div>
          <div className="card-surface p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 mb-2">
              <BookOpen size={16} className="text-primary" />
            </div>
            <p className="font-display text-[22px] font-bold text-on-surface">
              {learned}
            </p>
            <p className="text-[12px] text-outline">Words learned</p>
          </div>
          <div className="card-surface p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 mb-2">
              <TrendingUp size={16} className="text-secondary" />
            </div>
            <p className="font-display text-[22px] font-bold text-on-surface">
              {accuracy}%
            </p>
            <p className="text-[12px] text-outline">Accuracy</p>
          </div>
          <div className="card-surface p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tertiary/10 mb-2">
              <Star size={16} className="text-tertiary" />
            </div>
            <p className="font-display text-[22px] font-bold text-on-surface">
              {vaulted}
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
              <span className="text-[14px] font-medium text-on-surface">
                {reviewing}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-outline flex items-center gap-2">
                <span className="text-[16px]">🌿</span> Growing
              </span>
              <span className="text-[14px] font-medium text-on-surface">
                {learned - mastered - reviewing}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-outline flex items-center gap-2">
                <span className="text-[16px]">🌳</span> Mastered
              </span>
              <span className="text-[14px] font-medium text-on-surface">
                {mastered}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-outline flex items-center gap-2">
                <span className="text-[16px]">🛡️</span> Vault
              </span>
              <span className="text-[14px] font-medium text-on-surface">
                {vaulted}
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="card-surface p-5 mb-6">
          <h2 className="font-display text-[16px] font-semibold text-on-surface mb-4">
            This Week
          </h2>
          <div className="flex items-end justify-between gap-2 h-32">
            {dailyCounts.map((d) => (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-primary/10 rounded-lg relative overflow-hidden"
                  style={{ height: "80px" }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-lg transition-all"
                    style={{
                      height: `${Math.max(
                        (d.count / maxWeeklyCount) * 100,
                        d.count > 0 ? 20 : 0
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-outline">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* I Know Words Table */}
        <div className="card-surface p-5">
          <h2 className="font-display text-[16px] font-semibold text-on-surface mb-1">
            I Know
          </h2>
          <p className="text-[13px] text-outline mb-4">
            {masteredWords.length} words mastered
          </p>

          {masteredWords.length === 0 ? (
            <p className="text-[14px] text-outline py-8 text-center">
              No mastered words yet. Start learning to build your vocabulary.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="pb-2 text-[12px] font-medium text-outline">
                        Word
                      </th>
                      <th className="pb-2 text-[12px] font-medium text-outline">
                        Meaning
                      </th>
                      <th className="pb-2 text-[12px] font-medium text-outline">
                        Part of Speech
                      </th>
                      <th className="pb-2 text-[12px] font-medium text-outline hidden sm:table-cell">
                        Hindi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ikPageWords.map((word) => (
                      <tr
                        key={word.id}
                        className="border-b border-outline-variant/50 last:border-0"
                      >
                        <td className="py-2.5 text-[14px] font-medium text-on-surface">
                          {word.word}
                        </td>
                        <td className="py-2.5 text-[13px] text-outline max-w-[200px] truncate">
                          {word.meaning}
                        </td>
                        <td className="py-2.5">
                          <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                            {word.partOfSpeech}
                          </span>
                        </td>
                        <td className="py-2.5 text-[13px] text-outline hidden sm:table-cell">
                          {word.hindiMeaning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {ikTotalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-4">
                  <button
                    onClick={() => setIkPage((p) => Math.max(1, p - 1))}
                    disabled={ikPage === 1}
                    className="flex h-8 items-center justify-center rounded-lg px-2 text-[13px] text-outline hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {renderIkPagination()?.map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="flex h-8 w-8 items-center justify-center text-[13px] text-outline"
                      >
                        <MoreHorizontal size={14} />
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setIkPage(p as number)}
                        className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[13px] font-medium transition-colors ${
                          ikPage === p
                            ? "bg-primary text-on-primary"
                            : "text-outline hover:bg-surface-container-low"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setIkPage((p) => Math.min(ikTotalPages, p + 1))
                    }
                    disabled={ikPage === ikTotalPages}
                    className="flex h-8 items-center justify-center rounded-lg px-2 text-[13px] text-outline hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
