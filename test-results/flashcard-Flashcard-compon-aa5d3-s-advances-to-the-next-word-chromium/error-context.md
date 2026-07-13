# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flashcard.spec.ts >> Flashcard component >> clicking 'Know This' advances to the next word
- Location: e2e/flashcard.spec.ts:56:7

# Error details

```
Error: Channel closed
```

```
Error: page.goto: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | const TEST_EMAIL = "ashu@gmail.com";
  4   | const TEST_PASSWORD = "Hello@12345";
  5   | 
  6   | /* ── helpers ─────────────────────────────────────────────────── */
  7   | 
  8   | async function login(page: import("@playwright/test").Page) {
> 9   |   await page.goto("/login");
      |              ^ Error: page.goto: Target page, context or browser has been closed
  10  |   await page.getByPlaceholder("Email address").fill(TEST_EMAIL);
  11  |   await page.getByPlaceholder("Password").fill(TEST_PASSWORD);
  12  |   await page.getByRole("button", { name: /sign in/i }).click();
  13  |   await page.waitForURL((u) => u.pathname !== "/login", { timeout: 15_000 });
  14  | }
  15  | 
  16  | /** Click the flashcard wrapper to flip it (avoids matching inner <button> tags). */
  17  | async function flipCard(page: import("@playwright/test").Page) {
  18  |   await page.locator("div[role='button'][tabindex='0']").first().click();
  19  | }
  20  | 
  21  | /* ── tests ───────────────────────────────────────────────────── */
  22  | 
  23  | test.describe("Flashcard component", () => {
  24  |   test.beforeEach(async ({ page }) => {
  25  |     await login(page);
  26  |     await page.goto("/learn");
  27  |     await expect(page.locator("div[role='button'][tabindex='0']").first()).toBeVisible({
  28  |       timeout: 25_000,
  29  |     });
  30  |   });
  31  | 
  32  |   test("shows the front face with the word on load", async ({ page }) => {
  33  |     await expect(page.locator("h2.font-display").first()).toBeVisible();
  34  |     await expect(page.getByText("Tap to reveal meaning")).toBeVisible();
  35  |   });
  36  | 
  37  |   test("flips to back face on card click", async ({ page }) => {
  38  |     await flipCard(page);
  39  | 
  40  |     await expect(page.getByText("Hindi")).toBeVisible();
  41  |     await expect(page.getByText("English")).toBeVisible();
  42  |     await expect(page.getByText("Example")).toBeVisible();
  43  |     await expect(page.getByRole("button", { name: "Don't Know", exact: true })).toBeVisible();
  44  |     await expect(page.getByRole("button", { name: "Vault", exact: true })).toBeVisible();
  45  |     await expect(page.getByRole("button", { name: "Know This", exact: true })).toBeVisible();
  46  |   });
  47  | 
  48  |   test("back face shows synonyms, antonyms, and root", async ({ page }) => {
  49  |     await flipCard(page);
  50  | 
  51  |     await expect(page.getByText("Synonyms")).toBeVisible();
  52  |     await expect(page.getByText("Antonyms")).toBeVisible();
  53  |     await expect(page.getByText("Root")).toBeVisible();
  54  |   });
  55  | 
  56  |   test("clicking 'Know This' advances to the next word", async ({ page }) => {
  57  |     await flipCard(page);
  58  | 
  59  |     const firstWord = await page.locator("h2.font-display").first().textContent();
  60  |     await page.getByRole("button", { name: "Know This", exact: true }).click();
  61  | 
  62  |     await expect(page.getByText("Tap to reveal meaning")).toBeVisible({ timeout: 5_000 });
  63  |     const secondWord = await page.locator("h2.font-display").first().textContent();
  64  |     expect(secondWord).not.toBe(firstWord);
  65  |   });
  66  | 
  67  |   test("clicking 'Don't Know' advances to the next word", async ({ page }) => {
  68  |     await flipCard(page);
  69  | 
  70  |     const firstWord = await page.locator("h2.font-display").first().textContent();
  71  |     await page.getByRole("button", { name: "Don't Know", exact: true }).click();
  72  | 
  73  |     await expect(page.getByText("Tap to reveal meaning")).toBeVisible({ timeout: 5_000 });
  74  |     const secondWord = await page.locator("h2.font-display").first().textContent();
  75  |     expect(secondWord).not.toBe(firstWord);
  76  |   });
  77  | 
  78  |   test("clicking 'Vault' advances to the next word", async ({ page }) => {
  79  |     await flipCard(page);
  80  | 
  81  |     const firstWord = await page.locator("h2.font-display").first().textContent();
  82  |     await page.getByRole("button", { name: "Vault", exact: true }).click();
  83  | 
  84  |     await expect(page.getByText("Tap to reveal meaning")).toBeVisible({ timeout: 5_000 });
  85  |     const secondWord = await page.locator("h2.font-display").first().textContent();
  86  |     expect(secondWord).not.toBe(firstWord);
  87  |   });
  88  | 
  89  |   test("clicking action button does NOT flip the card", async ({ page }) => {
  90  |     await flipCard(page);
  91  |     await expect(page.getByText("Hindi")).toBeVisible();
  92  | 
  93  |     await page.getByRole("button", { name: "Know This", exact: true }).click();
  94  | 
  95  |     // Next card starts on front face
  96  |     await expect(page.getByText("Tap to reveal meaning")).toBeVisible({ timeout: 5_000 });
  97  |   });
  98  | 
  99  |   test("progress counter increments after action", async ({ page }) => {
  100 |     // Header counter is the first match
  101 |     const counter = page.locator("span.text-\\[13px\\].text-outline").first();
  102 |     await expect(counter).toHaveText("1 / 5");
  103 | 
  104 |     await flipCard(page);
  105 |     await page.getByRole("button", { name: "Know This", exact: true }).click();
  106 | 
  107 |     await expect(counter).toHaveText("2 / 5", { timeout: 5_000 });
  108 |   });
  109 | 
```