import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  // tsconfig.json usa "jsx": "preserve" porque Next hace su propia transformación.
  // esbuild hereda ese valor y cae al runtime clásico → "React is not defined".
  esbuild: { jsx: "automatic" },
  resolve: {
    // Mismo alias que tsconfig.json → sin él, "@/config/site" no resuelve en los tests
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    // Playwright vive en tests/e2e y tiene su propio runner
    exclude: ["node_modules", ".next", "tests/e2e/**"],
  },
});
