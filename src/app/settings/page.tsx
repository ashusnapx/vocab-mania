"use client";

import { useState } from "react";
import { useUser } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useProfile,
  useUpdateProfile,
  useClearAllData,
  useExportData,
} from "@/lib/queries";
import {
  ArrowLeft,
  LogOut,
  Target,
  Moon,
  Sun,
  Download,
  Trash2,
  ChevronRight,
  Check,
  Shield,
  BookOpen,
  Flame,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const GOALS = [5, 10, 15, 20, 25, 30];

export default function SettingsPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const updateProfile = useUpdateProfile(user?.id);
  const clearAllData = useClearAllData(user?.id);
  const exportData = useExportData(user?.id);

  const [dailyGoal, setDailyGoal] = useState(10);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  // Sync daily goal from profile
  const profileGoal = profile?.daily_goal;
  const currentGoal = profileGoal ?? dailyGoal;

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

  const showSaved = (field: string) => {
    setSaved(field);
    setTimeout(() => setSaved(null), 1500);
  };

  const handleGoalChange = (goal: number) => {
    setDailyGoal(goal);
    updateProfile.mutate({ daily_goal: goal });
    showSaved("goal");
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    showSaved("theme");
  };

  const handleExport = async () => {
    const data = await exportData.mutateAsync();
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vocab-mania-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSaved("export");
  };

  const handleClearProgress = () => {
    clearAllData.mutate(undefined, {
      onSuccess: () => {
        setShowClearConfirm(false);
        showSaved("clear");
      },
    });
  };

  const handleDeleteAccount = async () => {
    await clearAllData.mutateAsync();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-surface">
      <div className="section-wrap py-8 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/progress"
            className="flex items-center gap-1.5 text-[13px] text-outline hover:text-on-surface transition-colors"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <span className="text-[14px] font-medium text-on-surface">Settings</span>
        </div>

        {/* ============ PROFILE ============ */}
        <div className="card-surface overflow-hidden mb-6">
          <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-tertiary" />
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="font-display text-[24px] font-semibold text-primary">
                      {(profile?.full_name || profile?.email || "U")[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-secondary flex items-center justify-center ring-2 ring-surface">
                  <Check size={10} className="text-on-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-[18px] font-semibold text-on-surface truncate">
                  {profile?.full_name || "User"}
                </h2>
                <p className="text-[13px] text-outline truncate">{profile?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                    <Shield size={10} />
                    {profile?.auth_provider === "google" ? "Google" : "Email"}
                  </span>
                  <span className="text-[11px] text-outline">
                    Member since {memberSince}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-outline-variant/30">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Flame size={12} className="text-red-500" />
                  <span className="font-display text-[16px] font-bold text-on-surface">
                    {profile?.current_streak || 0}
                  </span>
                </div>
                <p className="text-[11px] text-outline">Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Flame size={12} className="text-tertiary" />
                  <span className="font-display text-[16px] font-bold text-on-surface">
                    {profile?.longest_streak || 0}
                  </span>
                </div>
                <p className="text-[11px] text-outline">Best</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Target size={12} className="text-primary" />
                  <span className="font-display text-[16px] font-bold text-on-surface">
                    {currentGoal}
                  </span>
                </div>
                <p className="text-[11px] text-outline">Goal/day</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============ LEARNING ============ */}
        <div className="mb-6">
          <h3 className="text-[12px] font-medium text-outline uppercase tracking-wider mb-3 px-1">
            Learning
          </h3>
          <div className="card-surface divide-y divide-outline-variant/20">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Target size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-on-surface">Daily Goal</p>
                    <p className="text-[12px] text-outline">Words to learn each day</p>
                  </div>
                </div>
                {saved === "goal" && (
                  <span className="text-[12px] text-secondary font-medium flex items-center gap-1">
                    <Check size={12} /> Saved
                  </span>
                )}
              </div>
              <div className="grid grid-cols-6 gap-2">
                {GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleGoalChange(goal)}
                    disabled={updateProfile.isPending}
                    className={`relative py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                      currentGoal === goal
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-hover text-outline hover:text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    {goal}
                    {currentGoal === goal && (
                      <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center ring-2 ring-surface">
                        <Check size={8} className="text-on-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[12px] text-outline mt-2.5">
                {currentGoal <= 5 && "~10 min/day — gentle start"}
                {currentGoal > 5 && currentGoal <= 10 && "~15 min/day — steady pace"}
                {currentGoal > 10 && currentGoal <= 20 && "~25 min/day — serious learner"}
                {currentGoal > 20 && "~35+ min/day — intensive"}
              </p>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                    <BookOpen size={14} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-on-surface">Session Length</p>
                    <p className="text-[12px] text-outline">Words per learning session</p>
                  </div>
                </div>
                <span className="text-[13px] text-outline bg-surface-hover px-3 py-1 rounded-lg">
                  {Math.min(currentGoal, 20)} words
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ APPEARANCE ============ */}
        <div className="mb-6">
          <h3 className="text-[12px] font-medium text-outline uppercase tracking-wider mb-3 px-1">
            Appearance
          </h3>
          <div className="card-surface">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tertiary/10">
                    {darkMode ? (
                      <Moon size={14} className="text-tertiary" />
                    ) : (
                      <Sun size={14} className="text-tertiary" />
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-on-surface">Dark Mode</p>
                    <p className="text-[12px] text-outline">Easier on the eyes at night</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${
                    darkMode ? "bg-primary" : "bg-outline-variant/50"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-on-primary shadow-sm transition-transform duration-200 ${
                      darkMode ? "translate-x-5.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {saved === "theme" && (
                <p className="text-[12px] text-secondary font-medium mt-2 flex items-center gap-1">
                  <Check size={12} /> Preference saved
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ============ DATA ============ */}
        <div className="mb-6">
          <h3 className="text-[12px] font-medium text-outline uppercase tracking-wider mb-3 px-1">
            Data
          </h3>
          <div className="card-surface divide-y divide-outline-variant/20">
            <button
              onClick={handleExport}
              disabled={exportData.isPending}
              className="w-full p-5 flex items-center justify-between hover:bg-surface-hover/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Download size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-on-surface">Export Progress</p>
                  <p className="text-[12px] text-outline">Download all your data as JSON</p>
                </div>
              </div>
              {exportData.isPending ? (
                <Loader2 size={16} className="text-outline animate-spin" />
              ) : saved === "export" ? (
                <span className="text-[12px] text-secondary font-medium flex items-center gap-1">
                  <Check size={12} /> Downloaded
                </span>
              ) : (
                <ChevronRight size={16} className="text-outline" />
              )}
            </button>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                    <Trash2 size={14} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-on-surface">Clear Progress</p>
                    <p className="text-[12px] text-outline">Reset all learning data</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-[13px] font-medium text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/5"
                >
                  Clear
                </button>
              </div>
              {showClearConfirm && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                  <p className="text-[13px] text-on-surface mb-3">
                    This will permanently delete all your progress, vault words, and session history. This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 h-9 rounded-lg border border-outline-variant/40 text-[13px] font-medium text-on-surface hover:bg-surface-hover transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearProgress}
                      disabled={clearAllData.isPending}
                      className="flex-1 h-9 rounded-lg bg-red-500 text-[13px] font-medium text-on-primary hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {clearAllData.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        "Yes, clear everything"
                      )}
                    </button>
                  </div>
                </div>
              )}
              {saved === "clear" && (
                <p className="text-[12px] text-secondary font-medium mt-2 flex items-center gap-1">
                  <Check size={12} /> Progress cleared
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ============ ACCOUNT ============ */}
        <div className="mb-6">
          <h3 className="text-[12px] font-medium text-outline uppercase tracking-wider mb-3 px-1">
            Account
          </h3>
          <div className="card-surface divide-y divide-outline-variant/20">
            <button
              onClick={handleSignOut}
              className="w-full p-5 flex items-center gap-2.5 hover:bg-surface-hover/50 transition-colors text-left"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-outline/10">
                <LogOut size={14} className="text-outline" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-on-surface">Sign Out</p>
                <p className="text-[12px] text-outline">Sign out of your account</p>
              </div>
            </button>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                    <Trash2 size={14} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-red-500">Delete Account</p>
                    <p className="text-[12px] text-outline">Permanently delete your account and data</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-[13px] font-medium text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/5"
                >
                  Delete
                </button>
              </div>
              {showDeleteConfirm && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                  <p className="text-[13px] text-on-surface mb-3">
                    This will permanently delete your account, all progress, vault words, and session history. This action cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 h-9 rounded-lg border border-outline-variant/40 text-[13px] font-medium text-on-surface hover:bg-surface-hover transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={clearAllData.isPending}
                      className="flex-1 h-9 rounded-lg bg-red-500 text-[13px] font-medium text-on-primary hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {clearAllData.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        "Yes, delete account"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============ ABOUT ============ */}
        <div className="mb-8">
          <h3 className="text-[12px] font-medium text-outline uppercase tracking-wider mb-3 px-1">
            About
          </h3>
          <div className="card-surface p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-[15px] font-bold text-on-primary">
                V
              </div>
              <div>
                <p className="font-display text-[15px] font-semibold text-on-surface">
                  Vocab Mania
                </p>
                <p className="text-[12px] text-outline">v0.1.0 — MVP</p>
              </div>
            </div>
            <p className="text-[13px] text-outline leading-relaxed">
              Evidence-based vocabulary learning for SSC aspirants. Built with cognitive science, not gimmicks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
