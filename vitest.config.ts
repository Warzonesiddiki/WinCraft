import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * Component and module tests, run in jsdom with the same React transform the
 * app uses. The script suites under `scripts/` already cover the pure model
 * code and the copy tables; nothing rendered a component until now, which is
 * the gap this runner closes. `vitest` and its DOM dependencies were already
 * in devDependencies, so this adds no package.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["src/test-setup.ts"],
  },
});
