"use client";

import { useState } from "react";
import { useUser } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useProfile,
  useClearAllData,
  useExportData,
} from "@/lib/queries";
import {
  ArrowLeft,
  LogOut,
  Download,
  Trash2,
  Check,
  Shield,
  Loader2,
  Settings2,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const clearAllData = useClearAllData(user?.id);
  const exportData = useExportData(user?.id);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const showSaved = (field: string) => {
    setSaved(field);
    setTimeout(() => setSaved(null), 1500);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center dark:bg-[#0a0a0b]">
        <div className="text-[13px] font-bold text-outline animate-pulse">Loading Settings...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

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
    <div className="min-h-screen bg-surface dark:bg-[#0a0a0b] transition-colors duration-300 pb-16">
      <div className="section-wrap pt-6 max-w-lg mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/progress"
            className="flex items-center gap-1.5 text-[12.5px] font-bold text-outline hover:text-on-surface transition-colors"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <span className="text-[14px] font-bold text-on-surface dark:text-white flex items-center gap-1.5">
            <Settings2 size={15} />
            Settings
          </span>
        </div>

        {/* PROFILE CARD */}
        <div className="card-surface overflow-hidden border border-outline-variant/20 dark:border-white/[0.04] mb-6">
          <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-tertiary" />
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-16 w-16 rounded-2xl object-cover border border-outline-variant/30"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary dark:bg-[#60a5fa]/10 dark:text-[#60a5fa]">
                    <span className="font-display text-[24px] font-black">
                      {(profile?.full_name || profile?.email || "U")[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-secondary flex items-center justify-center ring-2 ring-surface dark:bg-[#34d399] dark:ring-[#171719]">
                  <Check size={10} className="text-on-primary dark:text-[#022c22] stroke-[3]" />
                </div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h2 className="font-display text-[17px] font-bold text-on-surface dark:text-white truncate leading-tight">
                  {profile?.full_name || "Vocab Aspirant"}
                </h2>
                <p className="text-[13px] text-outline truncate">{profile?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary dark:bg-[#60a5fa]/15 dark:text-[#60a5fa] uppercase tracking-wider">
                    <Shield size={10} />
                    {profile?.auth_provider === "google" ? "Google" : "Email"}
                  </span>
                  <span className="text-[11px] text-outline/80 dark:text-white/40">
                    Aspirant since {memberSince}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GENERAL ACTIONS CARD */}
        <div className="mb-6 space-y-3">
          <h3 className="text-[11px] font-bold text-outline dark:text-white/30 uppercase tracking-widest px-1 text-left">
            Preferences & Actions
          </h3>
          <div className="card-surface divide-y divide-outline-variant/10 border border-outline-variant/20 dark:border-white/[0.04] dark:divide-white/[0.03]">
            {/* Export progress */}
            <button
              onClick={handleExport}
              disabled={exportData.isPending}
              className="w-full p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-[#60a5fa]/10 dark:text-[#60a5fa]">
                  <Download size={14} />
                </div>
                <div>
                  <p className="text-[13.5px] font-bold text-on-surface dark:text-white leading-normal">Export Data</p>
                  <p className="text-[12px] text-outline dark:text-white/40">Download your learning stats as JSON</p>
                </div>
              </div>
              {exportData.isPending ? (
                <Loader2 size={16} className="text-outline animate-spin" />
              ) : saved === "export" ? (
                <span className="text-[12px] text-secondary font-bold flex items-center gap-1 dark:text-[#34d399]">
                  <Check size={12} className="stroke-[3]" /> Saved
                </span>
              ) : (
                <span className="text-[11px] text-outline/65 font-bold hover:text-on-surface">Download</span>
              )}
            </button>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="w-full p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-outline/10 text-outline">
                  <LogOut size={14} />
                </div>
                <div>
                  <p className="text-[13.5px] font-bold text-on-surface dark:text-white leading-normal">Sign Out</p>
                  <p className="text-[12px] text-outline dark:text-white/40">Disconnect your current session</p>
                </div>
              </div>
              <span className="text-[11px] text-outline/65 font-bold">Exit</span>
            </button>
          </div>
        </div>

        {/* DANGER ZONE (ISOLATED VISUALLY) */}
        <div className="mb-8 space-y-3">
          <h3 className="text-[11px] font-bold text-red-500 uppercase tracking-widest px-1 text-left">
            Danger Zone
          </h3>
          
          <div className="rounded-[22px] border-2 border-red-500/20 bg-red-500/[0.01] p-5 space-y-4">
            
            {/* Clear Progress Block */}
            <div className="flex items-start justify-between gap-4">
              <div className="text-left">
                <h4 className="text-[13.5px] font-bold text-red-500 leading-normal">Clear Progress</h4>
                <p className="text-[12px] text-outline dark:text-white/40 max-w-[280px]">
                  Reset all your learned counts, XP logs, and vault stars. This cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="h-9 px-3 rounded-lg border border-red-500/30 text-[12px] font-bold text-red-500 hover:bg-red-500/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                Reset Progress
              </button>
            </div>

            {showClearConfirm && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-left space-y-3">
                <p className="text-[12.5px] text-on-surface/90 dark:text-white/80 leading-relaxed flex gap-2">
                  <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  Are you absolutely sure? This will wipe your dashboard calendar progress and level records completely.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 h-8 rounded-lg border border-outline-variant/30 text-[12px] font-bold text-on-surface hover:bg-surface dark:border-white/10 dark:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearProgress}
                    disabled={clearAllData.isPending}
                    className="flex-1 h-8 rounded-lg bg-red-500 text-[12px] font-bold text-white hover:opacity-95 flex items-center justify-center gap-1.5"
                  >
                    {clearAllData.isPending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      "Yes, Wipe Data"
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="h-[1px] bg-red-500/15" />

            {/* Delete Account Block */}
            <div className="flex items-start justify-between gap-4">
              <div className="text-left">
                <h4 className="text-[13.5px] font-bold text-red-500 leading-normal">Delete Account</h4>
                <p className="text-[12px] text-outline dark:text-white/40 max-w-[280px]">
                  Permanently delete your profile credential records.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="h-9 px-3 rounded-lg bg-red-500 text-[12px] font-bold text-white hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
              >
                Delete Profile
              </button>
            </div>

            {showDeleteConfirm && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-left space-y-3">
                <p className="text-[12.5px] text-on-surface/90 dark:text-white/80 leading-relaxed flex gap-2">
                  <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  Are you absolutely sure? This will delete your login info. You will be signed out and your account deleted.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 h-8 rounded-lg border border-outline-variant/30 text-[12px] font-bold text-on-surface hover:bg-surface dark:border-white/10 dark:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={clearAllData.isPending}
                    className="flex-1 h-8 rounded-lg bg-red-500 text-[12px] font-bold text-white hover:opacity-95 flex items-center justify-center gap-1.5"
                  >
                    {clearAllData.isPending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      "Yes, Delete Forever"
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
