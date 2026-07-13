import { writeFileSync } from "fs";
import { resolve } from "path";
import { HOMONYM_PAIRS, HOMONYM_QUESTIONS } from "../src/data/homonyms";

const OUTPUT_PATH = resolve(__dirname, "../supabase/seed-homonyms.sql");

function escapeSqlString(val: string | null | undefined): string {
  if (val === null || val === undefined) return "NULL";
  // Replace single quotes with two single quotes for SQL escaping
  const escaped = val.replace(/'/g, "''");
  return `'${escaped}'`;
}

function generate() {
  console.log("Generating seed-homonyms.sql...");
  let sql = `-- ============================================================
-- Seed Homonym Pairs and Questions
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 0. Clean existing data to ensure a completely fresh recreation
DELETE FROM public.homonym_questions;
DELETE FROM public.homonym_pairs;

-- 1. Update check constraint on user_progress to support vaulted status for words
ALTER TABLE public.user_progress DROP CONSTRAINT IF EXISTS user_progress_status_check;
ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_status_check CHECK (status in ('new', 'learning', 'reviewing', 'mastered', 'vaulted'));

`;

  // 1. Homonym Pairs
  sql += `-- 1. Insert Homonym Pairs (${HOMONYM_PAIRS.length} items)\n`;
  sql += `INSERT INTO public.homonym_pairs (id, word1, pos1, meaning1, hindi1, word2, pos2, meaning2, hindi2)\nVALUES\n`;

  const pairValues = HOMONYM_PAIRS.map((p) => {
    return `  (${p.id}, ${escapeSqlString(p.word1)}, ${escapeSqlString(p.pos1)}, ${escapeSqlString(
      p.meaning1
    )}, ${escapeSqlString(p.hindi1)}, ${escapeSqlString(p.word2)}, ${escapeSqlString(
      p.pos2
    )}, ${escapeSqlString(p.meaning2)}, ${escapeSqlString(p.hindi2)})`;
  });

  sql += pairValues.join(",\n") + "\nON CONFLICT (id) DO UPDATE SET\n" +
    "  word1 = EXCLUDED.word1, pos1 = EXCLUDED.pos1, meaning1 = EXCLUDED.meaning1, hindi1 = EXCLUDED.hindi1,\n" +
    "  word2 = EXCLUDED.word2, pos2 = EXCLUDED.pos2, meaning2 = EXCLUDED.meaning2, hindi2 = EXCLUDED.hindi2;\n\n";

  // 2. Homonym Questions
  sql += `-- 2. Insert Homonym Questions (${HOMONYM_QUESTIONS.length} items)\n`;
  sql += `INSERT INTO public.homonym_questions (id, question, option_a, option_b, option_c, option_d, answer, pair_id)\nVALUES\n`;

  const questionValues = HOMONYM_QUESTIONS.map((q) => {
    return `  (${q.id}, ${escapeSqlString(q.question)}, ${escapeSqlString(
      q.options.a
    )}, ${escapeSqlString(q.options.b)}, ${escapeSqlString(q.options.c)}, ${escapeSqlString(
      q.options.d
    )}, ${escapeSqlString(q.answer)}, ${q.pairId})`;
  });

  sql += questionValues.join(",\n") + "\nON CONFLICT (id) DO UPDATE SET\n" +
    "  question = EXCLUDED.question, option_a = EXCLUDED.option_a, option_b = EXCLUDED.option_b,\n" +
    "  option_c = EXCLUDED.option_c, option_d = EXCLUDED.option_d, answer = EXCLUDED.answer, pair_id = EXCLUDED.pair_id;\n";

  writeFileSync(OUTPUT_PATH, sql, "utf-8");
  console.log(`Successfully generated ${OUTPUT_PATH}`);
}

generate();
