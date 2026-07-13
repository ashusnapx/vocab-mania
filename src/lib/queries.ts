import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { generateId } from "@/lib/id";
import { getQueryClient } from "@/lib/query-provider";
import type { FolderConfig, SessionItem, FolderQuestion } from "@/lib/folders";

const supabase = createClient();

export function invalidateProfile(userId: string) {
  getQueryClient().invalidateQueries({ queryKey: ["profile", userId] });
}

export function invalidateFolderStats(userId: string) {
  getQueryClient().invalidateQueries({ queryKey: ["folder-stats", userId] });
}

export function invalidateVaultedItems(userId: string, folderId: string) {
  getQueryClient().invalidateQueries({ queryKey: ["vaulted-items", userId, folderId] });
}

export function invalidateAll() {
  getQueryClient().clear();
}

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

// ============ FOLDER STATS ============
export type FolderStats = {
  total: number;
  mastered: number;
  vaulted: number;
  remaining: number;
};

export function useFolderStats(userId: string | undefined) {
  return useQuery({
    queryKey: ["folder-stats", userId],
    queryFn: async () => {
      if (!userId) return {} as Record<string, FolderStats>;
      const { FOLDERS } = await import("@/lib/folders");
      const stats: Record<string, FolderStats> = {};

      const folderQueries = FOLDERS.map(async (folder) => {
        // 1. Total count
        const { count: total } = await supabase
          .from(folder.dbTable)
          .select("id", { count: "exact", head: true });

        // 2. All progress for this user in this folder (single query)
        const { data: progressRows } = await supabase
          .from(folder.progressTable)
          .select(`${folder.progressIdField}, status`)
          .eq("user_id", userId);

        const mastered = (progressRows ?? []).filter(
          (r: { status: string }) => r.status === "mastered"
        ).length;
        const vaulted = (progressRows ?? []).filter(
          (r: { status: string }) => r.status === "vaulted"
        ).length;

        stats[folder.id] = {
          total: total ?? 0,
          mastered,
          vaulted,
          remaining: Math.max(0, (total ?? 0) - mastered - vaulted),
        };
      });

      await Promise.all(folderQueries);
      return stats;
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}

// ============ SESSION ITEMS (optimized) ============
// Fetches exactly N unlearned items + their questions in minimal DB calls
export async function fetchSessionItems(
  userId: string,
  folder: FolderConfig,
  count: number
): Promise<{ items: SessionItem[]; questions: FolderQuestion[] }> {
  // Parallel: fetch user progress + all static item IDs (very fast, ID-only)
  const [progressResult, allIdsResult] = await Promise.all([
    supabase
      .from(folder.progressTable)
      .select(`${folder.progressIdField}, status`)
      .eq("user_id", userId),
    supabase
      .from(folder.dbTable)
      .select("id")
  ]);

  const progressRows = progressResult.data || [];
  const allRows = allIdsResult.data || [];
  const allIds: (string | number)[] = allRows.map((r: any) => r.id as string | number);

  // Split progress into mastered and vaulted ID sets
  const masteredIds = new Set<string | number>();
  const vaultedIds = new Set<string | number>();
  for (const row of progressRows as any[]) {
    const itemId = row[folder.progressIdField] as string | number;
    if (row.status === "mastered") {
      masteredIds.add(itemId);
    } else if (row.status === "vaulted") {
      vaultedIds.add(itemId);
    }
  }

  // Filter: exclude mastered, prioritize vaulted
  const unmasteredIds = allIds.filter((id: string | number) => !masteredIds.has(id));
  const vaultedPool = unmasteredIds.filter((id: string | number) => vaultedIds.has(id));
  const newPool = unmasteredIds.filter((id: string | number) => !vaultedIds.has(id));

  // Select exactly N items
  const selectedIds: (string | number)[] = [];
  const shuffledVaulted = shuffleArray(vaultedPool);
  const shuffledNew = shuffleArray(newPool);

  // Take from vaulted first
  selectedIds.push(...shuffledVaulted.slice(0, count));
  // Fill remainder from new pool
  if (selectedIds.length < count) {
    const remainder = count - selectedIds.length;
    selectedIds.push(...shuffledNew.slice(0, remainder));
  }

  if (selectedIds.length === 0) {
    return { items: [], questions: [] };
  }

  // Fetch full details ONLY for selected IDs
  const { data: selectedDetails } = await supabase
    .from(folder.dbTable)
    .select(folder.selectFields)
    .in("id", selectedIds);

  // Shuffle selected details to randomize their presentation
  const finalRows = shuffleArray(selectedDetails || []);

  const items: SessionItem[] = finalRows.map((row: any) => ({
    id: row.id as string | number,
    data: row as Record<string, unknown>,
  }));

  // Generate questions
  let questions: FolderQuestion[] = [];

  if (folder.questionTable) {
    // Fetch pre-seeded questions for the selected items
    const { data: dbQuestions } = await supabase
      .from(folder.questionTable)
      .select("*")
      .in(folder.questionIdField!, selectedIds);

    questions = (dbQuestions ?? []).map((row: any) => ({
      id: row.id as number,
      question: row.question as string,
      options: {
        a: row.option_a as string,
        b: row.option_b as string,
        c: row.option_c as string,
        d: row.option_d as string,
      },
      answer: row.answer as string,
      itemId: row[folder.questionIdField!] as string | number,
    }));
  } else if (folder.questionGenerator) {
    // Generate from item data using central generator
    for (const item of items) {
      questions.push(...folder.questionGenerator(item.data));
    }
  }

  return { items, questions };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============ FOLDER SETTINGS ============
const SESSION_COUNTS_KEY = "vocab-mania-session-counts";

export function loadLocalSessionCounts(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SESSION_COUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalSessionCounts(counts: Record<string, number>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_COUNTS_KEY, JSON.stringify(counts));
}

export function useFolderSettings(userId: string | undefined) {
  return useQuery({
    queryKey: ["folder-settings", userId],
    queryFn: async () => {
      if (!userId) return {} as Record<string, number>;
      const { data } = await supabase
        .from("profiles")
        .select("folder_settings")
        .eq("id", userId)
        .single();
      return (data?.folder_settings as Record<string, number>) ?? {};
    },
    enabled: !!userId,
  });
}

export function useUpdateFolderSettings(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Record<string, number>) => {
      if (!userId) return;
      saveLocalSessionCounts(settings);
      await supabase
        .from("profiles")
        .update({ folder_settings: settings, updated_at: new Date().toISOString() })
        .eq("id", userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder-settings", userId] });
    },
  });
}

// ============ PROGRESS MUTATIONS ============

/** Mark item as mastered */
export function useMarkMastered() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      userId: string;
      folder: FolderConfig;
      itemId: string | number;
    }) => {
      const { userId, folder, itemId } = params;
      await supabase.from(folder.progressTable).upsert(
        {
          id: generateId(),
          user_id: userId,
          [folder.progressIdField]: itemId,
          status: "mastered",
          updated_at: new Date().toISOString(),
        },
        { onConflict: `user_id,${folder.progressIdField}` }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder-stats"] });
    },
  });
}

/** Mark item as vaulted */
export function useMarkVaulted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      userId: string;
      folder: FolderConfig;
      itemId: string | number;
    }) => {
      const { userId, folder, itemId } = params;
      await supabase.from(folder.progressTable).upsert(
        {
          id: generateId(),
          user_id: userId,
          [folder.progressIdField]: itemId,
          status: "vaulted",
          updated_at: new Date().toISOString(),
        },
        { onConflict: `user_id,${folder.progressIdField}` }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder-stats"] });
    },
  });
}

// ============ SESSION ============

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

      // Update streak
      const today = new Date().toISOString().split("T")[0];
      const { data: session } = await supabase
        .from("learning_sessions")
        .select("user_id")
        .eq("id", params.sessionId)
        .single();

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("current_streak, longest_streak, last_active_date")
          .eq("id", session.user_id)
          .single();

        if (profile) {
          const lastDate = profile.last_active_date;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          let newStreak = profile.current_streak || 0;
          if (lastDate === today) {
            // Already active today, no change
          } else if (lastDate === yesterdayStr) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }

          await supabase
            .from("profiles")
            .update({
              current_streak: newStreak,
              longest_streak: Math.max(newStreak, profile.longest_streak || 0),
              last_active_date: today,
              updated_at: new Date().toISOString(),
            })
            .eq("id", session.user_id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// ============ XP ============

export function useAwardXP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { userId: string; xp: number; reason?: string; metadata?: any }) => {
      if (params.xp <= 0) return null;
      const { data, error } = await supabase.rpc("award_user_xp", {
        p_user_id: params.userId,
        p_amount: params.xp,
        p_reason: params.reason || "LEARN_SESSION",
        p_metadata: params.metadata || {},
      });
      if (error) throw new Error(error.message || "Failed to award XP");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// ============ SESSIONS ============

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

// ============ MASTERED ITEMS (for progress page) ============

export function useMasteredItems(userId: string | undefined, folder: FolderConfig | null) {
  return useQuery({
    queryKey: ["mastered-items", userId, folder?.id],
    queryFn: async () => {
      if (!userId || !folder) return [];
      const { data: progressRows } = await supabase
        .from(folder.progressTable)
        .select(folder.progressIdField)
        .eq("user_id", userId)
        .eq("status", "mastered");

      const ids = (progressRows ?? []).map(
        (r: Record<string, unknown>) => r[folder.progressIdField] as string | number
      );
      if (ids.length === 0) return [];

      const { data: items } = await supabase
        .from(folder.dbTable)
        .select(folder.selectFields)
        .in("id", ids);

      return (items ?? []) as Record<string, unknown>[];
    },
    enabled: !!userId && !!folder,
  });
}

export function useVaultedItems(userId: string | undefined, folder: FolderConfig | null) {
  return useQuery({
    queryKey: ["vaulted-items", userId, folder?.id],
    queryFn: async () => {
      if (!userId || !folder) return [];
      const { data: progressRows } = await supabase
        .from(folder.progressTable)
        .select(folder.progressIdField)
        .eq("user_id", userId)
        .eq("status", "vaulted");

      const ids = (progressRows ?? []).map(
        (r: Record<string, unknown>) => r[folder.progressIdField] as string | number
      );
      if (ids.length === 0) return [];

      const { data: items } = await supabase
        .from(folder.dbTable)
        .select(folder.selectFields)
        .in("id", ids);

      return (items ?? []) as Record<string, unknown>[];
    },
    enabled: !!userId && !!folder,
  });
}

// ============ CLEAR ALL DATA ============
export function useClearAllData(userId: string | undefined) {
  return useMutation({
    mutationFn: async () => {
      if (!userId) return;
      await Promise.all([
        supabase.from("user_progress").delete().eq("user_id", userId),
        supabase.from("user_homonym_progress").delete().eq("user_id", userId),
        supabase.from("user_idiom_progress").delete().eq("user_id", userId),
        supabase.from("learning_sessions").delete().eq("user_id", userId),
        supabase
          .from("profiles")
          .update({
            current_streak: 0,
            longest_streak: 0,
            last_active_date: null,
            xp: 0,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId),
      ]);
    },
    onSuccess: () => {
      getQueryClient().clear();
    },
  });
}

// ============ EXPORT DATA ============
export function useExportData(userId: string | undefined) {
  return useMutation({
    mutationFn: async () => {
      if (!userId) return null;
      const [progress, homonymProgress, idiomProgress, sessions, profile] = await Promise.all([
        supabase.from("user_progress").select("*").eq("user_id", userId),
        supabase.from("user_homonym_progress").select("*").eq("user_id", userId),
        supabase.from("user_idiom_progress").select("*").eq("user_id", userId),
        supabase.from("learning_sessions").select("*").eq("user_id", userId),
        supabase.from("profiles").select("*").eq("id", userId).single(),
      ]);

      return {
        exported_at: new Date().toISOString(),
        profile: profile.data,
        progress: progress.data,
        homonym_progress: homonymProgress.data,
        idiom_progress: idiomProgress.data,
        sessions: sessions.data,
      };
    },
  });
}
