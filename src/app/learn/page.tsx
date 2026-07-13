"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useUser } from "@/lib/auth-context";
import { FOLDERS } from "@/lib/folders";
import {
  useFolderStats,
  useFolderSettings,
  useUpdateFolderSettings,
  loadLocalSessionCounts,
  saveLocalSessionCounts,
} from "@/lib/queries";
import { ArrowLeft, Play, Sparkles, Plus, Minus, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LearnPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const { data: folderStats = {} } = useFolderStats(user?.id);
  const { data: dbSettings = {} } = useFolderSettings(user?.id);
  const updateSettings = useUpdateFolderSettings(user?.id);

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
  const recommendation = (() => {
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
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center dark:bg-[#0a0a0b]">
        <div className="text-[13px] font-bold text-outline animate-pulse">Loading Learn Hub...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0a0a0b] transition-colors duration-300">
      <div className="section-wrap pt-6 pb-16">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/progress"
            className="flex items-center gap-1.5 text-[12.5px] font-bold text-outline hover:text-on-surface transition-colors"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="font-display text-[26px] font-black text-on-surface dark:text-white tracking-tight">
            Learning Paths
          </h1>
          <p className="text-[14px] text-outline/80 dark:text-white/50">
            Select a pathway to expand your verbal inventory.
          </p>
        </div>

        {/* Dynamic Study Recommendation Banner */}
        {recommendation && (
          <div className="mb-8 p-5 rounded-[22px] border border-primary/20 bg-primary/[0.04] dark:border-[#60a5fa]/20 dark:bg-[#60a5fa]/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-[#60a5fa]/10 dark:text-[#60a5fa]">
                <Sparkles size={16} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[13.5px] font-bold text-on-surface dark:text-white leading-normal">
                  Today&apos;s Study Pick
                </h4>
                <p className="text-[12px] text-outline dark:text-white/60">
                  Focus on <strong className="text-primary dark:text-[#60a5fa]">{recommendation.name}</strong> to balance your vocabulary velocity today.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/learn/${recommendation.id}`)}
              className="h-9 px-4 rounded-xl bg-primary text-[12.5px] font-bold text-on-primary flex items-center gap-1.5 hover:opacity-95 active:scale-[0.98] dark:bg-[#60a5fa] dark:text-[#0c1929] transition-all"
            >
              <Play size={11} className="fill-current" />
              Study Now
            </button>
          </div>
        )}

        {/* Pathway cards */}
        <div className="space-y-5">
          {FOLDERS.map((folder) => {
            const Icon = folder.icon;
            const count = sessionCounts[folder.id] ?? 10;
            const stats = folderStats[folder.id];
            
            const total = folder.totalCount;
            const mastered = stats?.mastered || 0;
            const vaulted = stats?.vaulted || 0;
            const remaining = stats ? stats.remaining : total;

            const daysToCover = remaining > 0 ? Math.ceil(remaining / count) : 0;
            const masteredPct = (mastered / total) * 100;
            const vaultedPct = (vaulted / total) * 100;
            const remainingPct = 100 - masteredPct - vaultedPct;

            // Strict visual system matching color identities:
            // Vocabulary (Words): Blue, Homonyms: Emerald, Idioms: Amber
            const colorThemes = {
              primary: {
                border: "border-indigo-500/10 hover:border-indigo-500/30 dark:border-white/[0.04] dark:hover:border-indigo-500/30",
                badgeBg: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-[#60a5fa]",
                badgeColor: "text-indigo-600 dark:text-[#60a5fa]",
                barMastered: "bg-indigo-500 dark:bg-[#60a5fa]",
                barVaulted: "bg-[#fbbf24]",
                difficulty: "Basic & Advanced",
              },
              secondary: {
                border: "border-emerald-500/10 hover:border-emerald-500/30 dark:border-white/[0.04] dark:hover:border-emerald-500/30",
                badgeBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-[#34d399]",
                badgeColor: "text-emerald-600 dark:text-[#34d399]",
                barMastered: "bg-emerald-500 dark:bg-[#34d399]",
                barVaulted: "bg-[#fbbf24]",
                difficulty: "Precision Pairs",
              },
              tertiary: {
                border: "border-amber-500/10 hover:border-amber-500/30 dark:border-white/[0.04] dark:hover:border-amber-500/30",
                badgeBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-[#fbbf24]",
                badgeColor: "text-amber-600 dark:text-[#fbbf24]",
                barMastered: "bg-amber-500 dark:bg-[#fbbf24]",
                barVaulted: "bg-indigo-500 dark:bg-[#60a5fa]",
                difficulty: "Cultural Idioms",
              },
            }[folder.color as "primary" | "secondary" | "tertiary"];

            const isDone = remaining === 0;

            return (
              <div
                key={folder.id}
                className={`card-surface p-6 border transition-all duration-200 ${colorThemes.border} flex flex-col justify-between`}
              >
                {/* Header Row */}
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colorThemes.badgeBg}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-display text-[17px] font-bold text-on-surface dark:text-white truncate">
                        {folder.name}
                      </h3>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-transparent ${colorThemes.badgeBg}`}>
                        {colorThemes.difficulty}
                      </span>
                    </div>
                    <p className="text-[13px] text-outline/80 dark:text-white/50 mb-4">
                      {folder.description}
                    </p>

                    {/* Progress Bar Group */}
                    <div className="space-y-1.5">
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden flex dark:bg-white/[0.03]">
                        <div
                          className={`${colorThemes.barMastered} h-full transition-all`}
                          style={{ width: `${masteredPct}%` }}
                        />
                        <div
                          className={`${colorThemes.barVaulted} h-full transition-all`}
                          style={{ width: `${vaultedPct}%` }}
                        />
                        <div
                          className="bg-outline-variant/35 dark:bg-white/[0.04] h-full transition-all"
                          style={{ width: `${remainingPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-outline/70 dark:text-white/40">
                        <span className={colorThemes.badgeColor}>{mastered} mastered</span>
                        <span className="text-[#b45309] dark:text-[#fbbf24]">{vaulted} vaulted</span>
                        <span>{remaining} remaining</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-outline-variant/10 pt-4 dark:border-white/[0.03] gap-4">
                  {/* Session size selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-bold text-outline">Session Cards:</span>
                    <div className="flex items-center rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-1 dark:border-white/[0.04] dark:bg-white/[0.01]">
                      <button
                        onClick={() => adjustSessionCount(folder.id, -5)}
                        disabled={count <= 5}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-outline hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Decrease session cards count"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-[13px] font-extrabold text-on-surface dark:text-white">
                        {count}
                      </span>
                      <button
                        onClick={() => adjustSessionCount(folder.id, 5)}
                        disabled={count >= 40}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-outline hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Increase session cards count"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4">
                    {daysToCover > 0 && (
                      <span className="text-[11px] font-semibold text-outline/80 dark:text-white/35 flex items-center gap-1">
                        <Info size={11} />
                        ~{daysToCover} sessions left
                      </span>
                    )}
                    <button
                      onClick={() => router.push(`/learn/${folder.id}`)}
                      disabled={isDone}
                      className="h-10 px-5 rounded-xl bg-primary text-[13px] font-bold text-on-primary hover:opacity-95 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 dark:bg-[#60a5fa] dark:text-[#0c1929]"
                    >
                      <Play size={12} className="fill-current" />
                      Start Study
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
