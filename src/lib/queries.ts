import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { generateId } from "@/lib/id";

const supabase = createClient();

// ============ PROFILE ============
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      return data;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Record<string, unknown>) => {
      if (!userId) return;
      await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}

// ============ PROGRESS ============
export function useProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["progress", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId);
      return data || [];
    },
    enabled: !!userId,
  });
}

// ============ MEMORY VAULT ============
export function useVault(userId: string | undefined) {
  return useQuery({
    queryKey: ["vault", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from("memory_vault")
        .select("word_id, added_at")
        .eq("user_id", userId)
        .order("added_at", { ascending: false });
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useAddToVault(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (wordId: string) => {
      if (!userId) return;
      await supabase.from("memory_vault").upsert({
        id: generateId(),
        user_id: userId,
        word_id: wordId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault", userId] });
    },
  });
}

export function useRemoveFromVault(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (wordId: string) => {
      if (!userId) return;
      await supabase
        .from("memory_vault")
        .delete()
        .eq("user_id", userId)
        .eq("word_id", wordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault", userId] });
    },
  });
}

// ============ LEARNING SESSIONS ============
export function useSessions(userId: string | undefined) {
  return useQuery({
    queryKey: ["sessions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from("learning_sessions")
        .select("*")
        .eq("user_id", userId)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false });
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useTodaySessions(userId: string | undefined) {
  return useQuery({
    queryKey: ["sessions", "today", userId],
    queryFn: async () => {
      if (!userId) return [];
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("learning_sessions")
        .select("words_correct, words_incorrect")
        .eq("user_id", userId)
        .gte("started_at", `${today}T00:00:00`)
        .not("completed_at", "is", null);
      return data || [];
    },
    enabled: !!userId,
  });
}

// ============ SESSION WORDS ============
export function useInsertSessionWord() {
  return useMutation({
    mutationFn: async (params: {
      sessionId: string;
      userId: string;
      wordId: string;
      action: string;
    }) => {
      await supabase.from("session_words").insert({
        id: generateId(),
        session_id: params.sessionId,
        user_id: params.userId,
        word_id: params.wordId,
        action: params.action,
      });
    },
  });
}

// ============ USER PROGRESS (per-word) ============
export function useUpsertProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      userId: string;
      wordId: string;
      action: "know" | "dont_know";
      existing?: {
        id: string;
        repetitions: number;
        ease_factor: number;
        interval: number;
        times_incorrect: number;
      };
    }) => {
      const { userId, wordId, action, existing } = params;

      if (action === "know") {
        if (existing) {
          const newReps = existing.repetitions + 1;
          const newInterval = Math.max(
            1,
            Math.round(existing.interval * existing.ease_factor)
          );
          const newEase = Math.max(1.3, existing.ease_factor + 0.1);
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
              times_correct: (existing as unknown as { times_correct: number }).times_correct + 1,
              status: newReps >= 3 ? "mastered" : "reviewing",
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          const nextReview = new Date();
          nextReview.setDate(nextReview.getDate() + 1);
          await supabase.from("user_progress").insert({
            id: generateId(),
            user_id: userId,
            word_id: wordId,
            status: "learning",
            repetitions: 1,
            interval: 1,
            next_review_at: nextReview.toISOString(),
            last_reviewed_at: new Date().toISOString(),
            times_correct: 1,
          });
        }
      } else {
        if (existing) {
          await supabase
            .from("user_progress")
            .update({
              repetitions: 0,
              interval: 0,
              next_review_at: new Date().toISOString(),
              last_reviewed_at: new Date().toISOString(),
              times_incorrect: existing.times_incorrect + 1,
              status: "learning",
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("user_progress").insert({
            id: generateId(),
            user_id: userId,
            word_id: wordId,
            status: "learning",
            repetitions: 0,
            interval: 0,
            next_review_at: new Date().toISOString(),
            last_reviewed_at: new Date().toISOString(),
            times_incorrect: 1,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}

// ============ CREATE SESSION ============
export function useCreateSession() {
  return useMutation({
    mutationFn: async (params: {
      userId: string;
      sessionType: string;
      wordsSeen: number;
    }) => {
      const id = generateId();
      const { data } = await supabase
        .from("learning_sessions")
        .insert({
          id,
          user_id: params.userId,
          session_type: params.sessionType,
          words_seen: params.wordsSeen,
        })
        .select("id")
        .single();
      return data;
    },
  });
}

// ============ COMPLETE SESSION ============
export function useCompleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      sessionId: string;
      wordsCorrect: number;
      wordsIncorrect: number;
      durationSeconds: number;
    }) => {
      await supabase
        .from("learning_sessions")
        .update({
          words_correct: params.wordsCorrect,
          words_incorrect: params.wordsIncorrect,
          duration_seconds: params.durationSeconds,
          completed_at: new Date().toISOString(),
        })
        .eq("id", params.sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

// ============ CLEAR ALL DATA ============
export function useClearAllData(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!userId) return;
      await Promise.all([
        supabase.from("user_progress").delete().eq("user_id", userId),
        supabase.from("memory_vault").delete().eq("user_id", userId),
        supabase.from("learning_sessions").delete().eq("user_id", userId),
        supabase.from("session_words").delete().eq("user_id", userId),
        supabase
          .from("profiles")
          .update({
            current_streak: 0,
            longest_streak: 0,
            last_active_date: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId),
      ]);
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

// ============ EXPORT DATA ============
export function useExportData(userId: string | undefined) {
  return useMutation({
    mutationFn: async () => {
      if (!userId) return null;
      const [progress, vault, sessions, profile] = await Promise.all([
        supabase.from("user_progress").select("*").eq("user_id", userId),
        supabase.from("memory_vault").select("*").eq("user_id", userId),
        supabase.from("learning_sessions").select("*").eq("user_id", userId),
        supabase.from("profiles").select("*").eq("id", userId).single(),
      ]);

      return {
        exported_at: new Date().toISOString(),
        profile: profile.data,
        progress: progress.data,
        vault: vault.data,
        sessions: sessions.data,
      };
    },
  });
}
