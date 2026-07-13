import { HOMONYM_PAIRS, HOMONYM_QUESTIONS } from "../src/data/homonyms";

console.log("Checking HOMONYM_PAIRS for duplicate IDs...");
const pairIds = new Map<number, any[]>();
HOMONYM_PAIRS.forEach((p) => {
  if (!pairIds.has(p.id)) {
    pairIds.set(p.id, []);
  }
  pairIds.get(p.id)!.push(p);
});

let pairDupes = 0;
pairIds.forEach((list, id) => {
  if (list.length > 1) {
    console.log(`Duplicate Pair ID ${id}:`, list.map(p => `${p.word1}/${p.word2}`));
    pairDupes++;
  }
});

console.log("\nChecking HOMONYM_QUESTIONS for duplicate IDs...");
const questionIds = new Map<number, any[]>();
HOMONYM_QUESTIONS.forEach((q) => {
  if (!questionIds.has(q.id)) {
    questionIds.set(q.id, []);
  }
  questionIds.get(q.id)!.push(q);
});

let questionDupes = 0;
questionIds.forEach((list, id) => {
  if (list.length > 1) {
    console.log(`Duplicate Question ID ${id}:`, list.map(q => q.question.substring(0, 40) + "..."));
    questionDupes++;
  }
});

console.log(`\nPairs duplicates: ${pairDupes}, Questions duplicates: ${questionDupes}`);
