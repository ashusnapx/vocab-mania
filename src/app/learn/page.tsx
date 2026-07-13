"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/auth-context";
import { generateId } from "@/lib/id";
import { Flashcard } from "@/components/flashcard";
import { Quiz } from "@/components/quiz";
import { ProgressBar } from "@/components/progress-bar";
import { WORD_DATABASE } from "@/lib/words";
import type { Word } from "@/lib/words";
import { calculateQuizXP } from "@/lib/xp";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LearnPage() {
  const { user, loading } = useUser();
  const supabase = createClient();

  const [queue, setQueue] = useState<Word[]>([]);
  const [pos, setPos] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionData, setSessionData] = useState<{
    id: string;
    startedAt: Date;
  } | null>(null);
  const [completedStats, setCompletedStats] = useState<{
    ikCount: number;
    vaultCount: number;
    total: number;
    earnedXP: number;
  } | null>(null);
  const [ikCount, setIkCount] = useState(0);
  const [vaultCount, setVaultCount] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [phase, setPhase] = useState<"flashcards" | "quiz" | "complete">(
    "flashcards"
  );
  const [ikWords, setIkWords] = useState<Word[]>([]);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
  } | null>(null);
  const [processing, setProcessing] = useState(false);

  const idkCountRef = useRef(0);
  const countsRef = useRef({ ik: 0, vault: 0, total: 0 });
  const ikWordsRef = useRef<Word[]>([]);
  const posRef = useRef(0);

  // Keep posRef in sync
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    if (!user) return;

    const buildSession = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("daily_goal")
        .eq("id", user.id)
        .single();

      const dailyGoal = profile?.daily_goal || 10;

      const { data: progress } = await supabase
        .from("user_progress")
        .select("word_id, status, next_review_at")
        .eq("user_id", user.id);

      const { data: vault } = await supabase
        .from("memory_vault")
        .select("word_id")
        .eq("user_id", user.id);

      const typedProgress = (progress || []) as ProgressRow[];
      const progressMap = new Map<string, ProgressRow>(
        typedProgress.map((p) => [p.word_id, p])
      );
      const vaultWordIds = new Set(
        vault?.map((v: { word_id: string }) => v.word_id) || []
      );
      const masteredIds = new Set(
        typedProgress
          .filter((p) => p.status === "mastered")
          .map((p) => p.word_id)
      );

      // Categorize all available (non-mastered) words
      const reviewWords: Word[] = [];
      const newWords: Word[] = [];
      const vaultedFromDB: Word[] = [];

      for (const word of WORD_DATABASE) {
        if (masteredIds.has(word.id)) continue;
        const p = progressMap.get(word.id);
        if (vaultWordIds.has(word.id)) {
          vaultedFromDB.push(word);
        } else if (!p) {
          newWords.push(word);
        } else if (
          p.next_review_at &&
          new Date(p.next_review_at) <= new Date()
        ) {
          reviewWords.push(word);
        }
      }

      // Build pool to EXACTLY dailyGoal words
      // Priority: vaulted words first, then review, then new, then fill from remaining
      const pool: Word[] = [];
      const usedIds = new Set<string>();

      // 1. Add vaulted words (up to 20% of goal, max all available)
      const vaultLimit = Math.min(
        vaultedFromDB.length,
        Math.ceil(dailyGoal * 0.2)
      );
      for (const w of shuffle(vaultedFromDB).slice(0, vaultLimit)) {
        pool.push(w);
        usedIds.add(w.id);
      }

      // 2. Add review words (up to 40% of goal)
      const reviewLimit = Math.ceil(dailyGoal * 0.4);
      for (const w of shuffle(reviewWords).slice(0, reviewLimit)) {
        if (pool.length >= dailyGoal) break;
        if (!usedIds.has(w.id)) {
          pool.push(w);
          usedIds.add(w.id);
        }
      }

      // 3. Add new words (up to 40% of goal)
      const newLimit = Math.ceil(dailyGoal * 0.4);
      for (const w of shuffle(newWords).slice(0, newLimit)) {
        if (pool.length >= dailyGoal) break;
        if (!usedIds.has(w.id)) {
          pool.push(w);
          usedIds.add(w.id);
        }
      }

      // 4. Fill remaining from any non-mastered, non-used word
      if (pool.length < dailyGoal) {
        const allAvailable = WORD_DATABASE.filter(
          (w) => !masteredIds.has(w.id) && !usedIds.has(w.id)
        );
        for (const w of shuffle(allAvailable)) {
          if (pool.length >= dailyGoal) break;
          pool.push(w);
          usedIds.add(w.id);
        }
      }

      // Final shuffle for variety
      const finalPool = shuffle(pool);

      setTotalWords(finalPool.length);
      setIkCount(0);
      setVaultCount(0);
      idkCountRef.current = 0;
      countsRef.current = { ik: 0, vault: 0, total: finalPool.length };

      setQueue(finalPool);
      setPos(0);
      posRef.current = 0;

      const sessionId = generateId();
      const { data: sessionRecord } = await supabase
        .from("learning_sessions")
        .insert({
          id: sessionId,
          user_id: user.id,
          session_type: "learn",
          words_seen: finalPool.length,
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

  const finalizeSession = useCallback(
    async (quizScore?: { score: number; total: number }) => {
      if (sessionData) {
        const duration = Math.round(
          (Date.now() - sessionData.startedAt.getTime()) / 1000
        );
        await supabase
          .from("learning_sessions")
          .update({
            words_correct: countsRef.current.ik,
            words_incorrect: idkCountRef.current,
            duration_seconds: duration,
            completed_at: new Date().toISOString(),
          })
          .eq("id", sessionData.id);
      }

      const today = new Date().toISOString().split("T")[0];
      await supabase
        .from("profiles")
        .update({ last_active_date: today })
        .eq("id", user?.id);

      // Award XP based on quiz score
      let earnedXP = 0;
      if (quizScore && quizScore.total > 0) {
        earnedXP = calculateQuizXP(quizScore.score, quizScore.total);
        if (earnedXP > 0 && user?.id) {
          // Fetch current XP then add
          const { data: prof } = await supabase
            .from("profiles")
            .select("xp")
            .eq("id", user.id)
            .single();
          const currentXP = prof?.xp || 0;
          await supabase
            .from("profiles")
            .update({ xp: currentXP + earnedXP })
            .eq("id", user.id);
        }
      }

      setCompletedStats({
        ikCount: countsRef.current.ik,
        vaultCount: countsRef.current.vault,
        total: countsRef.current.total,
        earnedXP,
      });
      if (quizScore) setQuizResult(quizScore);
      setPhase("complete");
      setSessionComplete(true);
    },
    [sessionData, user, supabase]
  );

  const onFlashcardsComplete = useCallback(() => {
    if (ikWordsRef.current.length >= 3) {
      setPhase("quiz");
    } else {
      finalizeSession();
    }
  }, [finalizeSession]);

  const handleAction = useCallback(
    async (action: "know" | "dont_know" | "vault") => {
      // Guard: prevent double-processing during async operations
      if (processing) return;

      const currentPos = posRef.current;
      const current = queue[currentPos];
      if (!current || !user) return;

      setProcessing(true);

      try {
        // Persist session word
        if (sessionData) {
          const { error: swErr } = await supabase
            .from("session_words")
            .insert({
              id: generateId(),
              session_id: sessionData.id,
              user_id: user.id,
              word_id: current.id,
              action,
            });
          if (swErr)
            console.error("session_words insert failed:", swErr.message);
        }

        const { data: existing } = await supabase
          .from("user_progress")
          .select(
            "id, repetitions, ease_factor, interval, times_incorrect, times_correct"
          )
          .eq("user_id", user.id)
          .eq("word_id", current.id)
          .single();

        if (action === "know") {
          setIkCount((c) => c + 1);
          countsRef.current = {
            ...countsRef.current,
            ik: countsRef.current.ik + 1,
          };
          ikWordsRef.current = [...ikWordsRef.current, current];
          setIkWords([...ikWordsRef.current]);

          if (existing) {
            const newReps = (existing.repetitions || 0) + 1;
            const newInterval = Math.max(
              1,
              Math.round(
                (existing.interval || 1) * (existing.ease_factor || 2.5)
              )
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
                times_correct: (existing.times_correct || 0) + 1,
                status: "mastered",
                updated_at: new Date().toISOString(),
              })
              .eq("id", existing.id);
          } else {
            const nextReview = new Date();
            nextReview.setDate(nextReview.getDate() + 1);
            await supabase.from("user_progress").insert({
              id: generateId(),
              user_id: user.id,
              word_id: current.id,
              status: "mastered",
              repetitions: 1,
              interval: 1,
              next_review_at: nextReview.toISOString(),
              last_reviewed_at: new Date().toISOString(),
              times_correct: 1,
            });
          }

          // Remove from queue
          setQueue((q) => {
            const updated = q.filter((_, i) => i !== currentPos);
            if (currentPos >= updated.length && updated.length > 0) {
              setPos(0);
              posRef.current = 0;
            }
            if (updated.length === 0) {
              onFlashcardsComplete();
            }
            return updated;
          });
        } else if (action === "vault") {
          setVaultCount((c) => c + 1);
          countsRef.current = {
            ...countsRef.current,
            vault: countsRef.current.vault + 1,
          };

          // Check if already in vault before inserting
          const { data: existingVault } = await supabase
            .from("memory_vault")
            .select("word_id")
            .eq("user_id", user.id)
            .eq("word_id", current.id)
            .maybeSingle();

          if (!existingVault) {
            const { error: vErr } = await supabase
              .from("memory_vault")
              .insert({
                id: generateId(),
                user_id: user.id,
                word_id: current.id,
              });
            if (vErr)
              console.error("memory_vault insert failed:", vErr.message);
          }

          // Remove from queue
          setQueue((q) => {
            const updated = q.filter((_, i) => i !== currentPos);
            if (currentPos >= updated.length && updated.length > 0) {
              setPos(0);
              posRef.current = 0;
            }
            if (updated.length === 0) {
              onFlashcardsComplete();
            }
            return updated;
          });
        } else if (action === "dont_know") {
          idkCountRef.current++;

          // Re-insert this word at a random position ahead in the queue
          setQueue((q) => {
            const updated = [...q];
            updated.splice(currentPos, 1);
            if (updated.length === 0) return updated;
            const insertAt = Math.min(
              currentPos + 1 + Math.floor(Math.random() * Math.max(1, 3)),
              updated.length
            );
            updated.splice(insertAt, 0, current);
            return updated;
          });
          // pos stays the same — next card is the next word in queue
        }
      } finally {
        setProcessing(false);
      }
    },
    [
      processing,
      queue,
      user,
      supabase,
      sessionData,
      onFlashcardsComplete,
      setIkWords,
    ]
  );

  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-[14px] text-outline">
          Preparing your session...
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <Quiz
        words={ikWords}
        onComplete={(score, total) => {
          finalizeSession({ score, total });
        }}
      />
    );
  }

  if (sessionComplete && completedStats) {
    const { ikCount, vaultCount, total, earnedXP } = completedStats;

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

            {earnedXP > 0 && (
              <div className="rounded-xl bg-tertiary/8 p-4 mb-4">
                <p className="text-[13px] text-outline mb-1">XP Earned</p>
                <p className="font-display text-[28px] font-bold text-tertiary">
                  +{earnedXP} XP
                </p>
                <p className="text-[12px] text-outline mt-1">
                  {earnedXP >= 50
                    ? "Perfect! Maximum XP!"
                    : earnedXP >= 35
                      ? "Great work!"
                      : earnedXP >= 20
                        ? "Good effort!"
                        : "Keep going!"}
                </p>
              </div>
            )}

            {quizResult && (
              <div className="rounded-xl bg-primary/8 p-4 mb-4">
                <p className="text-[13px] text-outline mb-1">Quiz Score</p>
                <p className="font-display text-[28px] font-bold text-primary">
                  {quizResult.score}/{quizResult.total}
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl bg-secondary/8 p-3">
                <p className="font-display text-[20px] font-bold text-secondary">
                  {ikCount}
                </p>
                <p className="text-[11px] text-outline">I Know</p>
              </div>
              <div className="rounded-xl bg-surface-container-low p-3">
                <p className="font-display text-[20px] font-bold text-on-surface">
                  {total - ikCount - vaultCount}
                </p>
                <p className="text-[11px] text-outline">Still learning</p>
              </div>
              <div className="rounded-xl bg-tertiary/8 p-3">
                <p className="font-display text-[20px] font-bold text-tertiary">
                  {vaultCount}
                </p>
                <p className="text-[11px] text-outline">Vaulted</p>
              </div>
            </div>

            <Link
              href="/progress"
              className="block w-full h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary text-center leading-[48px] transition-all hover:bg-primary-hover"
            >
              View Progress
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const current = queue[pos];
  if (!current) return null;

  return (
    <div className="min-h-screen bg-surface">
      <div className="section-wrap pt-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/progress"
            className="flex items-center gap-1.5 text-[13px] text-outline hover:text-on-surface transition-colors"
          >
            <ArrowLeft size={14} />
            Exit
          </Link>
          <span className="text-[13px] text-outline">
            {ikCount + vaultCount} / {totalWords} done
          </span>
        </div>

        <ProgressBar
          current={ikCount + vaultCount}
          total={totalWords}
          showPercentage={false}
          color="primary"
        />

        <div className="mt-6">
          <Flashcard
            key={current.id}
            word={current}
            onAction={handleAction}
            disabled={processing}
          />
        </div>
      </div>
    </div>
  );
}
