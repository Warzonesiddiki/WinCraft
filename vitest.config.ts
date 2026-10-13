import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * Component and module tests, run in jsdom with the same React transform the
 * app uses. The script suites under `scripts/` already cover the pure model
 * code and the copy tables; nothing rendered a component until now, which is
 * the gap this runner closes.
 *
 * Coverage (added after the suite reached fifteen files) is a **ratchet**, not
 * a target. The thresholds below sit about a point under what the tree measures
 * so ordinary refactoring cannot trip them, and their job is to refuse a fall:
 * when you add tests, raise them; never lower one to make a red run green.
 *
 * The comment in `include` matters as much as the thresholds. Without it Vitest
 * reports only the files a test imported, which quietly drops every untested
 * module from the denominator — the same tree measured 58% that way and 30%
 * with every source file counted. A number that improves when code is added and
 * never tested is worse than no number.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["src/test-setup.ts"],
    coverage: {
      provider: "v8",
      // The summary is what a person reads; the JSON is what a script or CI
      // annotation can consume later without re-running the suite.
      reporter: ["text-summary", "json-summary"],
      reportsDirectory: "coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        // The tests and their harness: measuring them measures the ruler.
        "src/**/*.test.{ts,tsx}",
        "src/test-setup.ts",
        "src/test-bridge.ts",
        // Type-only and asset modules have no executable code to cover.
        "src/types.ts",
        "src/assets/**",
        "**/*.d.mts",
        // The entry point mounts the app and nothing else.
        "src/main.tsx",
      ],
      // Audit regression suites moved lines from 46.09% to 53.14%. The floors
      // are raised with the measurement and never lowered to make a red run
      // green; each keeps about a point of headroom for ordinary refactoring.
      thresholds: {
        statements: 51,
        branches: 50,
        functions: 48,
        lines: 52,
        // Critical-path ratchets: unrelated UI tests cannot mask losing these.
        "**/src/App.tsx": { statements: 48, branches: 54, functions: 24, lines: 55 },
        "**/src/components/account.tsx": { statements: 20, branches: 25, functions: 13, lines: 22 },
        "**/src/account-refresh.ts": { statements: 90, branches: 85, functions: 95, lines: 90 },
        "**/src/components/use-visibility-interval.ts": {
          statements: 95,
          branches: 88,
          functions: 95,
          lines: 95,
        },
      },
    },
  },
});
