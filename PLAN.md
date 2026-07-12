# Steep Design System — Implementation Plan

## Overview
Implement the "Steep" design system (serif analytics on warm paper) for Vocab Mania using Next.js 16 + Tailwind CSS v4 + shadcn/ui.

## Phase 1: Project Scaffolding
1. Initialize Next.js 16 with App Router, TypeScript, Tailwind CSS v4
2. Install dependencies: `motion`, `lucide-react`, `zustand`, `zod`
3. Set up `shadcn/ui` with the `new-york` style, neutral base
4. Configure `tsconfig.json` path aliases (`@/`)

## Phase 2: Tailwind v4 Theme — Steep Tokens
Create `app/globals.css` with `@theme` block containing:

### Colors
- `ink-black: #17191c` (primary text, CTAs)
- `paper-white: #ffffff` (canvas, card surfaces)
- `mist-gray: #f2f2f3` (card backgrounds, secondary)
- `fog-white: #fafafb` (alternating sections)
- `slate-gray: #777b86` (links, muted text)
- `ash-gray: #979799` (tertiary labels, tags)
- `smoke-gray: #a3a6af` (placeholders, disabled)
- `blush-peach: #fbe1d1` (accent cards — rare, max 1/page)
- `sienna-brown: #5d2a1a` (text on peach, chart strokes)

### Typography
- `--font-signifier`: Georgia/system serif (for H1/H2 only, weight 400)
- `--font-sohne`: Inter/system-ui (body, UI, nav)
- Type scale: caption(15), body(17), body-lg(20), subheading(22), heading-sm(26), heading(44), heading-lg(64), display(90)
- Weights: 400, 430, 450, 480, 500

### Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 64, 80, 96, 124, 128, 160

### Border Radius
- cards: 24px, images: 12px, inputs: 16px, buttons: 9999px, smallCards: 16px, elevatedCards: 20px

### Shadows
- subtle, subtle-2, subtle-3 (barely-there, ~10% opacity)

### Layout
- max-width: 1200px, section-gap: 80px, card-padding: 20px

## Phase 3: shadcn/ui Customization
Override shadcn defaults to use Steep tokens:
- `--primary`: ink-black
- `--background`: paper-white
- `--card`: mist-gray
- `--accent`: blush-peach
- `--muted`: slate-gray
- Button variants mapped to Pill Filled / Pill Ghost
- Card component mapped to Neutral Card / Accent Peach Card

## Phase 4: Core Components

### 4a. Navigation Bar
- Transparent top bar (no bg, no border, no shadow)
- Logo left, nav links center, CTAs right
- Nav links: Sohne 16px weight 400, #17191c, no decoration

### 4b. Hero Section
- Display headline: 90px Signifier weight 400, #17191c, letter-spacing -2.25px
- Subhead: 17px Sohne weight 400, #777b86
- Pill button pair (filled + ghost) side by side
- Floating product artifact cards around the text (positioned with offsets)

### 4c. Card System
- **Neutral Card**: bg #f2f2f3, radius 24px, no shadow, no border
- **Accent Peach Card**: bg #fbe1d1, text #5d2a1a, radius 24px, max 1 per page
- **Floating Product Artifact**: bg #ffffff, radius 20px, subtle shadow, padding 16px 20px 12px 12px

### 4d. Button System
- **Pill Filled**: bg #17191c, text #ffffff, border-radius 9999px, padding 0 20px
- **Pill Ghost**: transparent bg, border 1px solid #17191c, text #17191c, border-radius 9999px
- **Text Link with Arrow**: no bg/border, text #17191c, Sohne 16px, arrow suffix →

### 4e. Input / Composer
- bg #ffffff, border 1px solid #ececec, border-radius 16px, padding 16px
- Placeholder: "Ask anything…" in #a3a6af
- Left icons + right circular send button (40px, #17191c)

### 4f. Stat Card with Chart
- White floating artifact surface
- Bold metric: Sohne 20px weight 500 #17191c
- Delta line: Sohne 14px #777b86
- Minimal line chart in #5d2a1a stroke (no axes/gridlines)

### 4g. Tag / Category Label
- No bg/border, Sohne 14px weight 400 #979799
- Ghost-like typographic tags

## Phase 5: Page Layout
- `layout.tsx`: Root layout with transparent nav, max-width 1200px container
- `page.tsx`: Landing page with hero + feature sections
- Sections alternate Paper White / Fog White backgrounds
- 80px vertical gaps between sections
- 2-column text+UI layout for feature sections

## Phase 6: Responsive Design
- Mobile-first approach
- Floating artifacts collapse to stacked layout on mobile
- Nav becomes hamburger on mobile
- Type scales down appropriately

## Files to Create
```
vocab-mania/
├── app/
│   ├── globals.css          # Tailwind v4 theme + Steep tokens
│   ├── layout.tsx           # Root layout with nav
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # shadcn primitives (button, card, input)
│   ├── nav.tsx              # Navigation bar
│   ├── hero.tsx             # Hero section
│   ├── feature-card.tsx     # Neutral card
│   ├── accent-card.tsx      # Accent peach card
│   ├── floating-artifact.tsx # Floating product artifact
│   ├── stat-card.tsx        # Stat card with chart
│   ├── pill-button.tsx      # Pill button (filled + ghost)
│   ├── text-link.tsx        # Text link with arrow
│   ├── composer-input.tsx   # AI composer input
│   └── tag-label.tsx        # Category tag
├── lib/
│   └── utils.ts             # cn() helper
├── tailwind.config.ts       # (if needed for v4 compat)
├── next.config.ts
├── tsconfig.json
├── package.json
└── postcss.config.mjs
```

## Verification
1. `npm run build` — no errors
2. `npm run dev` — visual inspection of all components
3. Check all Steep tokens are applied correctly
4. Verify responsive behavior at 375px, 768px, 1200px breakpoints
