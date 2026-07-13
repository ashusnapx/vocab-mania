"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import { useUser } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useProfile, useFolderStats, invalidateProfile } from "@/lib/queries";
import { getFolderById, type FolderQuestion } from "@/lib/folders";
import { Quiz } from "@/components/quiz";
import { getLevel, getProgress, getTier, calculateReward } from "@/lib/progression";
import { CheckCircle2, Zap, ArrowLeft, Loader2 } from "lucide-react";

type View = "loading" | "quiz" | "result" | "error";

interface SavedQuizSession {
  quizQuestions: FolderQuestion[];
  step: number;
  mcqScore: number;
  selected: string | null;
  submitted: boolean;
  view: View;
  quizResult: { score: number; total: number } | null;
  earnedXP: number;
}

export default function QuizSessionPage({
  params,
}: {
  params: React.Usable<{ folderId: string }>;
}) {
  const { folderId } = React.use(params);
  const folder = getFolderById(folderId);

  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: folderStats = {} } = useFolderStats(user?.id);

  // Quiz state
  const [view, setView] = useState<View>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [quizQuestions, setQuizQuestions] = useState<FolderQuestion[]>([]);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
  const [earnedXP, setEarnedXP] = useState(0);

  const storageKey = `active-quiz-session-${folderId}`;

  // Helper to save state
  const saveStateToStorage = useCallback(
    (updates: Partial<SavedQuizSession>) => {
      if (typeof window === "undefined") return;
      try {
        const currentSaved = localStorage.getItem(storageKey);
        const base = currentSaved ? JSON.parse(currentSaved) : {};
        const stateToSave = {
          ...base,
          quizQuestions,
          view,
          quizResult,
          earnedXP,
          ...updates,
        };
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));
      } catch (err) {
        console.error("Failed to save quiz state:", err);
      }
    },
    [storageKey, quizQuestions, view, quizResult, earnedXP]
  );

  // Restore or initialize quiz session
  useEffect(() => {
    if (authLoading || !user || !folder) return;

    const stats = folderStats[folderId];
    if (!stats) return;

    // Words folder requires 3+ mastered items, while Homonyms and Idioms are unlocked immediately
    const isStaticFolder = folderId === "homonyms" || folderId === "idioms";
    if (!isStaticFolder && stats.mastered < 3) {
      setErrorMsg("You need to master at least 3 items in this folder before taking a quiz.");
      setView("error");
      return;
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed: SavedQuizSession = JSON.parse(saved);
        setQuizQuestions(parsed.quizQuestions);
        setQuizResult(parsed.quizResult);
        setEarnedXP(parsed.earnedXP);
        setView(parsed.view);
        return;
      } catch (e) {
        console.error("Failed to parse saved quiz, starting new...", e);
      }
    }

    // Initialize new quiz session
    const loadQuizData = async () => {
      try {
        if (isStaticFolder) {
          const qTable = folderId === "homonyms" ? "homonym_questions" : "idiom_questions";
          const idField = folderId === "homonyms" ? "pair_id" : "idiom_id";
          
          // Fetch all questions from the static questions table
          const { data: dbQuestions } = await supabase
            .from(qTable)
            .select("*");

          if (dbQuestions && dbQuestions.length > 0) {
            const mapped: FolderQuestion[] = (dbQuestions as Record<string, unknown>[]).map(
              (row) => ({
                id: row.id as number,
                question: row.question as string,
                options: {
                  a: row.option_a as string,
                  b: row.option_b as string,
                  c: row.option_c as string,
                  d: row.option_d as string,
                },
                answer: row.answer as string,
                itemId: row[idField] as number,
              })
            );
            setQuizQuestions(mapped);
            setView("quiz");

            localStorage.setItem(
              storageKey,
              JSON.stringify({
                quizQuestions: mapped,
                view: "quiz",
                quizResult: null,
                earnedXP: 0,
              })
            );
            return;
          }
        }

        // Words: Fetch mastered items
        const { data: progressRows } = await supabase
          .from(folder.progressTable)
          .select(folder.progressIdField)
          .eq("user_id", user.id)
          .eq("status", "mastered");

        const ids = (progressRows ?? []).map(
          (r: Record<string, unknown>) => r[folder.progressIdField] as string | number
        );

        if (ids.length === 0 || !folder.questionGenerator) {
          setErrorMsg("No mastered items available to generate questions.");
          setView("error");
          return;
        }

        const { data: items } = await supabase
          .from(folder.dbTable)
          .select("*")
          .in("id", ids);

        const questions: FolderQuestion[] = [];
        for (const row of (items ?? []) as Record<string, unknown>[]) {
          questions.push(...folder.questionGenerator(row));
        }

        setQuizQuestions(questions);
        setView("quiz");

        localStorage.setItem(
          storageKey,
          JSON.stringify({
            quizQuestions: questions,
            view: "quiz",
            quizResult: null,
            earnedXP: 0,
          })
        );
      } catch (err) {
        console.error("Failed to load quiz data:", err);
        setErrorMsg("Failed to load quiz questions. Please try again.");
        setView("error");
      }
    };

    loadQuizData();
  }, [authLoading, user, folder, folderId, folderStats, storageKey, supabase]);

  // ============ FINALIZE QUIZ ============
  const handleQuizComplete = useCallback(
    async (score: number, total: number) => {
      setQuizResult({ score, total });

      let xp = calculateReward(score, total);
      if (xp > 0 && user?.id) {
        const { data, error } = await supabase.rpc("award_user_xp", {
          p_user_id: user.id,
          p_amount: xp,
          p_reason: score === total ? "QUIZ_PERFECT" : "QUIZ_COMPLETE",
          p_metadata: { folder_id: folderId, score, total },
        });
        if (!error && data) {
          xp = data.net_awarded;
        }
        invalidateProfile(user.id);
        setEarnedXP(xp);
      }

      setView("result");

      saveStateToStorage({
        view: "result",
        quizResult: { score, total },
        earnedXP: xp,
      });
    },
    [user, saveStateToStorage, supabase]
  );

  const backToSelect = useCallback(() => {
    localStorage.removeItem(storageKey);
    router.push("/quiz");
  }, [storageKey, router]);

  // Renders
  if (authLoading || profileLoading || !folder) {
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
          <div className="text-[14px] text-outline">Loading quiz...</div>
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
            onClick={backToSelect}
            className="w-full h-10 rounded-xl bg-primary text-[13px] font-semibold text-on-primary"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ======== QUIZ ========
  if (view === "quiz") {
    if (quizQuestions.length === 0) {
      return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
          <p className="text-[14px] text-outline mb-4">
            No quiz questions available for this folder yet.
          </p>
          <button
            onClick={backToSelect}
            className="h-10 px-4 rounded-xl bg-primary text-[13px] font-medium text-on-primary"
          >
            Back
          </button>
        </div>
      );
    }

    return (
      <Quiz
        questions={quizQuestions}
        onComplete={handleQuizComplete}
      />
    );
  }

  // ======== RESULT ========
  if (view === "result" && quizResult) {
    const userXP = profile?.xp || 0;
    const currentLevel = getLevel(userXP);
    const currentTier = getTier(currentLevel);

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
              Quiz complete
            </h2>
            <p className="text-[14px] text-outline mb-6">{folder.name}</p>

            {earnedXP > 0 && (
              <div className="rounded-xl bg-tertiary/8 p-4 mb-4">
                <p className="text-[13px] text-outline mb-1">XP Earned</p>
                <p className="font-display text-[28px] font-bold text-tertiary">
                  +{earnedXP} XP
                </p>
              </div>
            )}

            <div className="rounded-xl bg-primary/8 p-4 mb-4">
              <p className="text-[13px] text-outline mb-1">Score</p>
              <p className="font-display text-[28px] font-bold text-primary">
                {quizResult.score}/{quizResult.total}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${currentTier.color}15` }}
              >
                <Zap size={16} style={{ color: currentTier.color }} />
              </div>
              <span className="text-[13px] font-medium" style={{ color: currentTier.color }}>
                {currentTier.name} — {userXP} XP
              </span>
            </div>

            <button
              onClick={backToSelect}
              className="block w-full h-12 rounded-xl bg-primary text-[14px] font-medium text-on-primary text-center leading-[48px] transition-all hover:bg-primary-hover"
            >
              Back to Quiz List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
