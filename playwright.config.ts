import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // Clients log workouts on their phones, so test a phone-sized screen too.
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // Starts the app before the tests, or reuses it if `npm run dev` is already running.
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
});
