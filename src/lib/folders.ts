import { Languages, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WORD_DATABASE } from "./words";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDistractors(excludeWord: string, field: "meaning" | "synonyms" | "antonyms") {
  const choices = WORD_DATABASE.filter(
    (w) => w.word !== excludeWord && (field === "meaning" ? !!w.meaning : (w[field] && w[field].length > 0))
  );
  const shuffledChoices = shuffleArray(choices);
  return shuffledChoices.slice(0, 3).map((w) => {
    if (field === "meaning") return w.meaning;
    if (field === "synonyms") return w.synonyms[0] || "None of these";
    return w.antonyms[0] || "None of these";
  });
}

// ============================================================
// FOLDER CONFIGURATION
// Add new folders here — everything else adapts automatically
// ============================================================

export interface FolderConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: "primary" | "secondary" | "tertiary";
  totalCount: number;
  dbTable: string;
  progressTable: string;
  progressIdField: string;
  questionTable: string | null;
  questionIdField: string | null;
  /** DB columns to fetch for flashcard display */
  selectFields: string;
  /** Generate quiz questions from item rows (for folders without a question table) */
  questionGenerator?: (row: Record<string, unknown>) => FolderQuestion[];
}

export const FOLDERS: FolderConfig[] = [
  {
    id: "idioms",
    name: "Top 300 Idioms",
    description: "Common expressions and their meanings",
    icon: BookOpen,
    color: "tertiary",
    totalCount: 299,
    dbTable: "idioms",
    progressTable: "user_idiom_progress",
    progressIdField: "idiom_id",
    questionTable: "idiom_questions",
    questionIdField: "idiom_id",
    selectFields: "id, idiom, meaning, hindi, type",
  },
  {
    id: "homonyms",
    name: "Top 300 Homonyms",
    description: "Same spelling, different meanings",
    icon: Languages,
    color: "primary",
    totalCount: 299,
    dbTable: "homonym_pairs",
    progressTable: "user_homonym_progress",
    progressIdField: "pair_id",
    questionTable: "homonym_questions",
    questionIdField: "pair_id",
    selectFields: "id, word1, pos1, meaning1, hindi1, word2, pos2, meaning2, hindi2",
  },
  {
    id: "words",
    name: "150 Words",
    description: "Essential vocabulary for SSC",
    icon: BookOpen,
    color: "secondary",
    totalCount: 150,
    dbTable: "words",
    progressTable: "user_progress",
    progressIdField: "word_id",
    questionTable: null,
    questionIdField: null,
    selectFields:
      "id, word, pronunciation, part_of_speech, meaning, hindi_meaning, example, synonyms, antonyms, category",
    questionGenerator: (row) => {
      const wordId = row.id as string;
      const word = row.word as string;
      const meaning = (row.meaning as string) || "";
      const synonyms = (row.synonyms as string[]) || [];
      const antonyms = (row.antonyms as string[]) || [];

      const questions: FolderQuestion[] = [];

      // MCQ: What is the meaning of X?
      const meaningDistractors = getDistractors(word, "meaning");
      const meaningOptions = shuffleArray([meaning, ...meaningDistractors]);
      const meaningAnswerLetter = (["a", "b", "c", "d"] as const)[meaningOptions.indexOf(meaning)];

      questions.push({
        id: hashString(wordId),
        question: `What is the meaning of "${word}"?`,
        options: {
          a: meaningOptions[0],
          b: meaningOptions[1],
          c: meaningOptions[2],
          d: meaningOptions[3],
        },
        answer: meaningAnswerLetter,
        itemId: wordId,
      });

      // MCQ: Which is a synonym of X?
      if (synonyms.length > 0 && synonyms[0]) {
        const correctSynonym = synonyms[0];
        const synonymDistractors = getDistractors(word, "synonyms");
        const synonymOptions = shuffleArray([correctSynonym, ...synonymDistractors]);
        const synonymAnswerLetter = (["a", "b", "c", "d"] as const)[synonymOptions.indexOf(correctSynonym)];

        questions.push({
          id: hashString(wordId) + 1,
          question: `Which is a synonym of "${word}"?`,
          options: {
            a: synonymOptions[0],
            b: synonymOptions[1],
            c: synonymOptions[2],
            d: synonymOptions[3],
          },
          answer: synonymAnswerLetter,
          itemId: wordId,
        });
      }

      // MCQ: Which is an antonym of X?
      if (antonyms.length > 0 && antonyms[0]) {
        const correctAntonym = antonyms[0];
        const antonymDistractors = getDistractors(word, "antonyms");
        const antonymOptions = shuffleArray([correctAntonym, ...antonymDistractors]);
        const antonymAnswerLetter = (["a", "b", "c", "d"] as const)[antonymOptions.indexOf(correctAntonym)];

        questions.push({
          id: hashString(wordId) + 2,
          question: `Which is an antonym of "${word}"?`,
          options: {
            a: antonymOptions[0],
            b: antonymOptions[1],
            c: antonymOptions[2],
            d: antonymOptions[3],
          },
          answer: antonymAnswerLetter,
          itemId: wordId,
        });
      }

      return questions;
    },
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getFolderById(id: string): FolderConfig | undefined {
  return FOLDERS.find((f) => f.id === id);
}

// ============================================================
// SESSION ITEM — what the learn page works with
// ============================================================

export type SessionItem = {
  id: string | number;
  /** Raw DB row — passed to flashcard components */
  data: Record<string, unknown>;
};

// ============================================================
// QUESTION FORMAT — quiz questions
// ============================================================

export type FolderQuestion = {
  id: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  answer: string;
  itemId: string | number;
};
