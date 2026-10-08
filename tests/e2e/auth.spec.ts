import { expect, test, type Page } from "@playwright/test";

// Needs local Supabase running (`npx supabase start`) with the seed loaded (`npx supabase db reset`).

async function logIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
}

test("a new trainer signs up, logs out and logs back in", async ({ page }, testInfo) => {
  // A fresh fake email every run, so the test never collides with an earlier account.
  const email = `e2e-trainer-${testInfo.project.name}-${Date.now()}@example.com`;
  const password = "e2e-test-password";

  await page.goto("/signup");
  await page.getByText("I'm a trainer").click();
  await page.getByLabel("Name").fill("Eddie Example");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/trainer$/);
  await expect(page.getByRole("heading", { name: "Hi, Eddie Example" })).toBeVisible();
  await expect(page.getByText("No clients yet")).toBeVisible();

  // A trainer can't open the client area: they're sent back to their own home.
  await page.goto("/client");
  await expect(page).toHaveURL(/\/trainer$/);

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  // Logged out, the trainer area sends you to log in.
  await page.goto("/trainer");
  await expect(page).toHaveURL(/\/login$/);

  await logIn(page, email, password);
  await expect(page).toHaveURL(/\/trainer$/);
});

test("a seeded client logs in and lands on today", async ({ page }) => {
  await logIn(page, "cleo.client@example.com", "coachlab-dev");

  await expect(page).toHaveURL(/\/client$/);
  await expect(page.getByRole("heading", { name: "Hi, Cleo Client" })).toBeVisible();
  await expect(page.getByText("No programme assigned yet")).toBeVisible();
});

test("a wrong password shows a friendly error", async ({ page }) => {
  await logIn(page, "cleo.client@example.com", "not-the-password");

  // Found by its text: Next.js adds its own hidden role="alert" (the route announcer) to every page.
  await expect(page.getByText("That email and password don't match")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel("Email")).toHaveValue("cleo.client@example.com");
});
