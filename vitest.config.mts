import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Unit tests only. Playwright's end-to-end tests live in tests/e2e.
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
});
