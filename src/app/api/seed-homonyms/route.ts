import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HOMONYM_PAIRS, HOMONYM_QUESTIONS } from "@/data/homonyms";

export async function POST() {
  const supabase = await createClient();

  // Seed pairs
  const pairRows = HOMONYM_PAIRS.map((p) => ({
    id: p.id,
    word1: p.word1,
    pos1: p.pos1,
    meaning1: p.meaning1,
    hindi1: p.hindi1,
    word2: p.word2,
    pos2: p.pos2,
    meaning2: p.meaning2,
    hindi2: p.hindi2,
  }));

  let pairsInserted = 0;
  for (let i = 0; i < pairRows.length; i += 50) {
    const batch = pairRows.slice(i, i + 50);
    const { error } = await supabase
      .from("homonym_pairs")
      .upsert(batch, { onConflict: "id" });
    if (error) {
      return NextResponse.json(
        { error: `pairs: ${error.message}`, pairsInserted },
        { status: 500 }
      );
    }
    pairsInserted += batch.length;
  }

  // Seed questions
  const questionRows = HOMONYM_QUESTIONS.map((q) => ({
    id: q.id,
    question: q.question,
    option_a: q.options.a,
    option_b: q.options.b,
    option_c: q.options.c,
    option_d: q.options.d,
    answer: q.answer,
    pair_id: q.pairId,
  }));

  let questionsInserted = 0;
  for (let i = 0; i < questionRows.length; i += 50) {
    const batch = questionRows.slice(i, i + 50);
    const { error } = await supabase
      .from("homonym_questions")
      .upsert(batch, { onConflict: "id" });
    if (error) {
      return NextResponse.json(
        { error: `questions: ${error.message}`, pairsInserted, questionsInserted },
        { status: 500 }
      );
    }
    questionsInserted += batch.length;
  }

  return NextResponse.json({ ok: true, pairsInserted, questionsInserted });
}
