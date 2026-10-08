import { expect, test } from "@playwright/test";

// Option rows: one choice at a time, selectable by tap/click and by keyboard.
test("option row selects one role at a time", async ({ page }) => {
  await page.goto("/design");
  const trainer = page.getByRole("button", { name: /I'm a trainer/ });
  const client = page.getByRole("button", { name: /I'm a client/ });

  await trainer.click();
  await expect(trainer).toHaveAttribute("aria-pressed", "true");
  await expect(client).toHaveAttribute("aria-pressed", "false");

  await client.focus();
  await page.keyboard.press("Space");
  await expect(client).toHaveAttribute("aria-pressed", "true");
  await expect(trainer).toHaveAttribute("aria-pressed", "false");
});

// The primary action must be easy to tap on a phone, and compact (not full width) with a mouse.
test("primary button fits the device", async ({ page, isMobile }) => {
  await page.goto("/design");
  const button = page.getByRole("button", { name: "Start workout" });
  const box = await button.boundingBox();
  const viewport = page.viewportSize();
  if (!box || !viewport) throw new Error("Button or viewport not measurable");

  if (isMobile) {
    // Touch size of `lg` (56px), well above the 44px minimum tap target.
    expect(box.height).toBeGreaterThanOrEqual(56);
    expect(box.width).toBeGreaterThan(viewport.width * 0.8);
  } else {
    expect(box.height).toBeLessThan(48);
    expect(box.width).toBeLessThan(viewport.width / 2);
  }
});
