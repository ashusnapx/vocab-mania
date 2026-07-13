"use client";

import { useEffect } from "react";
import { useUser } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useFolderStats } from "@/lib/queries";
import { FOLDERS } from "@/lib/folders";
import { Brain, ArrowLeft, Loader2, Sparkles, Lock, Play } from "lucide-react";
import Link from "next/link";

export default function QuizPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const { data: folderStats = {} } = useFolderStats(user?.id);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center dark:bg-[#0a0a0b]">
        <div className="text-[13px] font-bold text-outline animate-pulse">Loading Quiz Hub...</div>
      </div>
    );
  }

  if (!user) {
    return null;
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
            Quiz Challenges
          </h1>
          <p className="text-[14px] text-outline/80 dark:text-white/50">
            Select a study route to test your verbal retention.
          </p>
        </div>

        {/* Pathway cards */}
        <div className="space-y-5">
          {FOLDERS.map((folder) => {
            const Icon = folder.icon;
            const stats = folderStats[folder.id];
            const learned = stats?.mastered ?? 0;
            const isStaticFolder = folder.id === "homonyms" || folder.id === "idioms";
            const ready = isStaticFolder || learned >= 3;

            // Strict visual system matching color identities:
            // Vocabulary (Words): Blue, Homonyms: Emerald, Idioms: Amber
            const colorThemes = {
              primary: {
                border: "border-indigo-500/10 hover:border-indigo-500/30 dark:border-white/[0.04] dark:hover:border-indigo-500/30",
                badgeBg: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-[#60a5fa]",
                badgeColor: "text-indigo-600 dark:text-[#60a5fa]",
                btnBg: "bg-indigo-500 hover:bg-indigo-600 dark:bg-[#60a5fa] dark:text-[#0c1929]",
                difficulty: "Practice Test",
              },
              secondary: {
                border: "border-emerald-500/10 hover:border-emerald-500/30 dark:border-white/[0.04] dark:hover:border-emerald-500/30",
                badgeBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-[#34d399]",
                badgeColor: "text-emerald-600 dark:text-[#34d399]",
                btnBg: "bg-emerald-500 hover:bg-emerald-600 dark:bg-[#34d399] dark:text-[#022c22]",
                difficulty: "Precision Quiz",
              },
              tertiary: {
                border: "border-amber-500/10 hover:border-amber-500/30 dark:border-white/[0.04] dark:hover:border-amber-500/30",
                badgeBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-[#fbbf24]",
                badgeColor: "text-amber-600 dark:text-[#fbbf24]",
                btnBg: "bg-amber-500 hover:bg-amber-600 dark:bg-[#fbbf24] dark:text-[#451a03]",
                difficulty: "Expressions Test",
              },
            }[folder.color as "primary" | "secondary" | "tertiary"];

            return (
              <div
                key={folder.id}
                className={`card-surface p-6 border transition-all duration-200 ${colorThemes.border} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
                  !ready ? "opacity-60" : ""
                }`}
              >
                {/* Left Side Details */}
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colorThemes.badgeBg}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-[17px] font-bold text-on-surface dark:text-white">
                        {folder.name}
                      </h3>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-transparent ${colorThemes.badgeBg}`}>
                        {colorThemes.difficulty}
                      </span>
                    </div>
                    <p className="text-[13px] text-outline/80 dark:text-white/50 max-w-md">
                      {folder.description}
                    </p>
                    <div className="pt-1.5 flex flex-wrap gap-2">
                      {isStaticFolder ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary dark:text-[#34d399] bg-secondary/8 px-2 py-0.5 rounded-lg dark:bg-[#34d399]/10">
                          <Sparkles size={11} />
                          Full Database Unlocked ({folder.totalCount} items)
                        </span>
                      ) : ready ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary dark:text-[#34d399] bg-secondary/8 px-2 py-0.5 rounded-lg dark:bg-[#34d399]/10">
                          ✓ Ready ({learned} items learned)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-red-600 bg-red-500/10 px-2.5 py-1 rounded-xl dark:text-red-400 dark:bg-red-500/10 border border-red-500/20">
                          <Lock size={12} />
                          Locked (Need 3+ Mastered Words, currently {learned}/3)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side Play button */}
                <button
                  onClick={() => router.push(`/quiz/${folder.id}`)}
                  disabled={!ready}
                  className={`h-11 px-5 rounded-xl text-[13px] font-bold text-on-primary hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 w-full sm:w-auto justify-center ${colorThemes.btnBg}`}
                >
                  <Play size={12} className="fill-current" />
                  Begin Challenge
                </button>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
