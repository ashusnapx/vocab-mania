// ============================================================
// WHY WE'RE BEST — Research-backed page content
// ============================================================

export const WHY_BEST = {
  hero: {
    tag: "Evidence-Based Learning",
    headline: "Not another app. A learning system built on science.",
    subhead:
      "Every feature in Vocab Mania is grounded in peer-reviewed research from cognitive science, memory research, and behavioral psychology. We didn't copy Duolingo or Anki — we built on 100+ research papers to create something the SSC exam world has never seen.",
  },

  problem: {
    tag: "The Problem",
    headline: "Why traditional vocabulary learning fails",
    subhead:
      "90% of SSC aspirants struggle with vocabulary. Not because they're not smart — but because the tools they use work against how their brains actually learn.",
    reasons: [
      {
        title: "Passive reading doesn't create memories",
        description:
          "Blackbook-style word lists ask you to read definitions. But reading is recognition, not recall. Your brain needs to actively retrieve information to strengthen memory — not just see it.",
        stat: "67%",
        statLabel: "forgotten within 24 hours of passive reading",
        source: "Ebbinghaus, 1885",
      },
      {
        title: "Cramming destroys long-term retention",
        description:
          "Studying 200 words in one sitting feels productive. But massed practice produces fragile memories that decay within days. Your brain needs spacing to consolidate vocabulary.",
        stat: "85%",
        statLabel: "better retention with spaced practice vs cramming",
        source: "Cepeda et al., 2006 (meta-analysis, d = 0.85)",
      },
      {
        title: "Recognition isn't the same as recall",
        description:
          "Quiz apps show you a word and ask 'do you know this?' That's recognition. Exams test recall — can you produce the meaning from memory? These are fundamentally different cognitive processes.",
        stat: "2-3x",
        statLabel: "more effective when testing recall vs recognition",
        source: "Nakata et al., 2021",
      },
      {
        title: "20,000 word lists create overwhelm",
        description:
          "When everything feels important, nothing feels achievable. Students need to know exactly which words matter, why they matter, and in what order to learn them.",
        stat: "3,000",
        statLabel: "words cover 95% of SSC exam content",
        source: "Nation, 2006; Beck et al., 2002",
      },
    ],
  },

  science: {
    tag: "The Science",
    headline: "15 principles. 100+ papers. One system.",
    subhead:
      "We distilled decades of cognitive science research into a learning engine that works with your brain, not against it.",
    principles: [
      {
        number: "01",
        title: "Spaced Repetition",
        description:
          "Reviews at expanding intervals — not tomorrow, then in 3 days, then in 7 days — calibrated to YOUR forgetting curve.",
        impact: "d = 0.85 (large effect)",
        source: "Cepeda et al., 2006",
        color: "primary" as const,
      },
      {
        number: "02",
        title: "Active Retrieval",
        description:
          "Every interaction requires you to recall from memory before seeing the answer. The effort of remembering IS the learning.",
        impact: "Superior to re-study on delayed tests",
        source: "Roediger & Karpicke, 2006",
        color: "secondary" as const,
      },
      {
        number: "03",
        title: "Cumulative Testing",
        description:
          "Every quiz mixes new words with all previously learned material. 60-70% review, 30-40% new — always building on what you know.",
        impact: "2-3x more effective",
        source: "Nakata et al., 2021",
        color: "tertiary" as const,
      },
      {
        number: "04",
        title: "Interleaving",
        description:
          "Words from different categories, difficulty levels, and topics are mixed in every session — training your brain to discriminate.",
        impact: "d = 0.67-1.34",
        source: "Rohrer & Taylor, 2007; Firth et al., 2021",
        color: "primary" as const,
      },
      {
        number: "05",
        title: "Dual Coding",
        description:
          "Every word pairs with a visual association — creating two memory traces instead of one. Images bypass language barriers entirely.",
        impact: "25-40% improvement",
        source: "Paivio, 1986; Mayer & Moreno, 2003",
        color: "secondary" as const,
      },
      {
        number: "06",
        title: "Desirable Difficulties",
        description:
          "We don't make everything easy. Struggle during learning = strength during exams. The effort of recall is a feature, not a bug.",
        impact: "Better long-term retention",
        source: "Bjork & Bjork, 2011",
        color: "tertiary" as const,
      },
      {
        number: "07",
        title: "Elaborative Interrogation",
        description:
          "'Why does this word mean X?' — generating explanations forces deeper processing and creates additional retrieval pathways.",
        impact: "Significantly outperforms passive study",
        source: "Pressley et al., 1987",
        color: "primary" as const,
      },
      {
        number: "08",
        title: "Contextual Learning",
        description:
          "Words appear in real exam sentences before you see definitions. Inferring meaning from context builds stronger memories than flashcards alone.",
        impact: "Inference context > retrieval context",
        source: "van den Broek et al., 2022",
        color: "secondary" as const,
      },
      {
        number: "09",
        title: "Sleep Optimization",
        description:
          "Evening study → overnight consolidation → morning recall. Sleep literally strengthens vocabulary memories in your brain.",
        impact: "+8.6% retention with sleep",
        source: "Salfi et al., 2025",
        color: "tertiary" as const,
      },
      {
        number: "10",
        title: "Semantic Organization",
        description:
          "Words are grouped by meaning clusters — synonyms, antonyms, word families — mirroring how your brain actually stores vocabulary.",
        impact: "Taxonomic > thematic organization",
        source: "Hadley et al., 2019",
        color: "primary" as const,
      },
      {
        number: "11",
        title: "Frequency Prioritization",
        description:
          "SSC exam papers are analyzed. The 3,000 words that appear most often get priority. Study what matters, not random lists.",
        impact: "3,000 words = 95% exam coverage",
        source: "Beck et al., 2002; Coxhead, 2000",
        color: "secondary" as const,
      },
      {
        number: "12",
        title: "Chunking",
        description:
          "5-7 words per session, grouped meaningfully. Working memory holds ~4 chunks — we respect that limit while maximizing learning.",
        impact: "Within working memory capacity",
        source: "Cowan, 2001",
        color: "tertiary" as const,
      },
      {
        number: "13",
        title: "Metacognitive Monitoring",
        description:
          "Rate your confidence before seeing answers. We track your calibration accuracy — helping you know what you actually know vs what you think you know.",
        impact: "Overconfidence → underachievement",
        source: "Thiede et al., 2010",
        color: "primary" as const,
      },
      {
        number: "14",
        title: "Mastery Learning",
        description:
          "You don't move on until you've truly learned. Mastery = 3 correct recalls across spaced sessions. No shortcuts, no illusions.",
        impact: "90%+ achieve mastery with time",
        source: "Bloom, 1968; Guskey, 2007",
        color: "secondary" as const,
      },
      {
        number: "15",
        title: "Pretesting Effect",
        description:
          "Try to guess new words before learning them — even wrong guesses prime your brain for deeper encoding when the answer is revealed.",
        impact: "d = 0.35-0.75",
        source: "Hays et al., 2010; Kornell et al., 2009",
        color: "tertiary" as const,
      },
    ],
  },

  comparison: {
    tag: "Why We're Different",
    headline: "Vocab Mania vs everything else",
    subhead:
      "Most vocabulary tools optimize for engagement. We optimize for retention. Here's the difference.",
    competitors: [
      {
        name: "Blackbook",
        description: "20,000 word lists with no structure",
        problems: ["Overwhelming word lists", "No spaced repetition", "No progress tracking", "Passive reading only"],
      },
      {
        name: "Quiz Apps",
        description: "Gamified quizzes that feel like learning",
        problems: ["Recognition ≠ recall", "No cumulative testing", "No personalization", "Shallow gamification"],
      },
      {
        name: "Flashcard Apps",
        description: "Generic spaced repetition without context",
        problems: ["No exam-specific content", "No contextual learning", "No Hindi support", "No frequency prioritization"],
      },
      {
        name: "Vocab Mania",
        description: "Cognitive science made into a product",
        strengths: ["Spaced repetition engine", "Cumulative testing", "SSC-specific word lists", "Confidence calibration", "Bilingual presentation", "Mastery-based progression"],
        isUs: true,
      },
    ],
  },

  evidence: {
    tag: "The Evidence",
    headline: "Numbers that prove it works",
    stats: [
      {
        value: "100+",
        label: "Research papers",
        description: "Peer-reviewed studies from cognitive science, memory research, and educational psychology",
      },
      {
        value: "94%",
        label: "Target retention rate",
        description: "Our spaced repetition engine targets 90-95% retention — vs 30-40% with traditional methods",
      },
      {
        value: "67%",
        label: "Forgotten in 24h",
        description: "Without spaced repetition, students lose two-thirds of vocabulary within one day (Ebbinghaus, 1885)",
      },
      {
        value: "3x",
        label: "More effective",
        description: "Cumulative testing produces 2-3x better retention than noncumulative testing (Nakata et al., 2021)",
      },
      {
        value: "8.6%",
        label: "Boost from sleep",
        description: "Evening study with overnight consolidation improves retention by 8.6% (Salfi et al., 2025)",
      },
      {
        value: "66 days",
        label: "Habit formation",
        description: "Median time to form a daily learning habit — we design for this window (Lally et al., 2010)",
      },
    ],
  },

  cta: {
    headline: "Start learning with science, not luck",
    body: "Join thousands of SSC aspirants who stopped memorizing 20,000 words and started learning the right 3,000 — with a system that makes them stick.",
    primaryCta: { label: "Start learning free", href: "/signup" },
    secondaryCta: { label: "Read the full research", href: "#research" },
    info: "Free for the first 200 words. No credit card required.",
  },
} as const;
