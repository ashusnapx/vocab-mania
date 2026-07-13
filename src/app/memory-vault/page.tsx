"use client";

import { useState } from "react";
import { useUser } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { WORD_DATABASE } from "@/lib/words";
import { useVault, useRemoveFromVault } from "@/lib/queries";
import { Star, Trash2, Search, ArrowLeft, Shuffle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function MemoryVaultPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: vaultEntries = [], isLoading } = useVault(user?.id);
  const removeMutation = useRemoveFromVault(user?.id);

  if (authLoading || isLoading) {
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

  type VaultEntry = { word_id: string; added_at: string; word: typeof WORD_DATABASE[number] | undefined };
  const vaultWords: VaultEntry[] = vaultEntries
    .map((entry: { word_id: string; added_at: string }) => ({
      ...entry,
      word: WORD_DATABASE.find((w) => w.id === entry.word_id),
    }))
    .filter((e: VaultEntry) => e.word)
    .filter((e: VaultEntry) =>
      searchQuery
        ? e.word!.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.word!.hindiMeaning.includes(searchQuery) ||
          e.word!.meaning.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  const handleRemove = (wordId: string) => {
    removeMutation.mutate(wordId);
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="section-wrap py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/progress"
            className="flex items-center gap-1.5 text-[13px] text-outline hover:text-on-surface transition-colors"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <span className="text-[14px] font-medium text-on-surface flex items-center gap-1.5">
            <Star size={14} className="text-tertiary" />
            Memory Vault
          </span>
        </div>

        {/* Count + Review Button */}
        <div className="card-surface p-5 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-[28px] font-bold text-on-surface">
                {vaultEntries.length}
              </p>
              <p className="text-[13px] text-outline">words saved for special review</p>
            </div>
            {vaultEntries.length > 0 && (
              <Link
                href="/learn?vault=true"
                className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-tertiary text-[13px] font-medium text-on-tertiary hover:bg-tertiary-hover transition-all"
              >
                <Shuffle size={14} />
                Review Vault
              </Link>
            )}
          </div>
        </div>

        {/* Search */}
        {vaultEntries.length > 0 && (
          <div className="card-surface flex items-center gap-2.5 px-4 mb-4">
            <Search size={16} className="text-outline" />
            <input
              type="text"
              placeholder="Search vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-3 text-[14px] text-on-surface bg-transparent outline-none placeholder:text-outline"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[12px] text-outline hover:text-on-surface"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Word List */}
        {vaultWords.length === 0 ? (
          <div className="card-surface p-10 text-center">
            <div className="flex justify-center mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tertiary/10">
                <Star size={20} className="text-tertiary" />
              </div>
            </div>
            <p className="text-[14px] text-on-surface font-medium mb-1">
              {searchQuery ? "No matches found" : "No words in your vault yet"}
            </p>
            <p className="text-[13px] text-outline">
              {searchQuery
                ? "Try a different search"
                : "While learning, tap ⭐ to save important words here"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {vaultWords.map((entry) => (
              <div
                key={entry.word_id}
                className="card-surface flex items-center gap-4 p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[16px] font-medium text-on-surface">
                      {entry.word!.word}
                    </h3>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary capitalize">
                      {entry.word!.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-[14px] text-primary">{entry.word!.hindiMeaning}</p>
                  <p className="text-[13px] text-outline truncate mt-0.5">
                    {entry.word!.meaning}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(entry.word_id)}
                  disabled={removeMutation.isPending}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl hover:bg-red-500/10 text-outline hover:text-red-500 transition-all disabled:opacity-40"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
