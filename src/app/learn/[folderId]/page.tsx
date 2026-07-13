"use client";

import * as React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useUser } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { generateId } from "@/lib/id";
import { Flashcard } from "@/components/flashcard";
import { WordFlashcard } from "@/components/word-flashcard";
import { IdiomFlashcard } from "@/components/idiom-flashcard";
import { Quiz } from "@/components/quiz";
import { ProgressBar } from "@/components/progress-bar";
import { getFolderById, type SessionItem, type FolderQuestion } from "@/lib/folders";
import { calculateReward } from "@/lib/progression";
import {
  fetchSessionItems,
  useMarkMastered,
  useMarkVaulted,
  useCompleteSession,
  useAwardXP,
  useFolderSettings,
  loadLocalSessionCounts,
} from "@/lib/queries";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type View = "loading" | "flashcards" | "quiz" | "complete" | "error";

interface SavedSession {
  sessionId: string | null;
  startedAt: string;
  items: SessionItem[];
  initialItems: SessionItem[];
  ikCount: number;
  vaultCount: number;
  quizQuestions: FolderQuestion[];
  view: View;
  quizResult: { score: number; total: number } | null;
  earnedXP: number;
}

export default function LearnSessionPage({
  params,
}: {
  params: React.Usable<{ folderId: string }>;
}) {
  const { folderId } = React.use(params);
  const folder = getFolderById(folderId);

  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const { data: dbSettings = {} } = useFolderSettings(user?.id);
  const markMastered = useMarkMastered();
  const markVaulted = useMarkVaulted();
  const completeSession = useCompleteSession();
  const awardXP = useAwardXP();

  // Local state
  const [view, setView] = useState<View>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [items, setItems] = useState<SessionItem[]>([]);
  const [initialItems, setInitialItems] = useState<SessionItem[]>([]);
  const [pos, setPos] = useState(0);
  const [ikCount, setIkCount] = useState(0);
  const [vaultCount, setVaultCount] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<FolderQuestion[]>([]);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
  const [earnedXP, setEarnedXP] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);

  const posRef = useRef(0);

  // LocalStorage storage keys
  const storageKey = `active-learn-session-${folderId}`;

  // Helper to save current state
  const saveStateToStorage = useCallback(
    (updates: Partial<SavedSession>) => {
      if (typeof window === "undefined") return;
      try {
        const currentSaved = localStorage.getItem(storageKey);
        const base = currentSaved ? JSON.parse(currentSaved) : {};
        const stateToSave = {
          ...base,
          sessionId,
          startedAt: startedAt ? startedAt.toISOString() : new Date().toISOString(),
          items,
          initialItems,
          ikCount,
          vaultCount,
          quizQuestions,
          view,
          quizResult,
          earnedXP,
          ...updates,
        };
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));
      } catch (err) {
        console.error("Failed to save session state:", err);
      }
    },
    [
      storageKey,
      sessionId,
      startedAt,
      items,
      initialItems,
      ikCount,
      vaultCount,
      quizQuestions,
      view,
      quizResult,
      earnedXP,
    ]
  );

  // Restore state from LocalStorage or initialize new session
  useEffect(() => {
    if (authLoading || !user || !folder) return;

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed: SavedSession = JSON.parse(saved);
        setSessionId(parsed.sessionId);
        setStartedAt(new Date(parsed.startedAt));
        setItems(parsed.items);
        setInitialItems(parsed.initialItems);
        setIkCount(parsed.ikCount);
        setVaultCount(parsed.vaultCount);
        setQuizQuestions(parsed.quizQuestions);
        setQuizResult(parsed.quizResult);
        setEarnedXP(parsed.earnedXP);
        setView(parsed.view);
        return;
      } catch (e) {
        console.error("Failed to parse saved session, starting new...", e);
      }
    }

    // Initialize new session
    const startNewSession = async () => {
      const localCounts = loadLocalSessionCounts();
      const count = localCounts[folderId] ?? dbSettings[folderId] ?? 10;
      try {
        const { items: sessionItems, questions } = await fetchSessionItems(
          user.id,
          folder,
          count
        );

        if (sessionItems.length === 0) {
          setErrorMsg("All items mastered! Nothing left to learn in this folder.");
          setView("error");
          return;
        }

        // Create learning session in DB
        const { data: sessionRecord } = await supabase
          .from("learning_sessions")
          .insert({
            id: generateId(),
            user_id: user.id,
            session_type: "learn",
            words_seen: sessionItems.length,
          })
          .select("id")
          .single();

        const sId = sessionRecord?.id ?? null;
        const start = new Date();

        setSessionId(sId);
        setStartedAt(start);
        setItems(sessionItems);
        setInitialItems(sessionItems);
        setPos(0);
        posRef.current = 0;
        setIkCount(0);
        setVaultCount(0);
        setQuizQuestions(questions);
        setQuizResult(null);
        setEarnedXP(0);
        setView("flashcards");

        // Save initial state
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            sessionId: sId,
            startedAt: start.toISOString(),
            items: sessionItems,
            initialItems: sessionItems,
            ikCount: 0,
            vaultCount: 0,
            quizQuestions: questions,
            view: "flashcards",
            quizResult: null,
            earnedXP: 0,
          })
        );
      } catch (err) {
        console.error("Failed to start session:", err);
        setErrorMsg("Failed to load items. Please try again.");
        setView("error");
      }
    };

    startNewSession();
  }, [authLoading, user, folder, folderId, dbSettings, storageKey, supabase]);

  // ============ HANDLE FLASHCARD ACTION ============
  const handleAction = useCallback(
    async (action: "know" | "vault" | "dont_know") => {
      if (processing || !folder || !user) return;

      const current = items[posRef.current];
      if (!current) return;

      setProcessing(true);

      try {
        if (action === "know") {
          await markMastered.mutateAsync({
            userId: user.id,
            folder,
            itemId: current.id,
          });
          const nextIk = ikCount + 1;
          setIkCount(nextIk);

          setItems((prev) => {
            const updated = prev.filter((_, i) => i !== posRef.current);
            const nextView = updated.length === 0 ? "quiz" : "flashcards";
            
            if (updated.length === 0) {
              setView("quiz");
            } else if (posRef.current >= updated.length && updated.length > 0) {
              posRef.current = 0;
              setPos(0);
            }

            saveStateToStorage({
              items: updated,
              ikCount: nextIk,
              view: nextView,
            });

            return updated;
          });
        } else if (action === "vault") {
          await markVaulted.mutateAsync({
            userId: user.id,
            folder,
            itemId: current.id,
          });
          const nextVault = vaultCount + 1;
          setVaultCount(nextVault);

          setItems((prev) => {
            const updated = prev.filter((_, i) => i !== posRef.current);
            const nextView = updated.length === 0 ? "quiz" : "flashcards";

            if (updated.length === 0) {
              setView("quiz");
            } else if (posRef.current >= updated.length && updated.length > 0) {
              posRef.current = 0;
              setPos(0);
            }

            saveStateToStorage({
              items: updated,
              vaultCount: nextVault,
              view: nextView,
            });

            return updated;
          });
        } else {
          // Don't know — re-queue card
          setItems((prev) => {
            const updated = [...prev];
            updated.splice(posRef.current, 1);
            if (updated.length === 0) {
              return [current];
            }
            const insertAt = Math.min(
              posRef.current + 1 + Math.floor(Math.random() * 3),
              updated.length
            );
            updated.splice(insertAt, 0, current);

            saveStateToStorage({
              items: updated,
            });

            return updated;
          });
        }
      } finally {
        setProcessing(false);
      }
    },
    [processing, folder, user, items, ikCount, vaultCount, saveStateToStorage, markMastered, markVaulted]
  );

  // ============ FINALIZE SESSION ============
  const finalizeSession = useCallback(
    async (quizScore?: { score: number; total: number }) => {
      if (!user) return;

      // Complete session record
      if (sessionId && startedAt) {
        const duration = Math.round((Date.now() - startedAt.getTime()) / 1000);
        await completeSession.mutateAsync({
          sessionId,
          wordsCorrect: ikCount,
          wordsIncorrect: vaultCount,
          durationSeconds: duration,
        });
      }

      // Award XP
      let xp = 0;
      if (quizScore && quizScore.total > 0) {
        xp = calculateReward(quizScore.score, quizScore.total);
        if (xp > 0) {
          const res: any = await awardXP.mutateAsync({
            userId: user.id,
            xp,
            reason: quizScore.score === quizScore.total ? "QUIZ_PERFECT" : "QUIZ_COMPLETE",
            metadata: { folderId, score: quizScore.score, total: quizScore.total },
          });
          if (res && typeof res.net_awarded === "number") {
            xp = res.net_awarded;
          }
        }
      }

      setEarnedXP(xp);
      if (quizScore) setQuizResult(quizScore);
      setView("complete");

      saveStateToStorage({
        view: "complete",
        quizResult: quizScore || null,
        earnedXP: xp,
      });
    },
    [user, sessionId, startedAt, ikCount, vaultCount, saveStateToStorage, completeSession, awardXP]
  );

  // ============ BACK TO FOLDERS ============
  const backToFolders = useCallback(() => {
    localStorage.removeItem(storageKey);
    router.push("/learn");
  }, [storageKey, router]);

  // Renders
  if (authLoading || !folder) {
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

  // ======== LOADING ========
  if (view === "loading") {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="text-primary animate-spin" />
          <div className="text-[14px] text-outline">Loading session...</div>
        </div>
      </div>
    );
  }

  // ======== ERROR ========
  if (view === "error") {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <div className="card-surface p-6 text-center max-w-sm">
          <p className="text-[14px] text-red-600 mb-4">{errorMsg}</p>
          <button
            onClick={backToFolders}
            className="w-full h-10 rounded-xl bg-primary text-[13px] font-semibold text-on-primary"
          >
            Back to Folders
          </button>
        </div>
      </div>
    );
  }

  // ======== QUIZ ========
  if (view === "quiz") {
    return (
      <Quiz
        questions={quizQuestions}
        sessionItems={initialItems}
        onComplete={(score, total) => finalizeSession({ score, total })}
      />
    );
  }

  // ======== COMPLETE ========
  if (view === "complete") {
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
              {folder.name}
            </p>

            {earnedXP > 0 && (
              <div className="rounded-xl bg-tertiary/8 p-4 mb-4">
                <p className="text-[13px] text-outline mb-1">XP Earned</p>
                <p className="font-display text-[28px] font-bold text-tertiary">
                  +{earnedXP} XP
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
                  {items.length}
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

            <button
              onClick={backToFolders}
              className="block w-full h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary text-center leading-[48px] transition-all hover:bg-primary-hover"
            >
              Back to Folders
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ======== FLASHCARDS ========
  const current = items[pos];
  if (!current) return null;

  return (
    <div className="min-h-screen bg-surface">
      <div className="section-wrap pt-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={backToFolders}
            className="flex items-center gap-1.5 text-[13px] text-outline hover:text-on-surface transition-colors"
          >
            <ArrowLeft size={14} />
            Folders
          </button>
          <span className="text-[13px] text-outline">
            {ikCount + vaultCount} / {items.length + ikCount + vaultCount} done
          </span>
        </div>

        <ProgressBar
          current={ikCount + vaultCount}
          total={items.length + ikCount + vaultCount}
          showPercentage={false}
          color={folder.color === "tertiary" ? "primary" : folder.color}
        />

        <div className="mt-6">
          {folderId === "homonyms" ? (
            <Flashcard
              key={current.id}
              pair={current.data}
              onAction={handleAction}
              disabled={processing}
            />
          ) : folderId === "idioms" ? (
            <IdiomFlashcard
              key={current.id}
              idiom={current.data}
              onAction={handleAction}
              disabled={processing}
            />
          ) : (
            <WordFlashcard
              key={current.id}
              word={current.data}
              onAction={handleAction}
              disabled={processing}
            />
          )}
        </div>
      </div>
    </div>
  );
}
