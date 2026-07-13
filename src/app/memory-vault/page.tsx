"use client";

import { useState, useCallback, useMemo } from "react";
import { useUser } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useFolderStats, useVaultedItems, invalidateFolderStats, invalidateVaultedItems } from "@/lib/queries";
import { FOLDERS } from "@/lib/folders";
import { Star, Search, ArrowLeft, Loader2, X, RefreshCw, Undo2 } from "lucide-react";
import Link from "next/link";

export default function VaultPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const { data: folderStats = {} } = useFolderStats(user?.id);
  const [activeTab, setActiveTab] = useState<"all" | "words" | "homonyms" | "idioms">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | number | null>(null);
  const [undoItem, setUndoItem] = useState<{ id: string | number; folderId: string; title: string } | null>(null);

  // Fetch vaulted items from all three paths in parallel
  const { data: wordsVault = [], isLoading: wl1 } = useVaultedItems(user?.id, FOLDERS.find(f => f.id === "words") || null);
  const { data: homonymsVault = [], isLoading: wl2 } = useVaultedItems(user?.id, FOLDERS.find(f => f.id === "homonyms") || null);
  const { data: idiomsVault = [], isLoading: wl3 } = useVaultedItems(user?.id, FOLDERS.find(f => f.id === "idioms") || null);

  const isLoading = wl1 || wl2 || wl3;

  // Normalize and combine vaulted items
  const combinedItems = useMemo(() => {
    const list: any[] = [];
    
    wordsVault.forEach((w: any) => {
      list.push({
        id: w.id,
        folderId: "words",
        title: w.word || "",
        meaning: w.meaning || "",
        hindi: w.hindi_meaning || w.hindiMeaning || "",
        pos: w.part_of_speech || w.partOfSpeech || "noun",
        color: "primary",
      });
    });

    homonymsVault.forEach((h: any) => {
      list.push({
        id: h.id,
        folderId: "homonyms",
        title: `${h.word1 || ""} vs ${h.word2 || ""}`,
        meaning: `${h.meaning1 || ""} / ${h.meaning2 || ""}`,
        hindi: `${h.hindi1 || ""} / ${h.hindi2 || ""}`,
        pos: "Spelling Pair",
        color: "secondary",
      });
    });

    idiomsVault.forEach((i: any) => {
      list.push({
        id: i.id,
        folderId: "idioms",
        title: i.idiom || "",
        meaning: i.meaning || "",
        hindi: i.hindi_meaning || i.hindiMeaning || "",
        pos: "Idiom",
        color: "tertiary",
      });
    });

    return list;
  }, [wordsVault, homonymsVault, idiomsVault]);

  // Filter items by active tab and search query
  const filteredItems = useMemo(() => {
    return combinedItems.filter((item) => {
      const matchesTab = activeTab === "all" || item.folderId === activeTab;
      if (!matchesTab) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.hindi.toLowerCase().includes(q)
      );
    });
  }, [combinedItems, activeTab, searchQuery]);

  // Handle item removal from Vault
  const handleRemove = useCallback(
    async (itemId: string | number, folderId: string, itemTitle: string) => {
      if (!user) return;
      setRemovingId(itemId);

      const folder = FOLDERS.find((f) => f.id === folderId);
      if (!folder) return;

      // Update state in progress table to 'mastered' (removing it from vault)
      await supabase
        .from(folder.progressTable)
        .update({ status: "mastered", updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq(folder.progressIdField, itemId);

      // Cache for undo toast
      setUndoItem({ id: itemId, folderId, title: itemTitle });
      
      invalidateFolderStats(user.id);
      invalidateVaultedItems(user.id, folder.id);
      setRemovingId(null);
    },
    [user, supabase]
  );

  // Restore removed item (Undo action)
  const handleUndo = useCallback(async () => {
    if (!user || !undoItem) return;
    const folder = FOLDERS.find((f) => f.id === undoItem.folderId);
    if (!folder) return;

    await supabase
      .from(folder.progressTable)
      .update({ status: "vaulted", updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq(folder.progressIdField, undoItem.id);

    setUndoItem(null);
    invalidateFolderStats(user.id);
    invalidateVaultedItems(user.id, folder.id);
  }, [user, undoItem, supabase]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center dark:bg-[#0a0a0b]">
        <div className="text-[13px] font-bold text-outline animate-pulse">Loading Memory Vault...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0a0a0b] transition-colors duration-300 pb-16">
      <div className="section-wrap pt-6">
        
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
        <div className="mb-6">
          <h1 className="font-display text-[26px] font-black text-on-surface dark:text-white tracking-tight">
            Memory Vault
          </h1>
          <p className="text-[14px] text-outline/80 dark:text-white/50">
            Keep track of starred items for final exam revisions.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search
            size={16}
            className="absolute left-4.5 top-1/2 -translate-y-1/2 text-outline/60 dark:text-white/30"
          />
          <input
            type="text"
            placeholder="Search vault by word, definition, or Hindi meaning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-xl border border-outline-variant/30 bg-surface-container-low pl-11 pr-11 text-[13.5px] text-on-surface placeholder:text-outline/70 transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-white dark:placeholder:text-white/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface dark:hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Horizontal Category Tabs */}
        <div className="flex gap-2 border-b border-outline-variant/10 dark:border-white/[0.03] pb-3 mb-6 overflow-x-auto scrollbar-none">
          {[
            { id: "all", label: "All Items", count: combinedItems.length, color: "text-primary dark:text-[#60a5fa]" },
            { id: "words", label: "Vocabulary", count: wordsVault.length, color: "text-indigo-600 dark:text-[#60a5fa]" },
            { id: "homonyms", label: "Homonyms", count: homonymsVault.length, color: "text-emerald-600 dark:text-[#34d399]" },
            { id: "idioms", label: "Idioms", count: idiomsVault.length, color: "text-amber-600 dark:text-[#fbbf24]" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer shrink-0 border ${
                  isActive
                    ? "bg-surface-container border-outline-variant/40 text-on-surface dark:bg-white/[0.04] dark:border-white/10 dark:text-white"
                    : "border-transparent text-outline hover:text-on-surface dark:hover:text-white"
                }`}
              >
                <span className={tab.color}>{tab.label}</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-surface-container-high dark:bg-white/10 text-outline">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Vault list grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={24} className="text-primary animate-spin" />
            <span className="text-[12px] text-outline">Loading Vault files...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-outline-variant/30 p-12 text-center max-w-md mx-auto mt-6 dark:border-white/10">
            <Star size={28} className="text-outline/30 mx-auto mb-3" />
            <h4 className="font-display text-[15px] font-bold text-on-surface dark:text-white">
              {searchQuery ? "No matching vault items" : "Memory Vault is empty"}
            </h4>
            <p className="text-[12.5px] text-outline/80 dark:text-white/50 mt-1 max-w-[280px] mx-auto leading-relaxed">
              {searchQuery
                ? "Try searching another phrase or word."
                : "Starred cards in your study session loop will unlock vault lists."}
            </p>
            {!searchQuery && (
              <Link
                href="/learn"
                className="mt-4 inline-flex h-9 px-4 rounded-xl bg-primary text-[12.5px] font-bold text-on-primary items-center justify-center dark:bg-[#60a5fa] dark:text-[#0c1929] hover:opacity-95"
              >
                Go to Learn Hub
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const borderTheme = {
                primary: "border-indigo-500/10 hover:border-indigo-500/20 dark:border-white/[0.04]",
                secondary: "border-emerald-500/10 hover:border-emerald-500/20 dark:border-white/[0.04]",
                tertiary: "border-amber-500/10 hover:border-amber-500/20 dark:border-white/[0.04]",
              }[item.color as "primary" | "secondary" | "tertiary"];

              const badgeColor = {
                primary: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-[#60a5fa]",
                secondary: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-[#34d399]",
                tertiary: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-[#fbbf24]",
              }[item.color as "primary" | "secondary" | "tertiary"];

              return (
                <div
                  key={`${item.folderId}-${item.id}`}
                  className={`card-surface p-5 border flex flex-col justify-between transition-all duration-200 ${borderTheme}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${badgeColor}`}>
                        {item.pos}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id, item.folderId, item.title)}
                        disabled={removingId === item.id}
                        className="text-amber-500 hover:text-outline transition-colors cursor-pointer disabled:opacity-30"
                        title="Unstar from Vault"
                      >
                        <Star size={16} className="fill-current" />
                      </button>
                    </div>

                    <div className="text-left space-y-1">
                      <h4 className="font-display text-[15.5px] font-black text-on-surface dark:text-white leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[12.5px] leading-relaxed text-outline dark:text-white/60">
                        {item.meaning}
                      </p>
                      {item.hindi && (
                        <p className="text-[12.5px] font-bold text-secondary dark:text-[#34d399] pt-1">
                          {item.hindi}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Undo Toast Notification */}
      {undoItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-6 bg-surface-container border border-outline-variant/30 px-5 py-3 rounded-2xl shadow-xl animate-fade-in-up max-w-sm w-[90%] dark:border-white/10 dark:bg-[#1a1a1e]">
          <p className="text-[12.5px] font-bold text-on-surface dark:text-white truncate flex items-center gap-1.5">
            <Star size={14} className="text-amber-500" />
            Removed &ldquo;{undoItem.title}&rdquo;
          </p>
          <button
            onClick={handleUndo}
            className="flex items-center gap-1 text-[12px] font-black text-primary hover:opacity-80 transition-opacity cursor-pointer dark:text-[#60a5fa]"
          >
            <Undo2 size={13} />
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
