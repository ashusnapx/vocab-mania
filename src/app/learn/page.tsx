"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/auth-context";
import { generateId } from "@/lib/id";
import { Flashcard } from "@/components/flashcard";
import { ProgressBar } from "@/components/progress-bar";
import { WORD_DATABASE } from "@/lib/words";
import type { Word } from "@/lib/words";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface SessionWord {
  word: Word;
  action: "know" | "dont_know" | "vault" | null;
}

interface ProgressRow {
  id: string;
  word_id: string;
  status: string;
  next_review_at: string | null;
  repetitions: number;
  ease_factor: number;
  interval: number;
  times_incorrect: number;
  times_correct: number;
}

export default function LearnPage() {
  const { user, loading } = useUser();
  const supabase = createClient();

  const [sessionWords, setSessionWords] = useState<SessionWord[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionData, setSessionData] = useState<{
    id: string;
    startedAt: Date;
  } | null>(null);

  // Build session: new words + review due + memory vault words
  useEffect(() => {
    if (!user) return;

    const buildSession = async () => {
      // Fetch user's daily goal
      const { data: profile } = await supabase
        .from("profiles")
        .select("daily_goal")
        .eq("id", user.id)
        .single();

      const dailyGoal = profile?.daily_goal || 10;

      // Fetch user's progress
      const { data: progress } = await supabase
        .from("user_progress")
        .select("word_id, status, next_review_at")
        .eq("user_id", user.id);

      // Fetch memory vault
      const { data: vault } = await supabase
        .from("memory_vault")
        .select("word_id")
        .eq("user_id", user.id);

      const vaultWordIds = new Set<string>(vault?.map((v: { word_id: string }) => v.word_id) || []);
      const typedProgress = (progress || []) as ProgressRow[];
      const progressMap = new Map<string, ProgressRow>(
        typedProgress.map((p) => [p.word_id, p])
      );

      // Categorize words
      const newWords: Word[] = [];
      const reviewWords: Word[] = [];
      const vaultWords: Word[] = [];

      for (const word of WORD_DATABASE) {
        const p = progressMap.get(word.id);
        if (!p) {
          newWords.push(word);
        } else if (p.next_review_at && new Date(p.next_review_at) <= new Date()) {
          reviewWords.push(word);
        }
        if (vaultWordIds.has(word.id)) {
          vaultWords.push(word);
        }
      }

      // Shuffle helper
      const shuffle = <T,>(arr: T[]): T[] => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      };

      // Compose session based on daily goal
      // Split: ~40% new, ~40% review, ~20% vault (adjusted by availability)
      const targetNew = Math.ceil(dailyGoal * 0.4);
      const targetReview = Math.ceil(dailyGoal * 0.4);
      const targetVault = dailyGoal - targetNew - targetReview;

      const session: Word[] = [
        ...shuffle(newWords).slice(0, targetNew),
        ...shuffle(reviewWords).slice(0, targetReview),
        ...shuffle(vaultWords).slice(0, targetVault),
      ];

      // If not enough words, fill from the full database
      if (session.length < dailyGoal) {
        const remaining = shuffle(
          WORD_DATABASE.filter((w) => !session.find((s) => s.id === w.id))
        ).slice(0, dailyGoal - session.length);
        session.push(...remaining);
      }

      // Deduplicate
      const seen = new Set<string>();
      const unique = session.filter((w) => {
        if (seen.has(w.id)) return false;
        seen.add(w.id);
        return true;
      });

      setSessionWords(unique.map((word) => ({ word, action: null })));

      // Create session record
      const sessionId = generateId();
      const { data: sessionRecord } = await supabase
        .from("learning_sessions")
        .insert({
          id: sessionId,
          user_id: user.id,
          session_type: "learn",
          words_seen: unique.length,
        })
        .select("id")
        .single();

      if (sessionRecord) {
        setSessionData({ id: sessionRecord.id, startedAt: new Date() });
      }

      setSessionLoading(false);
    };

    buildSession();
  }, [user, supabase]);

  const handleAction = useCallback(
    async (action: "know" | "dont_know" | "vault") => {
      const current = sessionWords[currentIdx];
      if (!current || !user) return;

      // Update local state
      setSessionWords((prev) =>
        prev.map((sw, i) => (i === currentIdx ? { ...sw, action } : sw))
      );

      // Save to database
      if (sessionData) {
        await supabase.from("session_words").insert({
          id: generateId(),
          session_id: sessionData.id,
          user_id: user.id,
          word_id: current.word.id,
          action,
        });
      }

      // Update or create progress record
      const { data: existing } = await supabase
        .from("user_progress")
        .select("id, repetitions, ease_factor, interval")
        .eq("user_id", user.id)
        .eq("word_id", current.word.id)
        .single() as { data: ProgressRow | null };

      if (action === "know") {
        if (existing) {
          const newReps = (existing.repetitions || 0) + 1;
          const newInterval = Math.max(
            1,
            Math.round((existing.interval || 1) * (existing.ease_factor || 2.5))
          );
          const newEase = Math.max(
            1.3,
            (existing.ease_factor || 2.5) + 0.1
          );
          const nextReview = new Date();
          nextReview.setDate(nextReview.getDate() + newInterval);

          await supabase
            .from("user_progress")
            .update({
              repetitions: newReps,
              ease_factor: newEase,
              interval: newInterval,
              next_review_at: nextReview.toISOString(),
              last_reviewed_at: new Date().toISOString(),
              times_correct: existing ? undefined : 1,
              status: newReps >= 3 ? "mastered" : "reviewing",
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          const nextReview = new Date();
          nextReview.setDate(nextReview.getDate() + 1);
          await supabase.from("user_progress").insert({
            id: generateId(),
            user_id: user.id,
            word_id: current.word.id,
            status: "learning",
            repetitions: 1,
            interval: 1,
            next_review_at: nextReview.toISOString(),
            last_reviewed_at: new Date().toISOString(),
            times_correct: 1,
          });
        }
      } else if (action === "dont_know") {
        if (existing) {
          await supabase
            .from("user_progress")
            .update({
              repetitions: 0,
              interval: 0,
              next_review_at: new Date().toISOString(),
              last_reviewed_at: new Date().toISOString(),
              times_incorrect: (existing.times_incorrect || 0) + 1,
              status: "learning",
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("user_progress").insert({
            id: generateId(),
            user_id: user.id,
            word_id: current.word.id,
            status: "learning",
            repetitions: 0,
            interval: 0,
            next_review_at: new Date().toISOString(),
            last_reviewed_at: new Date().toISOString(),
            times_incorrect: 1,
          });
        }
      }

      if (action === "vault") {
        await supabase.from("memory_vault").upsert({
          id: generateId(),
          user_id: user.id,
          word_id: current.word.id,
        });
      }

      // Move to next word
      if (currentIdx < sessionWords.length - 1) {
        setCurrentIdx((i) => i + 1);
      } else {
        // Session complete
        if (sessionData) {
          const duration = Math.round(
            (Date.now() - sessionData.startedAt.getTime()) / 1000
          );
          const correct = sessionWords.filter(
            (sw) => sw.action === "know"
          ).length;
          const incorrect = sessionWords.filter(
            (sw) => sw.action === "dont_know"
          ).length;

          await supabase
            .from("learning_sessions")
            .update({
              words_correct: correct,
              words_incorrect: incorrect,
              duration_seconds: duration,
              completed_at: new Date().toISOString(),
            })
            .eq("id", sessionData.id);
        }

        // Update streak
        const today = new Date().toISOString().split("T")[0];
        await supabase
          .from("profiles")
          .update({ last_active_date: today })
          .eq("id", user.id);

        setSessionComplete(true);
      }
    },
    [currentIdx, sessionWords, user, supabase, sessionData]
  );

  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-[14px] text-outline">Preparing your session...</div>
      </div>
    );
  }

  if (sessionComplete) {
    const correct = sessionWords.filter((sw) => sw.action === "know").length;
    const vaulted = sessionWords.filter((sw) => sw.action === "vault").length;
    const total = sessionWords.length;

    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="card-surface p-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
                <CheckCircle2 size={24} className="text-secondary" />
              </div>
            </div>
            <h2 className="font-display text-[22px] font-semibold text-on-surface mb-1">
              Session complete
            </h2>
            <p className="text-[14px] text-outline mb-6">
              You reviewed {total} words
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl bg-surface-hover p-3">
                <p className="font-display text-[20px] font-bold text-on-surface">{correct}</p>
                <p className="text-[11px] text-outline">Known</p>
              </div>
              <div className="rounded-xl bg-surface-hover p-3">
                <p className="font-display text-[20px] font-bold text-on-surface">
                  {total - correct - vaulted}
                </p>
                <p className="text-[11px] text-outline">Learning</p>
              </div>
              <div className="rounded-xl bg-surface-hover p-3">
                <p className="font-display text-[20px] font-bold text-tertiary">{vaulted}</p>
                <p className="text-[11px] text-outline">Vaulted</p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="block w-full h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary text-center leading-[48px] transition-all hover:bg-primary-hover"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const current = sessionWords[currentIdx];

  return (
    <div className="min-h-screen bg-surface">
      <div className="section-wrap pt-6 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-[13px] text-outline hover:text-on-surface transition-colors"
          >
            <ArrowLeft size={14} />
            Exit
          </Link>
          <span className="text-[13px] text-outline">
            {currentIdx + 1} / {sessionWords.length}
          </span>
        </div>

        {/* Progress */}
        <ProgressBar
          current={currentIdx + 1}
          total={sessionWords.length}
          showPercentage={false}
          color="primary"
        />

        {/* Flashcard */}
        <div className="mt-6">
          <Flashcard key={current.word.id} word={current.word} onAction={handleAction} />
        </div>
      </div>
    </div>
  );
}
