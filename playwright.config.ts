import { defineConfig, devices } from "@playwright/test";

// 3100 y no 3000: el 3000 lo pisa cualquier `npm run dev` abierto.
const PORT = 3100;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Build de producción, no dev: el smoke tiene que mirar lo que se publica.
    command: `npm run build && npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    // Apaga el hero 3D: WebGL headless es lento y da falsos rojos.
    // HERO3D_E2E=on lo enciende a propósito, para comprobar que el test del canvas
    // se pone rojo de verdad y no está pasando por casualidad.
    env: { NEXT_PUBLIC_HERO3D: process.env.HERO3D_E2E ?? "off" },
  },
});
