import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });

import { WORD_DATABASE } from "../src/lib/words";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

async function seed() {
  console.log(`Seeding ${WORD_DATABASE.length} words into public.words...`);

  for (let i = 0; i < WORD_DATABASE.length; i += 50) {
    const batch = WORD_DATABASE.slice(i, i + 50).map((w) => ({
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

    const res = await fetch(`${SUPABASE_URL}/rest/v1/words`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Batch ${i}-${i + batch.length} failed (${res.status}):`, body);
    } else {
      console.log(`  Upserted ${Math.min(i + 50, WORD_DATABASE.length)}/${WORD_DATABASE.length}`);
    }
  }

  console.log("Done!");
}

seed();
