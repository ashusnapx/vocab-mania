"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useUser } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useProfile, useSessions, useFolderStats, useMasteredItems } from "@/lib/queries";
import { FOLDERS } from "@/lib/folders";
import type { FolderConfig } from "@/lib/folders";
import { getProgress, getTier, TIERS } from "@/lib/progression";
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
  ArrowLeft,
  Award,
  Play,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 10;

export default function ProgressPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: sessions = [] } = useSessions(user?.id);
  const { data: folderStats = {} } = useFolderStats(user?.id);

  const [selectedFolder, setSelectedFolder] = useState<FolderConfig | null>(null);
  const [ikPage, setIkPage] = useState(1);
  const [calendarDate, setCalendarDate] = useState(() => new Date());

  const { data: masteredRows = [] } = useMasteredItems(user?.id, selectedFolder);

  // Calendar controls
  const handlePrevMonth = useCallback(() => {
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);
  const handleNextMonth = useCallback(() => {
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  // Compute activity dates
  const activityDates = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach((s: any) => {
      if (s.completed_at) {
        set.add(new Date(s.completed_at).toDateString());
      }
    });
    return set;
  }, [sessions]);

  // Compute calendar layout grids
  const calendarCells = useMemo(() => {
    const calYear = calendarDate.getFullYear();
    const calMonth = calendarDate.getMonth();
    
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(calYear, calMonth, 0).getDate();

    const list: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    // Previous month padding cells
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthTotalDays - i;
      list.push({
        day,
        isCurrentMonth: false,
        date: new Date(calYear, calMonth - 1, day),
      });
    }

    // Current month cells
    for (let d = 1; d <= totalDays; d++) {
      list.push({
        day: d,
        isCurrentMonth: true,
        date: new Date(calYear, calMonth, d),
      });
    }

    // Next month padding cells
    const remaining = 42 - list.length;
    for (let d = 1; d <= remaining; d++) {
      list.push({
        day: d,
        isCurrentMonth: false,
        date: new Date(calYear, calMonth + 1, d),
      });
    }

    return list;
  }, [calendarDate]);

  const handleIkFolderClick = useCallback((folder: FolderConfig) => {
    setSelectedFolder(folder);
    setIkPage(1);
  }, []);

  const backToSections = useCallback(() => {
    setSelectedFolder(null);
  }, []);

  // Compute XP Progression details
  const userXP = profile?.xp || 0;
  const streak = profile?.current_streak || 0;

  const p = getProgress(userXP);
  const currentLevel = p.currentLevel;
  const currentTier = getTier(currentLevel);
  const nextLevel = currentLevel + 1;

  // Compute study stats
  const totalCorrect = sessions.reduce(
    (sum: number, s: { words_correct: number | null }) =>
      sum + (s.words_correct || 0),
    0
  );
  const totalAttempted = sessions.reduce(
    (sum: number, s: { words_correct: number | null; words_incorrect: number | null }) =>
      sum + (s.words_correct || 0) + (s.words_incorrect || 0),
    0
  );
  const accuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const totalLearned = Object.values(folderStats).reduce(
    (sum, s) => sum + s.mastered,
    0
  );
  const totalVaulted = Object.values(folderStats).reduce(
    (sum, s) => sum + s.vaulted,
    0
  );

  // Early returns placed strictly AFTER hooks declaration
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center dark:bg-[#0a0a0b]">
        <Loader2 size={24} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // ======== DETAILED I KNOW PROGRESS VIEW ========
  if (selectedFolder) {
    const totalPages = Math.max(1, Math.ceil(masteredRows.length / PAGE_SIZE));
    const pageItems = masteredRows.slice((ikPage - 1) * PAGE_SIZE, ikPage * PAGE_SIZE);

    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (ikPage > 3) pages.push("...");
      const start = Math.max(2, ikPage - 1);
      const end = Math.min(totalPages - 1, ikPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (ikPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return (
      <div className="min-h-screen bg-surface dark:bg-[#0a0a0b] transition-colors duration-300">
        <div className="section-wrap py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={backToSections}
              className="flex items-center gap-1.5 text-[12.5px] font-bold text-outline hover:text-on-surface transition-colors"
            >
              <ArrowLeft size={14} />
              Progress
            </button>
            <span className="text-[14px] font-bold text-on-surface dark:text-white">
              {selectedFolder.name} Mastered List
            </span>
          </div>

          <div className="card-surface p-6">
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant/10 pb-3 dark:border-white/[0.03]">
              <div>
                <h2 className="font-display text-[16px] font-black text-on-surface dark:text-white">
                  Mastered items
                </h2>
                <p className="text-[12px] text-outline">
                  {masteredRows.length} items logged under this path
                </p>
              </div>
            </div>

            {masteredRows.length === 0 ? (
              <p className="text-[13.5px] text-outline/80 py-8 text-center">
                No mastered items yet. Start learning to build your vocabulary.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-outline-variant/10 dark:border-white/[0.04] text-[11px] font-bold text-outline uppercase tracking-wider">
                        <th className="pb-2">
                          {selectedFolder.id === "homonyms" ? "Words" : "Word"}
                        </th>
                        <th className="pb-2">Meaning</th>
                        <th className="pb-2 hidden sm:table-cell">Hindi translation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 dark:divide-white/[0.03]">
                      {pageItems.map((row) => {
                        const isHomonym = selectedFolder.id === "homonyms";
                        const title = isHomonym
                          ? `${row.word1 ?? ""} vs ${row.word2 ?? ""}`
                          : (row.word as string) ?? "";
                        const meaning = isHomonym
                          ? `${row.meaning1 ?? ""} / ${row.meaning2 ?? ""}`
                          : (row.meaning as string) ?? "";
                        const hindi = isHomonym
                          ? `${row.hindi1 ?? ""} / ${row.hindi2 ?? ""}`
                          : (row.hindi_meaning as string) ?? "";
                        const rowId = isHomonym
                          ? (row.id as number)
                          : (row.id as string);

                        return (
                          <tr key={rowId} className="hover:bg-surface-container-low/20 transition-colors">
                            <td className="py-3 text-[13.5px] font-bold text-on-surface dark:text-white">
                              {title}
                            </td>
                            <td className="py-3 text-[13px] text-outline/90 max-w-[240px] truncate dark:text-white/60">
                              {meaning}
                            </td>
                            <td className="py-3 text-[13px] text-secondary font-bold hidden sm:table-cell dark:text-[#34d399]">
                              {hindi}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 mt-6">
                    <button
                      onClick={() => setIkPage((p) => Math.max(1, p - 1))}
                      disabled={ikPage === 1}
                      className="flex h-8 items-center justify-center rounded-lg px-2 text-[12px] font-bold text-outline hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {pages.map((p, i) =>
                      p === "..." ? (
                        <span
                          key={`ellipsis-${i}`}
                          className="flex h-8 w-8 items-center justify-center text-[12px] text-outline"
                        >
                          <MoreHorizontal size={14} />
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setIkPage(p as number)}
                          className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[12.5px] font-bold transition-all ${
                            ikPage === p
                              ? "bg-primary text-on-primary dark:bg-[#60a5fa] dark:text-[#0c1929]"
                              : "text-outline hover:bg-surface-container"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => setIkPage((p) => Math.min(totalPages, p + 1))}
                      disabled={ikPage === totalPages}
                      className="flex h-8 items-center justify-center rounded-lg px-2 text-[12px] font-bold text-outline hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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

  // ======== MAIN MISSION CONTROL DASHBOARD ========
  return (
    <div className="min-h-screen bg-surface dark:bg-[#0a0a0b] transition-colors duration-300 pb-16">
      <div className="section-wrap pt-6">
        
        {/* Page title */}
        <div className="mb-6 text-left">
          <h1 className="font-display text-[26px] font-black text-on-surface dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-[14px] text-outline/80 dark:text-white/50">
            Welcome back. Monitor your daily streak limits and verbal targets.
          </p>
        </div>

        {/* 1. MISSION CONTROL HERO BLOCK */}
        <div className="relative overflow-hidden rounded-[24px] border border-primary/20 bg-gradient-to-br from-primary via-primary/95 to-secondary/90 p-6 text-on-primary shadow-xl dark:border-white/[0.04] dark:from-[#1e1e24] dark:via-[#131316] dark:to-[#0f0f12] mb-6">
          <div className="absolute inset-0 bg-black/[0.02] mix-blend-overlay" />
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/[0.03] blur-[40px]" />
          
          <div className="relative z-10 grid gap-6 md:grid-cols-12 md:items-center">
            
            {/* Level / Badge layout */}
            <div className="md:col-span-7 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 dark:bg-white/[0.03] border border-white/20 text-[20px]"
                >
                  {currentTier.badgeEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[18px] font-black tracking-tight text-white">
                      Level {currentLevel}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white dark:bg-[#60a5fa]/10 dark:text-[#60a5fa] border border-white/10 dark:border-[#60a5fa]/10">
                      {currentTier.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70 dark:text-white/40 mt-0.5">
                    Acumen Badge: <span className="font-bold text-white dark:text-[#fbbf24]">{currentTier.hindiName}</span>
                  </p>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="space-y-1.5">
                <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden p-0.5 dark:bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-secondary to-[#fbbf24] dark:from-[#60a5fa] dark:to-[#34d399] transition-all duration-700"
                    style={{ width: `${p.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-white/80 dark:text-white/40">
                  <span>{userXP} Total XP</span>
                  <span>{p.remaining} XP to Level {nextLevel} ({Math.round(p.percentage)}%)</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="md:col-span-5 flex flex-col items-stretch gap-3 md:justify-end md:items-end">
              <button
                onClick={() => router.push("/learn")}
                className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[13px] font-black text-primary shadow-lg shadow-black/5 hover:scale-[1.01] active:scale-[0.98] dark:bg-[#60a5fa] dark:text-[#0c1929] transition-all"
              >
                <Play size={13} className="fill-current" />
                Continue Pathway
              </button>
              <div className="text-right text-[11px] font-medium text-white/70 dark:text-white/40 px-1">
                Rolling daily XP cap: <span className="font-bold text-white">Soft-capped beyond 300 XP</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. STATS GRID WITH COLORED BORDERS & GLOWS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Day Streak */}
          <div className="card-surface p-5 border border-orange-500/15 bg-gradient-to-br from-[#fffdf8] to-orange-500/[0.01] dark:from-[#0a0a0b] dark:to-orange-500/[0.01] text-left hover:border-orange-500/30 transition-all">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 mb-3.5">
              <Flame size={18} className="fill-current" />
            </div>
            <p className="font-display text-[26px] font-black text-on-surface dark:text-white leading-none">
              {streak}
            </p>
            <p className="text-[12.5px] font-bold text-outline mt-1.5">Streak Days</p>
          </div>

          {/* Mastered */}
          <div className="card-surface p-5 border border-indigo-500/15 bg-gradient-to-br from-[#fffdf8] to-indigo-500/[0.01] dark:from-[#0a0a0b] dark:to-indigo-500/[0.01] text-left hover:border-indigo-500/30 transition-all">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-[#60a5fa] mb-3.5">
              <Award size={18} />
            </div>
            <p className="font-display text-[26px] font-black text-on-surface dark:text-white leading-none">
              {totalLearned}
            </p>
            <p className="text-[12.5px] font-bold text-outline mt-1.5">Mastered Cards</p>
          </div>

          {/* Accuracy */}
          <div className="card-surface p-5 border border-emerald-500/15 bg-gradient-to-br from-[#fffdf8] to-emerald-500/[0.01] dark:from-[#0a0a0b] dark:to-emerald-500/[0.01] text-left hover:border-emerald-500/30 transition-all">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-[#34d399] mb-3.5">
              <TrendingUp size={18} />
            </div>
            <p className="font-display text-[26px] font-black text-on-surface dark:text-white leading-none">
              {accuracy}%
            </p>
            <p className="text-[12.5px] font-bold text-outline mt-1.5">Test Accuracy</p>
          </div>

          {/* Vault */}
          <div className="card-surface p-5 border border-amber-500/15 bg-gradient-to-br from-[#fffdf8] to-amber-500/[0.01] dark:from-[#0a0a0b] dark:to-amber-500/[0.01] text-left hover:border-amber-500/30 transition-all">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-[#fbbf24] mb-3.5">
              <Star size={18} className="fill-current" />
            </div>
            <p className="font-display text-[26px] font-black text-on-surface dark:text-white leading-none">
              {totalVaulted}
            </p>
            <p className="text-[12.5px] font-bold text-outline mt-1.5">Vault Cards</p>
          </div>

        </div>

        {/* 3. TWO COLUMN INTERACTIVE SECTION */}
        <div className="grid gap-6 lg:grid-cols-12 mb-6">
          
          {/* Airbnb Streak Calendar Heatmap (Left, col-span-7) */}
          <div className="lg:col-span-7 card-surface p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-[15.5px] font-bold text-on-surface dark:text-white">
                    Streak Consistency
                  </h2>
                  <p className="text-[12px] text-outline">
                    Keep your learning calendar lit
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-[12.5px] font-bold text-on-surface min-w-[110px] text-center dark:text-white">
                    {calendarDate.toLocaleString("default", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface transition-colors cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Grid cell matrix */}
              <div className="grid grid-cols-7 gap-y-2.5 gap-x-1.5 text-center mb-6">
                {/* Weekdays */}
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <span key={day} className="text-[11px] font-bold text-outline/60 dark:text-white/35 py-1">
                    {day}
                  </span>
                ))}

                {/* Days */}
                {calendarCells.map((cell, idx) => {
                  const dateStr = cell.date.toDateString();
                  const hasActivity = activityDates.has(dateStr);
                  const isToday = dateStr === new Date().toDateString();
                  
                  return (
                    <div key={idx} className="flex justify-center items-center">
                      <div
                        className={`relative flex items-center justify-center text-[12.5px] font-extrabold w-8 h-8 rounded-full transition-all ${
                          hasActivity
                            ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-sm font-black"
                            : cell.isCurrentMonth
                            ? "text-on-surface hover:bg-surface-container cursor-pointer dark:text-white"
                            : "text-outline/25 dark:text-white/10"
                        } ${isToday && !hasActivity ? "border-2 border-primary dark:border-[#60a5fa]" : ""}`}
                        title={cell.date.toLocaleDateString()}
                      >
                        {cell.day}
                        {hasActivity && (
                          <span className="absolute -bottom-0.5 text-[6.5px]">🔥</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calendar Legend footer */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 border-t border-outline-variant/10 dark:border-white/[0.03] text-[11px] font-bold text-outline">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-[5px]">🔥</div>
                <span>Active Day</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full border border-primary dark:border-[#60a5fa]" />
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto text-red-500">
                <Flame size={12} className="fill-current" />
                <span>{streak} Day Flame</span>
              </div>
            </div>
          </div>

          {/* Folder Progress Lists (Right, col-span-5) */}
          <div className="lg:col-span-5 card-surface p-6 text-left flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-[15.5px] font-bold text-on-surface dark:text-white">
                  Pathway Standings
                </h2>
                <p className="text-[12px] text-outline">
                  Completion stats per category
                </p>
              </div>

              <div className="space-y-4.5">
                {FOLDERS.map((folder) => {
                  const stats = folderStats[folder.id];
                  const Icon = folder.icon;
                  if (!stats) return null;

                  const learnedPct = (stats.mastered / folder.totalCount) * 100;
                  const vaultedPct = (stats.vaulted / folder.totalCount) * 100;
                  const remainingPct = 100 - learnedPct - vaultedPct;

                  // Folder specific bar colors matching emotional palettes
                  const colorThemes = {
                    primary: {
                      badge: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-[#60a5fa]",
                      bar: "bg-indigo-500 dark:bg-[#60a5fa]",
                    },
                    secondary: {
                      badge: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-[#34d399]",
                      bar: "bg-emerald-500 dark:bg-[#34d399]",
                    },
                    tertiary: {
                      badge: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-[#fbbf24]",
                      bar: "bg-amber-500 dark:bg-[#fbbf24]",
                    },
                  }[folder.color as "primary" | "secondary" | "tertiary"];

                  return (
                    <div key={folder.id} className="space-y-2">
                      <div className="flex items-center justify-between text-[13px]">
                        <div className="flex items-center gap-2 font-bold text-on-surface dark:text-white">
                          <span className={`p-1 rounded-lg ${colorThemes.badge}`}>
                            <Icon size={13} />
                          </span>
                          <span>{folder.name}</span>
                        </div>
                        <span className="text-[11px] font-bold text-outline/80">
                          {stats.mastered} / {folder.totalCount}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden flex dark:bg-white/[0.03]">
                        <div
                          className={`${colorThemes.bar} h-full transition-all`}
                          style={{ width: `${learnedPct}%` }}
                        />
                        <div
                          className="bg-[#fbbf24] h-full transition-all"
                          style={{ width: `${vaultedPct}%` }}
                        />
                        <div
                          className="bg-outline-variant/30 dark:bg-white/[0.04] h-full transition-all"
                          style={{ width: `${remainingPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/10 dark:border-white/[0.03] flex items-center justify-between text-[11px] font-bold text-outline">
              <span>Synonyms coming soon</span>
              <span>100% Secure Audited</span>
            </div>
          </div>

        </div>

        {/* 4. MASTERED CATEGORIES CHECKLISTS */}
        <div className="card-surface p-6 text-left">
          <div className="mb-4">
            <h2 className="font-display text-[15.5px] font-bold text-on-surface dark:text-white">
              Mastery Folders
            </h2>
            <p className="text-[12px] text-outline">
              Review items marked as &ldquo;I Know&rdquo; to secure vocabulary
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {FOLDERS.map((folder) => {
              const stats = folderStats[folder.id];
              const Icon = folder.icon;

              const badgeColors = {
                primary: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-[#60a5fa]",
                secondary: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-[#34d399]",
                tertiary: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-[#fbbf24]",
              }[folder.color as "primary" | "secondary" | "tertiary"];

              return (
                <button
                  key={folder.id}
                  onClick={() => handleIkFolderClick(folder)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-outline-variant/20 hover:bg-surface-container-low dark:border-white/[0.04] dark:hover:bg-white/[0.02] transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-2.5 rounded-xl ${badgeColors}`}>
                      <Icon size={16} />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-bold text-on-surface dark:text-white">
                        {folder.name}
                      </p>
                      <p className="text-[11px] font-bold text-outline/80">
                        {stats?.mastered ?? 0} Mastered
                      </p>
                    </div>
                  </div>
                  <CheckCircle size={15} className="text-secondary dark:text-[#34d399] shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
