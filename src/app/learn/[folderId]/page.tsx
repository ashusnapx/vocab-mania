"use client";

import * as React from "react";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useUser } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { generateId } from "@/lib/id";
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
import { ArrowLeft, CheckCircle2, Loader2, Sparkles, Star, X, CornerDownRight, Flame, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type View = "loading" | "mcq" | "complete" | "error";

interface SavedSession {
  sessionId: string | null;
  startedAt: string;
  items: SessionItem[];
  initialItems: SessionItem[];
  pos: number;
  ikCount: number;
  vaultCount: number;
  sessionStreak: number;
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
  const [sessionStreak, setSessionStreak] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<FolderQuestion[]>([]);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
  const [earnedXP, setEarnedXP] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);

  // MCQ response state
  const [selectedOption, setSelectedOption] = useState<"a" | "b" | "c" | "d" | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);

  // Storage key
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
          pos,
          ikCount,
          vaultCount,
          sessionStreak,
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
      pos,
      ikCount,
      vaultCount,
      sessionStreak,
      quizQuestions,
      view,
      quizResult,
      earnedXP,
    ]
  );

  // Redirect hook to safety
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const initialized = useRef(false);

  // Restore state or initialize new session
  useEffect(() => {
    if (authLoading || !user || !folder || initialized.current) return;
    initialized.current = true;

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed: SavedSession = JSON.parse(saved);
        if (
          parsed.items &&
          parsed.items.length > 0 &&
          parsed.quizQuestions &&
          parsed.quizQuestions.length > 0 &&
          (parsed.view === "mcq" || parsed.view === "complete")
        ) {
          setSessionId(parsed.sessionId);
          setStartedAt(new Date(parsed.startedAt));
          setItems(parsed.items);
          setInitialItems(parsed.initialItems);
          setPos(parsed.pos ?? 0);
          setIkCount(parsed.ikCount);
          setVaultCount(parsed.vaultCount);
          setSessionStreak(parsed.sessionStreak ?? 0);
          setQuizQuestions(parsed.quizQuestions);
          setQuizResult(parsed.quizResult);
          setEarnedXP(parsed.earnedXP);
          setView(parsed.view);
          return;
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch (e) {
        console.error("Failed to parse saved session, starting new...", e);
        localStorage.removeItem(storageKey);
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
        setIkCount(0);
        setVaultCount(0);
        setSessionStreak(0);
        setQuizQuestions(questions);
        setQuizResult(null);
        setEarnedXP(0);
        setView("mcq");

        // Save initial state
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            sessionId: sId,
            startedAt: start.toISOString(),
            items: sessionItems,
            initialItems: sessionItems,
            pos: 0,
            ikCount: 0,
            vaultCount: 0,
            sessionStreak: 0,
            quizQuestions: questions,
            view: "mcq",
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

  // Helper to shuffle choices
  const shuffleChoices = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const accentGradient = useMemo(() => {
    if (folderId === "words") return "from-indigo-500 via-blue-500 to-indigo-600";
    if (folderId === "homonyms") return "from-emerald-500 via-teal-500 to-emerald-600";
    if (folderId === "idioms") return "from-amber-500 via-orange-500 to-amber-600";
    if (folderId === "current_affairs") return "from-emerald-600 via-green-500 to-emerald-500";
    if (folderId === "formula_factory") return "from-sky-500 via-blue-500 to-sky-600";
    if (folderId === "fun_facts") return "from-purple-500 via-fuchsia-500 to-purple-600";
    return "from-primary to-primary-hover";
  }, [folderId]);

  // Current item & question resolution
  const currentItem = useMemo(() => {
    return initialItems[pos] || null;
  }, [initialItems, pos]);

  const currentQuestion = useMemo(() => {
    if (!currentItem) return null;
    
    // 1. Check if database returned a pre-seeded question
    const found = quizQuestions.find((q) => q.itemId === currentItem.id);
    if (found) return found;

    // 2. FALLBACK GENERATOR: Build quality MCQ on the fly using session contexts
    const itemId = currentItem.id;
    let questionText = "";
    let correctText = "";
    let optionsList: string[] = [];

    if (folderId === "idioms") {
      const idiom = (currentItem.data.idiom as string) || "this expression";
      questionText = `What is the correct meaning of the idiom "${idiom}"?`;
      correctText = (currentItem.data.meaning as string) || "";
      
      const distractors = initialItems
        .filter((x) => x.id !== itemId)
        .map((x) => (x.data.meaning as string) || "")
        .filter(Boolean);
      
      const fallbacks = [
        "To perform a task quickly or carelessly.",
        "To make a situation much worse than it is.",
        "To reveal a secret plan prematurely.",
        "To face a difficult challenge with courage."
      ];
      const selected = shuffleChoices([...distractors, ...fallbacks]).slice(0, 3);
      optionsList = shuffleChoices([correctText, ...selected]);
    } else if (folderId === "homonyms") {
      const w1 = (currentItem.data.word1 as string) || "";
      const w2 = (currentItem.data.word2 as string) || "";
      questionText = `Which option correctly defines the homonyms "${w1}" and "${w2}"?`;
      
      const m1 = (currentItem.data.meaning1 as string) || "";
      const m2 = (currentItem.data.meaning2 as string) || "";
      correctText = `${w1}: ${m1} | ${w2}: ${m2}`;

      const distractors = initialItems
        .filter((x) => x.id !== itemId)
        .map((x) => {
          const xw1 = (x.data.word1 as string) || "";
          const xw2 = (x.data.word2 as string) || "";
          const xm1 = (x.data.meaning1 as string) || "";
          const xm2 = (x.data.meaning2 as string) || "";
          return `${xw1}: ${xm1} | ${xw2}: ${xm2}`;
        })
        .filter(Boolean);

      const fallbacks = [
        `${w1}: To accept a challenge | ${w2}: To run away`,
        `${w1}: A metallic element | ${w2}: To press clothes`,
        `${w1}: To raise high | ${w2}: To destroy completely`
      ];
      const selected = shuffleChoices([...distractors, ...fallbacks]).slice(0, 3);
      optionsList = shuffleChoices([correctText, ...selected]);
    } else {
      // Vocabulary words fallback
      const word = (currentItem.data.word as string) || "this word";
      questionText = `What is the definition of the word "${word}"?`;
      correctText = (currentItem.data.meaning as string) || "";

      const distractors = initialItems
        .filter((x) => x.id !== itemId)
        .map((x) => (x.data.meaning as string) || "")
        .filter(Boolean);

      const fallbacks = [
        "Lacking enthusiasm or general interest.",
        "Generous in forgiving an insult or injury.",
        "Extremely careful, precise, and meticulous.",
        "Tending to cause harm or have a bad effect."
      ];
      const selected = shuffleChoices([...distractors, ...fallbacks]).slice(0, 3);
      optionsList = shuffleChoices([correctText, ...selected]);
    }

    const correctIndex = optionsList.indexOf(correctText);
    const answerKey = (["a", "b", "c", "d"] as const)[correctIndex >= 0 ? correctIndex : 0];

    return {
      id: typeof itemId === "number" ? itemId : 9999,
      question: questionText,
      options: {
        a: optionsList[0] || "None of these",
        b: optionsList[1] || "None of these",
        c: optionsList[2] || "None of these",
        d: optionsList[3] || "None of these",
      },
      answer: answerKey,
      itemId: itemId,
    };
  }, [currentItem, quizQuestions, initialItems, folderId]);

  // ============ FINALIZE SESSION ============
  const finalizeSession = useCallback(
    async (finalScore: number, total: number) => {
      if (!user || !folder) return;

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
      if (total > 0) {
        xp = calculateReward(finalScore, total);
        if (xp > 0) {
          try {
            const res: any = await awardXP.mutateAsync({
              userId: user.id,
              xp,
              reason: finalScore === total ? "QUIZ_PERFECT" : "QUIZ_COMPLETE",
              metadata: { folderId, score: finalScore, total },
            });
            if (res && typeof res.net_awarded === "number") {
              xp = res.net_awarded;
            }
          } catch (err) {
            console.error("Failed to award XP:", err);
          }
        }
      }

      setEarnedXP(xp);
      setQuizResult({ score: finalScore, total });
      setView("complete");

      saveStateToStorage({
        view: "complete",
        quizResult: { score: finalScore, total },
        earnedXP: xp,
      });
    },
    [user, folder, sessionId, startedAt, ikCount, vaultCount, folderId, awardXP, completeSession, saveStateToStorage]
  );

  // ============ HANDLE MCQ OPTION TAPPED ============
  const handleOptionSelect = async (option: "a" | "b" | "c" | "d") => {
    if (answered || processing || !currentQuestion || !user || !folder || !currentItem) return;
    setProcessing(true);
    setSelectedOption(option);
    setAnswered(true);

    const correct = option === currentQuestion.answer;
    setIsCorrectAnswer(correct);

    if (correct) {
      setSessionStreak((s) => s + 1);
    } else {
      setSessionStreak(0);
      // INCORRECT SCENARIO: Immediately Auto-Vault in the background
      try {
        await markVaulted.mutateAsync({
          userId: user.id,
          folder,
          itemId: currentItem.id,
        });
        setVaultCount((v) => v + 1);
      } catch (err) {
        console.error("Failed to auto-vault item:", err);
      }
    }
    setProcessing(false);
  };

  // ============ ACTION CONTROLS ON CORRECT ANSWER ============
  const handleCorrectAction = async (action: "dont_know" | "vault" | "mastered") => {
    if (processing || !currentItem || !user || !folder) return;
    setProcessing(true);

    try {
      if (action === "vault") {
        await markVaulted.mutateAsync({
          userId: user.id,
          folder,
          itemId: currentItem.id,
        });
        setVaultCount((v) => v + 1);
      } else if (action === "mastered") {
        await markMastered.mutateAsync({
          userId: user.id,
          folder,
          itemId: currentItem.id,
        });
        setIkCount((k) => k + 1);
      }
      // "dont_know" does not record anything in the progress table (leaving it active/unmastered)

      // Advance to next card
      handleNextCard();
    } catch (err) {
      console.error("Failed to complete action:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleNextCard = () => {
    // Reset states for next card
    setSelectedOption(null);
    setAnswered(false);
    setIsCorrectAnswer(null);

    const nextPos = pos + 1;
    setPos(nextPos);

    if (nextPos >= initialItems.length) {
      // Evaluate session correctness score
      const totalCorrect = ikCount + (isCorrectAnswer ? 1 : 0);
      finalizeSession(totalCorrect, initialItems.length);
    } else {
      saveStateToStorage({
        pos: nextPos,
      });
    }
  };

  const backToFolders = useCallback(() => {
    localStorage.removeItem(storageKey);
    router.push("/learn");
  }, [storageKey, router]);

  // Loader checks
  if (authLoading || !folder) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center dark:bg-[#0a0a0b]">
        <Loader2 size={20} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // ======== LOADING ========
  if (view === "loading") {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center dark:bg-[#0a0a0b]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="text-primary animate-spin" />
          <div className="text-[13px] font-bold text-outline animate-pulse">Loading study deck...</div>
        </div>
      </div>
    );
  }

  // ======== ERROR ========
  if (view === "error") {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 dark:bg-[#0a0a0b]">
        <div className="card-surface p-6 text-center max-w-sm">
          <p className="text-[14px] font-bold text-red-600 mb-4">{errorMsg}</p>
          <button
            onClick={backToFolders}
            className="w-full h-10 rounded-xl bg-primary text-[13px] font-bold text-on-primary cursor-pointer dark:bg-[#60a5fa] dark:text-[#0c1929]"
          >
            Back to Hub
          </button>
        </div>
      </div>
    );
  }

  // ======== COMPLETE SCREEN ========
  if (view === "complete") {
    const accuracy = initialItems.length > 0 ? (quizResult?.score || 0) / initialItems.length : 0;
    let congrats = "Vocabulary deck completed! 📚";
    if (accuracy === 1) congrats = "Vocab Masterpiece! 🏆 Perfect Score!";
    else if (accuracy >= 0.8) congrats = "Excellent retention! 🌟 Keep it up!";
    else if (accuracy < 0.5) congrats = "Hard items added to Vault for review. 📂";

    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4 dark:bg-[#0a0a0b]">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="card-surface p-8 border border-neutral-200/50 dark:border-white/[0.04] shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-[#34d399]">
                <CheckCircle2 size={24} className="stroke-[2.5]" />
              </div>
            </div>
            <h2 className="font-display text-[20px] font-black text-on-surface dark:text-white leading-tight">
              Session Completed
            </h2>
            <p className="text-[12px] font-mono font-bold text-outline/50 uppercase tracking-widest mt-1 mb-6">
              {folder.name}
            </p>

            {/* Congratulatory message */}
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 dark:bg-white/[0.01] dark:border-white/[0.04] text-[13px] font-bold text-on-surface/90 dark:text-white/80 mb-6">
              {congrats}
            </div>

            {/* Score & XP Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {earnedXP > 0 && (
                <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4 text-center dark:border-amber-500/20">
                  <p className="text-[11px] font-mono font-bold text-amber-600/80 dark:text-[#fbbf24]/75">XP Earned</p>
                  <p className="font-display text-[26px] font-black text-amber-600 dark:text-[#fbbf24] mt-0.5">
                    +{earnedXP} XP
                  </p>
                </div>
              )}

              {quizResult && (
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-center dark:border-[#60a5fa]/20 dark:bg-[#60a5fa]/5">
                  <p className="text-[11px] font-mono font-bold text-primary/80 dark:text-[#60a5fa]/75">Accuracy</p>
                  <p className="font-display text-[26px] font-black text-primary dark:text-[#60a5fa] mt-0.5">
                    {quizResult.score}/{quizResult.total}
                  </p>
                </div>
              )}
            </div>

            {/* Item progress list */}
            <div className="grid grid-cols-2 gap-3.5 mb-6">
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.01] p-3 text-center dark:border-[#34d399]/10">
                <p className="font-display text-[18px] font-black text-emerald-600 dark:text-[#34d399]">
                  {ikCount}
                </p>
                <p className="text-[10px] font-mono font-bold text-outline/50 uppercase tracking-wider">I Know</p>
              </div>
              <div className="rounded-xl border border-red-500/10 bg-red-500/[0.01] p-3 text-center dark:border-red-500/15">
                <p className="font-display text-[18px] font-black text-red-500 dark:text-red-400">
                  {vaultCount}
                </p>
                <p className="text-[10px] font-mono font-bold text-outline/50 uppercase tracking-wider">Vaulted</p>
              </div>
            </div>

            <button
              onClick={backToFolders}
              className="block w-full h-11 rounded-xl bg-primary text-[13px] font-bold text-on-primary text-center hover:opacity-95 transition-all dark:bg-[#60a5fa] dark:text-[#0c1929] cursor-pointer"
            >
              Back to Folders
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ======== MCQ SCREEN ========
  if (!currentItem || !currentQuestion) return null;

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0a0a0b] transition-colors duration-300">
      <div className="section-wrap pt-6 pb-16">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={backToFolders}
            className="flex items-center gap-1.5 text-[12.5px] font-bold text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Hub
          </button>

          {/* Active streak flames */}
          <div className="flex items-center gap-3">
            {sessionStreak >= 3 && (
              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-lg text-[11px] font-black dark:bg-[#fbbf24]/10 dark:text-[#fbbf24] animate-bounce">
                <Flame size={12} className="fill-current" />
                <span>{sessionStreak} Streak</span>
              </div>
            )}
            <span className="text-[11px] font-mono font-bold text-outline/50">
              {pos} / {initialItems.length} complete
            </span>
          </div>
        </div>

        {/* Top Progress bar */}
        <ProgressBar
          current={pos}
          total={initialItems.length}
          showPercentage={false}
          color={folder.color === "tertiary" ? "primary" : folder.color}
        />

        {/* CSS 3D Flip Styles */}
        <style>{`
          .perspective-1000 {
            perspective: 1000px;
          }
          .transform-style-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
          .-rotate-y-180 {
            transform: rotateY(-180deg);
          }
          .rotate-y-0 {
            transform: rotateY(0deg);
          }
        `}</style>

        {/* Premium Interactive 3D Flipping Flashcard Container */}
        <div className="perspective-1000 mt-8 w-full max-w-xl mx-auto grid">
          
          {/* ============================================================
             FRONT FACE OF FLASHCARD (Question and Neutral Options)
             ============================================================ */}
          <div 
            className={`col-start-1 row-start-1 w-full rounded-[32px] border border-neutral-200/60 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-white/[0.04] dark:bg-[#121215] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col text-left transition-all duration-700 transform-style-3d backface-hidden ${
              answered ? "rotate-y-180 opacity-0 pointer-events-none" : "rotate-y-0 opacity-100"
            }`}
          >
            {/* Top color accent gradient */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${accentGradient}`} />

            {/* Flashcard Header / Front Metadata */}
            <div className="px-8 pt-6 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-outline/50 uppercase dark:text-white/30">
                Flashcard Front
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 dark:bg-white/[0.03] dark:text-white/50 uppercase tracking-wider">
                {folder.name}
              </span>
            </div>

            {/* Question Front-Face Section */}
            <div className="px-8 py-6 min-h-[110px] flex items-center justify-center bg-neutral-50/[0.01] dark:bg-white/[0.005] border-b border-neutral-100/50 dark:border-white/[0.02]">
              <h2 className="font-display text-[18px] md:text-[20px] font-black text-on-surface dark:text-white leading-relaxed text-center w-full">
                {currentQuestion.question}
              </h2>
            </div>

            {/* MCQ Option Chips Stack */}
            <div className="p-8 space-y-3.5">
              {(["a", "b", "c", "d"] as const).map((key) => {
                const optionText = currentQuestion.options[key];
                if (!optionText) return null;

                const cardClass = "border-neutral-200/70 bg-white text-on-surface hover:bg-neutral-50 hover:border-neutral-300 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-white dark:hover:bg-white/[0.04] dark:hover:border-white/[0.08]";
                const badgeClass = "border-neutral-300 bg-neutral-50 text-neutral-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/40";

                return (
                  <button
                    key={key}
                    onClick={() => handleOptionSelect(key)}
                    disabled={processing}
                    className={`w-full text-left p-4 rounded-2xl border text-[13.5px] font-semibold transition-all select-none cursor-pointer flex items-center gap-4 ${cardClass}`}
                  >
                    {/* Typographic Badge Circle */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border text-[11px] font-mono font-bold shrink-0 transition-colors ${badgeClass}`}>
                      {key.toUpperCase()}
                    </div>
                    <span className="flex-1 leading-relaxed pr-2">{optionText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ============================================================
             BACK FACE OF FLASHCARD (Result, Explanation & Action Items)
             ============================================================ */}
          <div 
            className={`col-start-1 row-start-1 w-full rounded-[32px] border border-neutral-200/60 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-white/[0.04] dark:bg-[#121215] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col text-left transition-all duration-700 transform-style-3d backface-hidden ${
              answered ? "rotate-y-0 opacity-100" : "-rotate-y-180 opacity-0 pointer-events-none"
            }`}
          >
            {/* Top color accent gradient */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${accentGradient}`} />

            {/* Flashcard Header / Back Metadata */}
            <div className="px-8 pt-6 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-outline/50 uppercase dark:text-white/30">
                Flashcard Back
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 dark:bg-white/[0.03] dark:text-white/50 uppercase tracking-wider">
                {folder.name}
              </span>
            </div>

            {/* Box 1: Context Question (Muted layout) */}
            <div className="mx-8 mt-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/40 dark:bg-white/[0.005] dark:border-white/[0.02]">
              <span className="text-[9px] font-mono font-bold text-outline/40 uppercase tracking-wider">Question Context</span>
              <p className="text-[13px] font-bold text-outline dark:text-white/70 leading-relaxed mt-1">
                {currentQuestion.question}
              </p>
            </div>

            {/* Box 2: Answer Comparison result */}
            <div className="px-8 pt-6 space-y-3.5">
                {isCorrectAnswer ? (
                  /* Correct Answer Layout: Just show what they chose in emerald */
                  <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] text-emerald-700 dark:border-[#34d399]/20 dark:bg-[#34d399]/5 dark:text-[#34d399] text-[13px] space-y-1">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60">You Chose</p>
                    <p className="font-bold flex items-start gap-1.5 leading-relaxed">
                      <span className="font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/25 uppercase text-[10px]">{selectedOption}</span>
                      <span>{currentQuestion.options[selectedOption!]}</span>
                    </p>
                  </div>
                ) : (
                  /* Incorrect Answer Layout: Vertical stack of choice and correct answer */
                  <div className="space-y-3.5">
                    {/* User Selection Card (Red) */}
                    <div className="p-5 rounded-2xl border border-red-500/10 bg-red-500/[0.02] text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400 text-[13px] space-y-1">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60">You Chose</p>
                      <p className="font-bold flex items-start gap-1.5 leading-relaxed">
                        <span className="font-mono bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/25 uppercase text-[10px]">{selectedOption}</span>
                        <span>{currentQuestion.options[selectedOption!]}</span>
                      </p>
                    </div>

                    {/* Correct Card (Green) */}
                    <div className="p-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.02] text-emerald-700 dark:border-[#34d399]/20 dark:bg-[#34d399]/5 dark:text-[#34d399] text-[13px] space-y-1">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60">Correct Answer</p>
                      <p className="font-bold flex items-start gap-1.5 leading-relaxed">
                        <span className="font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/25 uppercase text-[10px]">{currentQuestion.answer}</span>
                        <span>{currentQuestion.options[currentQuestion.answer as "a" | "b" | "c" | "d"]}</span>
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {/* Box 3: Concept core meaning details */}
            <div className="px-8 pt-4">
              <div className="p-5 rounded-2xl bg-neutral-50/50 border border-neutral-200/50 dark:bg-white/[0.01] dark:border-white/[0.04]">
                <p className="text-[10px] font-mono font-bold text-outline/50 uppercase tracking-widest mb-3">
                  Concept Definition
                </p>

                {/* Vocabulary phonetic blocks */}
                {typeof currentItem.data.pronunciation === "string" && currentItem.data.pronunciation && (
                  <div className="flex items-baseline gap-1.5 flex-wrap mb-2.5">
                    <span className="text-[15px] font-black text-primary dark:text-[#60a5fa]">{currentItem.data.word as string}</span>
                    <span className="text-[11px] font-mono font-bold text-outline/65">({currentItem.data.part_of_speech as string})</span>
                    <span className="text-[11.5px] font-mono text-outline/45">/ {currentItem.data.pronunciation as string} /</span>
                  </div>
                )}

                {typeof currentItem.data.hindi_meaning === "string" && currentItem.data.hindi_meaning && (
                  <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-lg text-[12px] font-black dark:bg-[#34d399]/15 dark:text-[#34d399] mb-3">
                    <CornerDownRight size={11} className="stroke-[2.5]" />
                    <span>{currentItem.data.hindi_meaning as string}</span>
                  </div>
                )}

                <p className="text-[13px] font-medium leading-relaxed text-on-surface/90 dark:text-white/80">
                  {(currentItem.data.explanation as string) || (currentItem.data.meaning as string) || (currentItem.data.meaning1 as string) || "Refer to details below."}
                </p>

                {/* Homonyms comparison blocks */}
                {typeof currentItem.data.word1 === "string" && currentItem.data.word1 && (
                  <div className="mt-3.5 space-y-3.5 border-t border-outline-variant/10 dark:border-white/[0.03] pt-3.5 text-[12.5px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-emerald-600 dark:text-[#34d399] font-black">{currentItem.data.word1 as string} ({currentItem.data.pos1 as string})</span>
                      <span className="text-outline dark:text-white/60 leading-relaxed">{currentItem.data.meaning1 as string}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-indigo-600 dark:text-[#60a5fa] font-black">{currentItem.data.word2 as string} ({currentItem.data.pos2 as string})</span>
                      <span className="text-outline dark:text-white/60 leading-relaxed">{currentItem.data.meaning2 as string}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Box 4: Usage Examples box */}
            {typeof currentItem.data.example === "string" && currentItem.data.example && (
              <div className="px-8 pt-4">
                <div className="p-4 rounded-2xl bg-neutral-50/20 border border-neutral-200/30 dark:bg-white/[0.005] dark:border-white/[0.02] border-l-4 border-l-primary/60 dark:border-l-l-[#60a5fa]/60">
                  <p className="text-[9px] font-mono font-bold text-outline/40 uppercase tracking-wider mb-1">Sentence Example</p>
                  <p className="text-[12px] italic text-outline/80 dark:text-white/50 leading-relaxed">
                    &ldquo;{currentItem.data.example as string}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* Box 5: Capsule Actions segment */}
            <div className="p-8 pt-4">
              <div className="flex flex-col gap-3">
                {isCorrectAnswer ? (
                  <>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleCorrectAction("dont_know")}
                        disabled={processing}
                        className="flex-1 h-11 rounded-xl border border-neutral-300 bg-transparent text-[12.5px] font-bold text-neutral-600 hover:bg-neutral-50 active:scale-[0.98] transition-all cursor-pointer dark:border-white/10 dark:text-white/60 dark:hover:bg-white/[0.04]"
                      >
                        I Don&apos;t Know
                      </button>
                      <button
                        onClick={() => handleCorrectAction("vault")}
                        disabled={processing}
                        className="flex-1 h-11 rounded-xl border border-amber-500/30 bg-amber-500/5 text-[12.5px] font-bold text-amber-600 hover:bg-amber-500/10 active:scale-[0.98] flex items-center justify-center gap-1.5 transition-all cursor-pointer dark:border-amber-500/20 dark:text-[#fbbf24] dark:bg-amber-500/10"
                      >
                        <Star size={13} className="fill-current" />
                        Vault
                      </button>
                    </div>
                    <button
                      onClick={() => handleCorrectAction("mastered")}
                      disabled={processing}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-[13px] font-bold text-white hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer dark:from-[#34d399] dark:to-[#059669] dark:text-[#022c22]"
                    >
                      Got It (Mastered)
                      <Zap size={11} className="fill-current" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNextCard}
                    disabled={processing}
                    className="w-full h-11 rounded-xl bg-primary text-[13px] font-bold text-on-primary hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer dark:bg-[#60a5fa] dark:text-[#0c1929]"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
