// ============================================================
// VOCAB MANIA — Single source of truth
// ============================================================

export const APP_NAME = "Vocab Mania";
export const APP_DESCRIPTION =
  "Vocab Mania — SSC, CAT aur sabhi competitive exams ke liye vocabulary mastery platform.";

// ---------- NAVIGATION ----------
export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Kaise Kaam Karta Hai", href: "#how-it-works" },
  { label: "Why Us", href: "/why-we-are-best" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export const NAV_CTA = { label: "Shuru Karo", href: "/signup" };

// ---------- HERO ----------
export const HERO = {
  tag: "Aspirants ke liye banaya gaya",
  headline: "Har word yaad karo, har exam jeeto.",
  subhead:
    "Spaced repetition, adaptive quizzes aur mnemonic system — SSC, CAT aur har competitive exam ke liye. Ratta mat lagao, samajh ke padho.",
  primaryCta: { label: "Abhi Free Shuru Karo", href: "/signup" },
  secondaryCta: { label: "Kaise kaam karta hai?", href: "#how-it-works" },
  info: "Bilkul free hai. Credit card ki zaroorat nahi.",
};

// ---------- STATS ----------
export const STATS = [
  { label: "Words Mastered", value: 12400, suffix: "+", delta: "sabhi users ne" },
  { label: "Active Learners", value: 8200, suffix: "+", delta: "is mahine" },
  { label: "Retention Rate", value: 94, suffix: "%", delta: "30 din baad" },
  { label: "Exams Covered", value: 24, suffix: "", delta: "aur badh rahe hain" },
];

// ---------- FEATURES ----------
export const FEATURES = {
  tag: "Kya Milega Aapko",
  headline: "Woh sab kuch jo aapko chahiye",
  subhead:
    "Vocab Mania sirf flashcards nahi hai — yeh ek complete vocabulary mastery system hai.",
  items: [
    {
      title: "Spaced Repetition Engine",
      description:
        "Scientifically tuned algorithm — aap bhulne wale ho tabhi word wapas aata hai. Kam padho, zyada yaad karo.",
      icon: "schedule",
    },
    {
      title: "Mnemonic System",
      description:
        "Har word ke saath ek yaad rakhne wali kahani, visual cue, ya association. Months tak yaad rahega, days nahi.",
      icon: "auto_awesome",
    },
    {
      title: "Adaptive Quizzes",
      description:
        "Quizzes jo aapke level ke hisaab se hard ya easy hoti hain. Har session mein improvement dikhegi.",
      icon: "quiz",
    },
    {
      title: "PYQ-Aligned Word Lists",
      description:
        "Words exam, frequency aur year ke hisaab se tagged hain — jo actually aata hai wahi padho, random lists nahi.",
      icon: "school",
    },
    {
      title: "Mastery Dashboard",
      description:
        "Word-level mastery scores, streak data aur exam-readiness predictions — sab ek jagah dikhega.",
      icon: "analytics",
    },
    {
      title: "Memory Vault",
      description:
        "Confusing words ko star karo, unhe vault mein daal do. Exam se pehle sirf vault revise karo — sorted revision.",
      icon: "emoji_events",
    },
  ],
};

// ---------- HOW IT WORKS ----------
export const HOW_IT_WORKS = {
  tag: "Kaise Kaam Karta Hai",
  headline: "Bas 3 steps mein word mastery",
  subhead:
    "Koi clutter nahi, koi complexity nahi — bas ek clear path unknown se mastered tak.",
  steps: [
    {
      number: "01",
      title: "Apna exam choose karo",
      description:
        "SSC CGL, CAT, GRE — jo bhi exam de rahe ho, word list instantly load ho jayegi.",
    },
    {
      number: "02",
      title: "Mnemonics se seekho",
      description:
        "Har word ke saath mnemonic, usage examples aur etymology. Memory techniques jo aapke brain ke hisaab se kaam karti hain.",
    },
    {
      number: "03",
      title: "Repetition se master karo",
      description:
        "Engine bilkul sahi time pe revision schedule karega. Kam words review karo, zyada yaad karo.",
    },
  ],
};

// ---------- TESTIMONIALS ----------
export const TESTIMONIALS = [
  {
    name: "Anish Kumar",
    role: "SSC CGL Candidate",
    stat: "135/135 in English",
    content:
      "Homonyms ki spelling traps bahut helpful thi. Standard books itna challenge nahi karte jitna Vocab Mania karta hai. Final week mein vault se revision minutes mein ho gayi.",
  },
  {
    name: "Preeti Verma",
    role: "Bank PO Aspirant",
    stat: "820+ Words Mastered",
    content:
      "Streak calendar dekh ke roz subah padhne ka mann karta hai. Level upgrade hona bahut satisfying feel hota hai — Saksham se Acharya tak pahuncha.",
  },
  {
    name: "Shivam Singh",
    role: "NDA Candidate",
    stat: "96.4% Quiz Accuracy",
    content:
      "300+ idioms with Hindi meanings — yeh bahut brilliant hai. Flashcards aur quizzes dono fast aur effective hain. PDFs padhne se 10x better hai.",
  },
];

// ---------- PRICING ----------
export const PRICING = {
  tag: "Pricing",
  headline: "Simple, honest pricing",
  subhead: "Free se shuru karo. Jab ready ho jao tab upgrade karo.",
  tiers: [
    {
      name: "Basic Starter",
      price: "₹0",
      period: "forever",
      description: "Roz ka vocabulary practice ke liye",
      features: [
        "15 items per session",
        "300+ idioms library",
        "Basic spelling tests",
        "Limited Memory Vault",
      ],
      cta: { label: "Sign Up Free", href: "/signup" },
      highlighted: false,
    },
    {
      name: "Exam Pro",
      price: "₹199",
      period: "/month",
      description: "Serious aspirants ke liye full access",
      features: [
        "Unlimited cards per session",
        "Full mnemonics library",
        "All 24 exam word lists",
        "Adaptive quizzes",
        "Infinite Vault capacity",
        "Advanced analytics dashboard",
      ],
      cta: { label: "Pro Access Lo", href: "/signup?plan=pro" },
      highlighted: true,
    },
  ],
};

// ---------- FAQ ----------
export const FAQ = {
  tag: "FAQ",
  headline: "Sawal jo aate hain sabke mann mein",
  items: [
    {
      q: "Free plan mein kya milta hai?",
      a: "Free plan mein 200 words, basic spaced repetition, 1 exam word list aur community access milta hai. Roz 15 words tak padh sakte ho. Jab zyada chahiye tab Pro plan le sakte ho — 7-day free trial ke saath.",
    },
    {
      q: "Spaced repetition actually kaam karta hai kya?",
      a: "Haan. Jab aap flashcards dekhte ho aur words ko 'I Know' mark karte ho, system unhe increasing intervals pe schedule karta hai. Jaise pehle 1 din baad, phir 3 din, phir 7 din. Isliye aap bhulne wale ho tabhi word wapis aata hai — permanently yaad ho jata hai.",
    },
    {
      q: "Homonyms aur idioms kyun already unlocked hain?",
      a: "Standard vocabulary words ke liye dynamic quizzes generate hote hain — jo naye hoti hain har baar. But homonyms aur idioms ke liye fixed database hai. Isliye unhe seed kar diya gaya hai taaki aap seedha padh sako bina kisi wait ke.",
    },
    {
      q: "Level aur rank kaise kaam karta hai?",
      a: "Aapke XP (experience points) ke basis pe level calculate hota hai. Jitna zyada padhoge aur quizzes doge, utna zyada XP milega. Levels hain — Prarambhik, Saksham, Praveen, Daksh, Acharya, Maharathi. Har level pe naya badge aur recognition milega.",
    },
    {
      q: "Mobile pe chalega?",
      a: "Haan. Vocab Mania ek Progressive Web App hai — phone ke browser mein kholog toh app jaisa experience milega. Install bhi kar sakte ho home screen se. Offline mode bhi hai, baad mein sync ho jayega.",
    },
  ],
};

// ---------- CTA ----------
export const CTA = {
  headline: "Vocab Mania se shuru karo aaj se",
  body: "8,200+ aspirants already vocabulary build kar rahe hain. Ab aapki baari hai.",
  primaryCta: { label: "Abhi Free Shuru Karo", href: "/signup" },
  secondaryCta: { label: "Pricing Dekho", href: "#pricing" },
};

// ---------- FOOTER ----------
export const FOOTER = {
  tagline: "Aspirants ke liye vocabulary mastery platform.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Changelog", href: "#" },
        { label: "Roadmap", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "#" },
        { label: "Word of the Day", href: "#" },
        { label: "Community", href: "#" },
        { label: "Study Guides", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/why-we-are-best" },
        { label: "Contact", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} Vocab Mania. All rights reserved.`,
};
