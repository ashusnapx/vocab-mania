import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { WORD_DATABASE } from "@/lib/words";

export async function POST() {
  const supabase = await createClient();

  const rows = WORD_DATABASE.map((w) => ({
    id: w.id,
    word: w.word,
    pronunciation: w.pronunciation,
    part_of_speech: w.partOfSpeech,
    meaning: w.meaning,
    hindi_meaning: w.hindiMeaning,
    example: w.example,
    synonyms: w.synonyms,
    antonyms: w.antonyms,
    root: w.root,
    category: w.category,
    difficulty: w.difficulty,
    frequency: w.frequency,
    years_asked: w.yearsAsked,
  }));

  // Upsert in batches of 50
  let inserted = 0;
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50);
    const { error } = await supabase.from("words").upsert(batch, { onConflict: "id" });
    if (error) {
      return NextResponse.json({ error: error.message, inserted }, { status: 500 });
    }
    inserted += batch.length;
  }

  return NextResponse.json({ ok: true, inserted });
}
