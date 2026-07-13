import { test, expect } from "@playwright/test";

const TEST_EMAIL = "ashu@gmail.com";
const TEST_PASSWORD = "Hello@12345";

/* ── helpers ─────────────────────────────────────────────────── */

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByPlaceholder("Email address").fill(TEST_EMAIL);
  await page.getByPlaceholder("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL((u) => u.pathname !== "/login", { timeout: 15_000 });
}

/** Click the flashcard wrapper to flip it (avoids matching inner <button> tags). */
async function flipCard(page: import("@playwright/test").Page) {
  await page.locator("div[role='button'][tabindex='0']").first().click();
}

/* ── tests ───────────────────────────────────────────────────── */

test.describe("Flashcard component", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/learn");
    await expect(page.locator("div[role='button'][tabindex='0']").first()).toBeVisible({
      timeout: 25_000,
    });
  });

  test("shows the front face with the word on load", async ({ page }) => {
    await expect(page.locator("h2.font-display").first()).toBeVisible();
    await expect(page.getByText("Tap to reveal meaning")).toBeVisible();
  });

  test("flips to back face on card click", async ({ page }) => {
    await flipCard(page);

    await expect(page.getByText("Hindi")).toBeVisible();
    await expect(page.getByText("English")).toBeVisible();
    await expect(page.getByText("Example")).toBeVisible();
    await expect(page.getByRole("button", { name: "Don't Know", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Vault", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Know This", exact: true })).toBeVisible();
  });

  test("back face shows synonyms, antonyms, and root", async ({ page }) => {
    await flipCard(page);

    await expect(page.getByText("Synonyms")).toBeVisible();
    await expect(page.getByText("Antonyms")).toBeVisible();
    await expect(page.getByText("Root")).toBeVisible();
  });

  test("clicking 'Know This' advances to the next word", async ({ page }) => {
    await flipCard(page);

    const firstWord = await page.locator("h2.font-display").first().textContent();
    await page.getByRole("button", { name: "Know This", exact: true }).click();

    await expect(page.getByText("Tap to reveal meaning")).toBeVisible({ timeout: 5_000 });
    const secondWord = await page.locator("h2.font-display").first().textContent();
    expect(secondWord).not.toBe(firstWord);
  });

  test("clicking 'Don't Know' advances to the next word", async ({ page }) => {
    await flipCard(page);

    const firstWord = await page.locator("h2.font-display").first().textContent();
    await page.getByRole("button", { name: "Don't Know", exact: true }).click();

    await expect(page.getByText("Tap to reveal meaning")).toBeVisible({ timeout: 5_000 });
    const secondWord = await page.locator("h2.font-display").first().textContent();
    expect(secondWord).not.toBe(firstWord);
  });

  test("clicking 'Vault' advances to the next word", async ({ page }) => {
    await flipCard(page);

    const firstWord = await page.locator("h2.font-display").first().textContent();
    await page.getByRole("button", { name: "Vault", exact: true }).click();

    await expect(page.getByText("Tap to reveal meaning")).toBeVisible({ timeout: 5_000 });
    const secondWord = await page.locator("h2.font-display").first().textContent();
    expect(secondWord).not.toBe(firstWord);
  });

  test("clicking action button does NOT flip the card", async ({ page }) => {
    await flipCard(page);
    await expect(page.getByText("Hindi")).toBeVisible();

    await page.getByRole("button", { name: "Know This", exact: true }).click();

    // Next card starts on front face
    await expect(page.getByText("Tap to reveal meaning")).toBeVisible({ timeout: 5_000 });
  });

  test("progress counter increments after action", async ({ page }) => {
    // Header counter is the first match
    const counter = page.locator("span.text-\\[13px\\].text-outline").first();
    await expect(counter).toHaveText("1 / 5");

    await flipCard(page);
    await page.getByRole("button", { name: "Know This", exact: true }).click();

    await expect(counter).toHaveText("2 / 5", { timeout: 5_000 });
  });

  test("keyboard Enter flips the card", async ({ page }) => {
    const card = page.locator("div[role='button'][tabindex='0']").first();
    await card.focus();
    await page.keyboard.press("Enter");

    await expect(page.getByText("Hindi")).toBeVisible();
  });

  test("card flips back on second click (above buttons)", async ({ page }) => {
    await flipCard(page);
    await expect(page.getByText("Hindi")).toBeVisible();

    // Click the word heading on the back face to flip back
    await page.locator("h2.font-display").first().click();
    await expect(page.getByText("Tap to reveal meaning")).toBeVisible({ timeout: 5_000 });
  });
});

test.describe("Flashcard — session completion", () => {
  test("completing all words shows session summary", async ({ page }) => {
    await login(page);
    await page.goto("/learn");
    await expect(page.locator("div[role='button'][tabindex='0']").first()).toBeVisible({
      timeout: 25_000,
    });

    // Read total from header counter
    const counter = page.locator("span.text-\\[13px\\].text-outline").first();
    const counterText = await counter.textContent();
    const total = parseInt(counterText!.split("/")[1].trim(), 10);

    // Click through all words
    for (let i = 0; i < total; i++) {
      await flipCard(page);
      await page.getByRole("button", { name: "Know This", exact: true }).click();
    }

    // Session complete screen
    await expect(page.getByText("Session complete")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/You reviewed \d+ words/)).toBeVisible();
    await expect(page.getByRole("link", { name: /back to dashboard/i })).toBeVisible();
  });
});
