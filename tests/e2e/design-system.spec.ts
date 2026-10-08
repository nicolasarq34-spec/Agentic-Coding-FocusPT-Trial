import { expect, test } from "@playwright/test";

// Option rows are radio buttons: one choice at a time, by tap/click or arrow keys.
test("option row selects one role at a time", async ({ page }) => {
  await page.goto("/design");
  const trainer = page.getByRole("radio", { name: /I'm a trainer/ });
  const client = page.getByRole("radio", { name: /I'm a client/ });

  // Tap the visible row, like a person would (the radio itself is hidden).
  await page.getByText("I'm a trainer").click();
  await expect(trainer).toBeChecked();
  await expect(client).not.toBeChecked();

  // Arrow keys move the choice within the group.
  await page.keyboard.press("ArrowDown");
  await expect(client).toBeChecked();
  await expect(trainer).not.toBeChecked();
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
