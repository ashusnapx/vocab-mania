"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useUser } from "@/lib/auth-context";
import { FOLDERS } from "@/lib/folders";
import {
  useFolderStats,
  useFolderSettings,
  useUpdateFolderSettings,
  loadLocalSessionCounts,
  saveLocalSessionCounts,
} from "@/lib/queries";
import { ArrowLeft, Play, Sparkles, Plus, Minus, Info, ChevronRight, Newspaper, Calculator, Lightbulb, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LearnPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const { data: folderStats = {} } = useFolderStats(user?.id);
  const { data: dbSettings = {} } = useFolderSettings(user?.id);
  const updateSettings = useUpdateFolderSettings(user?.id);

  // Active Category view state
  const [activeCategory, setActiveCategory] = useState<"parent" | "vocab">("parent");

  // Session counts: localStorage first, then merge DB
  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>(
    loadLocalSessionCounts
  );

  // Merge DB settings into session counts
  const dbSettingsApplied = useRef(false);
  useEffect(() => {
    if (!dbSettingsApplied.current && Object.keys(dbSettings).length > 0) {
      dbSettingsApplied.current = true;
      setSessionCounts((prev) => {
        const merged = { ...dbSettings, ...prev };
        saveLocalSessionCounts(merged);
        return merged;
      });
    }
  }, [dbSettings]);

  // Adjust session count (+ / -)
  const adjustSessionCount = useCallback(
    (folderId: string, delta: number) => {
      const currentVal = sessionCounts[folderId] ?? 10;
      const nextVal = Math.min(Math.max(5, currentVal + delta), 40);
      
      setSessionCounts((prev) => {
        const next = { ...prev, [folderId]: nextVal };
        saveLocalSessionCounts(next);
        return next;
      });

      if (user) {
        const merged = { ...dbSettings, ...sessionCounts, [folderId]: nextVal };
        updateSettings.mutate(merged);
      }
    },
    [user, dbSettings, sessionCounts, updateSettings]
  );

  // ============ RECOMMENDATION LOGIC ============
  const recommendation = useMemo(() => {
    if (Object.keys(folderStats).length === 0) return FOLDERS[0];
    
    // Pick the folder with lowest mastered % that is not completed yet
    let best = FOLDERS[0];
    let minPct = 101;

    for (const folder of FOLDERS) {
      const stats = folderStats[folder.id];
      if (stats && stats.remaining > 0) {
        const pct = (stats.mastered / folder.totalCount) * 100;
        if (pct < minPct) {
          minPct = pct;
          best = folder;
        }
      }
    }
    return best;
  }, [folderStats]);

  // Compute Vocabulary aggregate stats
  const vocabAggregates = useMemo(() => {
    const vocabIds = ["words", "homonyms", "idioms"];
    let total = 0;
    let mastered = 0;
    let vaulted = 0;

    vocabIds.forEach((id) => {
      const f = FOLDERS.find((x) => x.id === id);
      const s = folderStats[id];
      if (f) {
        total += f.totalCount;
        mastered += s?.mastered || 0;
      }
    });

    const remaining = Math.max(0, total - mastered - vaulted);
    const masteredPct = total > 0 ? (mastered / total) * 100 : 0;
    const vaultedPct = total > 0 ? (vaulted / total) * 100 : 0;
    const remainingPct = 100 - masteredPct - vaultedPct;

    return { total, mastered, vaulted, remaining, masteredPct, vaultedPct, remainingPct };
  }, [folderStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center dark:bg-[#0a0a0b]">
        <div className="text-[13px] font-bold text-outline animate-pulse">Loading Learn Hub...</div>
      </div>
    );
  }

  // Visual header gradients
  const getBannerGradient = (id: string) => {
    return {
      vocabulary: "from-indigo-500 via-blue-500 to-indigo-600",
      current_affairs: "from-emerald-500 via-teal-500 to-emerald-600",
      formula_factory: "from-amber-500 via-orange-500 to-amber-600",
      fun_facts: "from-purple-500 via-fuchsia-500 to-purple-600",
      words: "from-sky-400 via-blue-500 to-indigo-500",
      homonyms: "from-emerald-400 via-teal-500 to-emerald-600",
      idioms: "from-amber-400 via-orange-500 to-amber-600",
    }[id] || "from-neutral-400 to-neutral-600";
  };

  const getThemeMap = (color: string) => {
    return {
      primary: {
        badgeColor: "text-indigo-600 dark:text-[#60a5fa]",
        barMastered: "bg-indigo-500 dark:bg-[#60a5fa]",
        barVaulted: "bg-[#fbbf24]",
        difficulty: "Precision Pairs",
      },
      secondary: {
        badgeColor: "text-emerald-600 dark:text-[#34d399]",
        barMastered: "bg-emerald-500 dark:bg-[#34d399]",
        barVaulted: "bg-[#fbbf24]",
        difficulty: "Basic & Advanced",
      },
      tertiary: {
        badgeColor: "text-amber-600 dark:text-[#fbbf24]",
        barMastered: "bg-amber-500 dark:bg-[#fbbf24]",
        barVaulted: "bg-indigo-500 dark:bg-[#60a5fa]",
        difficulty: "Cultural Idioms",
      },
      purple: {
        badgeColor: "text-purple-600 dark:text-[#c084fc]",
        barMastered: "bg-purple-500 dark:bg-[#c084fc]",
        barVaulted: "bg-indigo-500 dark:bg-[#60a5fa]",
        difficulty: "Anomalies & Trivia",
      }
    }[color] || {
      badgeColor: "text-neutral-600",
      barMastered: "bg-neutral-600",
      barVaulted: "bg-neutral-400",
      difficulty: "Basic",
    };
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0a0a0b] transition-colors duration-300">
      <div className="section-wrap pt-6 pb-16">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between mb-6">
          {activeCategory === "parent" ? (
            <Link
              href="/progress"
              className="flex items-center gap-1.5 text-[12.5px] font-bold text-outline hover:text-on-surface transition-colors"
            >
              <ArrowLeft size={14} />
              Dashboard
            </Link>
          ) : (
            <button
              onClick={() => setActiveCategory("parent")}
              className="flex items-center gap-1.5 text-[12.5px] font-bold text-outline hover:text-on-surface transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              Main Categories
            </button>
          )}
        </div>

        {/* Title */}
        <div className="mb-8 text-left">
          <h1 className="font-display text-[26px] font-black text-on-surface dark:text-white tracking-tight">
            {activeCategory === "parent" ? "Learning pathways" : "Vocabulary Library"}
          </h1>
          <p className="text-[14px] text-outline/80 dark:text-white/50">
            {activeCategory === "parent" 
              ? "Select a menu section to start your study loop."
              : "Review definitions, idioms, and homonyms using our MCQ system."}
          </p>
        </div>

        {/* Dynamic Study Recommendation Banner */}
        {activeCategory === "parent" && recommendation && (
          <div className="mb-8 p-5 rounded-[22px] border border-primary/20 bg-primary/[0.04] dark:border-[#60a5fa]/20 dark:bg-[#60a5fa]/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-[#60a5fa]/10 dark:text-[#60a5fa]">
                <Sparkles size={16} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[13.5px] font-bold text-on-surface dark:text-white leading-normal">
                  Recommended For You
                </h4>
                <p className="text-[12px] text-outline dark:text-white/60">
                  Focus on <strong className="text-primary dark:text-[#60a5fa]">{recommendation.name}</strong> to balance your progression velocity today.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/learn/${recommendation.id}`)}
              className="h-9 px-4 rounded-xl bg-primary text-[12.5px] font-bold text-on-primary flex items-center gap-1.5 hover:opacity-95 active:scale-[0.98] dark:bg-[#60a5fa] dark:text-[#0c1929] transition-all cursor-pointer shrink-0"
            >
              <Play size={11} className="fill-current" />
              Study Now
            </button>
          </div>
        )}

        {/* ============================================================
            PARENT CATEGORIES GRID (Swiggy/Zomato Grid Layout)
           ============================================================ */}
        {activeCategory === "parent" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* 1. VOCABULARY CARD */}
            <div 
              onClick={() => setActiveCategory("vocab")}
              className="relative flex flex-col justify-between rounded-[28px] border border-neutral-200/60 bg-white dark:border-white/[0.04] dark:bg-[#121215] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer text-left"
            >
              {/* Header Mesh gradient */}
              <div className={`h-28 w-full bg-gradient-to-tr ${getBannerGradient("vocabulary")} opacity-90`} />

              {/* Floating Glass Icon */}
              <div className="absolute top-16 left-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-[#1e1e24] shadow-[0_6px_20px_rgba(0,0,0,0.08)] text-indigo-600 dark:text-[#60a5fa] border border-neutral-100 dark:border-white/5 z-10 transition-transform group-hover:scale-105">
                <BookOpen size={22} className="stroke-[2.2]" />
              </div>

              {/* Body */}
              <div className="px-6 pt-9 pb-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-[18px] font-black text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-[#60a5fa] transition-colors mb-1">
                    Vocabulary Library
                  </h3>
                  <p className="text-[12.5px] text-outline/80 dark:text-white/50 leading-relaxed line-clamp-2 mb-4">
                    Master synonyms, antonyms, homonyms, and cultural expressions.
                  </p>

                  {/* Progress segment */}
                  <div className="space-y-1.5">
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-white/[0.03] rounded-full overflow-hidden flex">
                      <div
                        className="bg-indigo-500 dark:bg-[#60a5fa] h-full transition-all"
                        style={{ width: `${vocabAggregates.masteredPct}%` }}
                      />
                      <div
                        className="bg-[#fbbf24] h-full transition-all"
                        style={{ width: `${vocabAggregates.vaultedPct}%` }}
                      />
                      <div
                        className="bg-neutral-200 dark:bg-white/[0.05] h-full transition-all"
                        style={{ width: `${vocabAggregates.remainingPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-outline/50 dark:text-white/40">
                      <span>{vocabAggregates.mastered} mastered</span>
                      <span>{vocabAggregates.remaining} remaining</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Card Chevron */}
                <div className="border-t border-neutral-100 dark:border-white/[0.03] pt-4 mt-5 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-outline/40">
                    3 pathways inside
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-primary dark:text-[#60a5fa] group-hover:translate-x-0.5 transition-transform">
                    Explore Options
                    <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            </div>

            {/* 2. DIRECT PATHWAYS */}
            {FOLDERS.filter(f => ["current_affairs", "formula_factory", "fun_facts"].includes(f.id)).map((folder) => {
              const Icon = folder.icon;
              const stats = folderStats[folder.id];
              const total = folder.totalCount;

              const mastered = stats?.mastered || 0;
              const vaulted = stats?.vaulted || 0;
              const remaining = stats ? stats.remaining : total;
              
              const masteredPct = (mastered / total) * 100;
              const vaultedPct = (vaulted / total) * 100;
              const remainingPct = 100 - masteredPct - vaultedPct;

              // Theme configuration
              const colorKey = folder.id === "fun_facts" ? "purple" : (folder.id === "formula_factory" ? "tertiary" : "secondary");
              const themeMap = getThemeMap(colorKey);

              return (
                <div
                  key={folder.id}
                  onClick={() => remaining > 0 && router.push(`/learn/${folder.id}`)}
                  className={`relative flex flex-col justify-between rounded-[28px] border border-neutral-200/60 bg-white dark:border-white/[0.04] dark:bg-[#121215] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group text-left ${
                    remaining > 0 ? "hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 cursor-pointer" : "opacity-90"
                  }`}
                >
                  {/* Top mesh banner */}
                  <div className={`h-28 w-full bg-gradient-to-tr ${getBannerGradient(folder.id)} opacity-90`} />

                  {/* Floating Glass Icon */}
                  <div className="absolute top-16 left-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-[#1e1e24] shadow-[0_6px_20px_rgba(0,0,0,0.08)] text-neutral-600 dark:text-white border border-neutral-100 dark:border-white/5 z-10 transition-transform group-hover:scale-105">
                    <Icon size={22} className="stroke-[2.2]" />
                  </div>

                  {/* Body */}
                  <div className="px-6 pt-9 pb-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-[18px] font-black text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-[#60a5fa] transition-colors mb-1">
                        {folder.name}
                      </h3>
                      <p className="text-[12.5px] text-outline/80 dark:text-white/50 leading-relaxed line-clamp-2 mb-4">
                        {folder.description}
                      </p>

                      {/* Progress segment */}
                      <div className="space-y-1.5">
                        <div className="w-full h-1.5 bg-neutral-100 dark:bg-white/[0.03] rounded-full overflow-hidden flex">
                          <div
                            className={`${themeMap.barMastered} h-full transition-all`}
                            style={{ width: `${masteredPct}%` }}
                          />
                          <div
                            className={`${themeMap.barVaulted} h-full transition-all`}
                            style={{ width: `${vaultedPct}%` }}
                          />
                          <div
                            className="bg-neutral-200 dark:bg-white/[0.05] h-full transition-all"
                            style={{ width: `${remainingPct}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-outline/50 dark:text-white/40">
                          <span className={themeMap.badgeColor}>{mastered} mastered</span>
                          <span>{remaining} left</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Action Card */}
                    <div className="border-t border-neutral-100 dark:border-white/[0.03] pt-4 mt-5 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-outline/40">
                        {themeMap.difficulty}
                      </span>
                      <button
                        disabled={remaining === 0}
                        className="h-8 px-3.5 rounded-xl bg-primary text-[11px] font-bold text-on-primary hover:opacity-95 active:scale-[0.98] disabled:opacity-40 transition-all flex items-center gap-1 dark:bg-[#60a5fa] dark:text-[#0c1929] cursor-pointer"
                      >
                        <Play size={9} className="fill-current animate-pulse" />
                        Study
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        )}

        {/* ============================================================
            VOCABULARY NESTED SUBFOLDERS GRID (Slide-in subpaths)
           ============================================================ */}
        {activeCategory === "vocab" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FOLDERS.filter(f => ["words", "homonyms", "idioms"].includes(f.id)).map((folder) => {
              const Icon = folder.icon;
              const count = sessionCounts[folder.id] ?? 10;
              const stats = folderStats[folder.id];
              const total = folder.totalCount;

              const mastered = stats?.mastered || 0;
              const vaulted = stats?.vaulted || 0;
              const remaining = stats ? stats.remaining : total;
              
              const masteredPct = (mastered / total) * 100;
              const vaultedPct = (vaulted / total) * 100;
              const remainingPct = 100 - masteredPct - vaultedPct;

              // Theme configuration
              const colorKey = folder.id === "words" ? "secondary" : (folder.id === "homonyms" ? "primary" : "tertiary");
              const themeMap = getThemeMap(colorKey);

              return (
                <div
                  key={folder.id}
                  className="relative flex flex-col justify-between rounded-[28px] border border-neutral-200/60 bg-white dark:border-white/[0.04] dark:bg-[#121215] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 group text-left"
                >
                  {/* Top mesh banner */}
                  <div className={`h-28 w-full bg-gradient-to-tr ${getBannerGradient(folder.id)} opacity-90`} />

                  {/* Floating Glass Icon */}
                  <div className="absolute top-16 left-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-[#1e1e24] shadow-[0_6px_20px_rgba(0,0,0,0.08)] text-neutral-600 dark:text-white border border-neutral-100 dark:border-white/5 z-10 transition-transform group-hover:scale-105">
                    <Icon size={22} className="stroke-[2.2]" />
                  </div>

                  {/* Body */}
                  <div className="px-6 pt-9 pb-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-[18px] font-black text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-[#60a5fa] transition-colors mb-1">
                        {folder.name}
                      </h3>
                      <p className="text-[12.5px] text-outline/80 dark:text-white/50 leading-relaxed line-clamp-2 mb-4">
                        {folder.description}
                      </p>

                      {/* Progress segment */}
                      <div className="space-y-1.5 mb-5">
                        <div className="w-full h-1.5 bg-neutral-100 dark:bg-white/[0.03] rounded-full overflow-hidden flex">
                          <div
                            className={`${themeMap.barMastered} h-full transition-all`}
                            style={{ width: `${masteredPct}%` }}
                          />
                          <div
                            className={`${themeMap.barVaulted} h-full transition-all`}
                            style={{ width: `${vaultedPct}%` }}
                          />
                          <div
                            className="bg-neutral-200 dark:bg-white/[0.05] h-full transition-all"
                            style={{ width: `${remainingPct}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-outline/50 dark:text-white/40">
                          <span className={themeMap.badgeColor}>{mastered} mastered</span>
                          <span>{remaining} left</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions and Card selectors footer */}
                    <div className="border-t border-neutral-100 dark:border-white/[0.03] pt-4 mt-3 flex flex-col gap-3.5">
                      
                      {/* Count Adjuster segment */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11.5px] font-bold text-outline">Session Cards:</span>
                        <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 p-0.5 dark:border-white/[0.04] dark:bg-white/[0.01]">
                          <button
                            onClick={() => adjustSessionCount(folder.id, -5)}
                            disabled={count <= 5}
                            className="flex h-6 w-6 items-center justify-center rounded-lg text-outline hover:bg-neutral-100 hover:text-on-surface dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            aria-label="Decrease session cards count"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-6 text-center text-[12px] font-extrabold text-on-surface dark:text-white">
                            {count}
                          </span>
                          <button
                            onClick={() => adjustSessionCount(folder.id, 5)}
                            disabled={count >= 40}
                            className="flex h-6 w-6 items-center justify-center rounded-lg text-outline hover:bg-neutral-100 hover:text-on-surface dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            aria-label="Increase session cards count"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>

                      {/* Start button */}
                      <button
                        onClick={() => router.push(`/learn/${folder.id}`)}
                        disabled={remaining === 0}
                        className="w-full h-9 rounded-xl bg-primary text-[12px] font-bold text-on-primary hover:opacity-95 active:scale-[0.98] disabled:opacity-40 transition-all flex items-center justify-center gap-1.5 dark:bg-[#60a5fa] dark:text-[#0c1929] cursor-pointer"
                      >
                        <Play size={10} className="fill-current" />
                        Start Study
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
