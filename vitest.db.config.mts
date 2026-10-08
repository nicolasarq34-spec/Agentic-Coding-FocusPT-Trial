import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Database tests: they talk to the local Supabase, so Docker must be running
// (`npx supabase start`). Kept apart from unit tests so `npm run test` works without it.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["tests/db/**/*.test.ts"],
    setupFiles: ["tests/db/load-env.ts"],
  },
});
