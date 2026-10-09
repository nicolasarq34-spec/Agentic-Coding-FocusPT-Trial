import { expect, test, type Page } from "@playwright/test";

// Needs local Supabase running (`npx supabase start`).
// Each run signs up a brand-new trainer, so the library starts empty and names never clash with earlier runs.

// Next.js keeps recently visited pages alive but hidden (so going back is instant), which means the
// sign-up form's "Name" field is still in the page after we move on. Only ever use the visible one.
function field(page: Page, label: string) {
  return page.getByLabel(label).filter({ visible: true });
}

test("a trainer builds their exercise library: add, fix a mistake, edit", async ({ page }, testInfo) => {
  await page.goto("/signup");
  await page.getByText("I'm a trainer").click();
  await page.getByLabel("Name").fill("Lena Library");
  await page.getByLabel("Email").fill(`e2e-library-${testInfo.project.name}-${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("e2e-test-password");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/trainer$/);

  // From trainer home to the (empty) library.
  await page.getByRole("link", { name: "Exercise library" }).click();
  await expect(page).toHaveURL(/\/trainer\/exercises$/);
  await expect(page.getByText("No exercises yet")).toBeVisible();

  // Add one, with a broken link first: the form explains and keeps what was typed.
  await page.getByRole("link", { name: "Add exercise" }).click();
  await field(page, "Name").fill("Goblet squat");
  await field(page, "Video link (optional)").fill("youtube.com/watch?v=abc");
  await page.getByRole("button", { name: "Save exercise" }).click();
  await expect(page.getByText("Paste the full link, starting with https://")).toBeVisible();
  await expect(field(page, "Name")).toHaveValue("Goblet squat");

  await field(page, "Video link (optional)").fill("https://example.com/videos/goblet-squat");
  await page.getByRole("button", { name: "Save exercise" }).click();

  // Back on the list, with the new exercise and its video link.
  await expect(page).toHaveURL(/\/trainer\/exercises$/);
  await expect(page.getByRole("link", { name: "Goblet squat", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Watch video for Goblet squat (opens in a new tab)" })).toBeVisible();

  // Edit it: the form starts with the saved name.
  await page.getByRole("link", { name: "Goblet squat", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Edit exercise" })).toBeVisible();
  await expect(field(page, "Name")).toHaveValue("Goblet squat");
  await field(page, "Name").fill("Kettlebell goblet squat");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page).toHaveURL(/\/trainer\/exercises$/);
  await expect(page.getByRole("link", { name: "Kettlebell goblet squat", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Goblet squat", exact: true })).toHaveCount(0);
});
