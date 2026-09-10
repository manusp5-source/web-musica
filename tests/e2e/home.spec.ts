import { expect, test } from "@playwright/test";
import { site } from "../../src/config/site";

/**
 * Smoke, no suite de regresión. Tres cosas: que las dos raíces de idioma sirvan,
 * que la sección de opiniones siga oculta sin datos (invariante que hereda M1-UJ-001)
 * y que el hero 3D se pueda apagar por entorno (mitigación del riesgo R-06).
 */

test.describe("home ES", () => {
  test("responde y pinta el hero", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toBeVisible();
    // Contra la configuración, no contra la copy. La versión anterior exigía "Piano" en
    // el título y se puso roja cuando INT-006 quitó el piano — un test atado a un texto
    // concreto se rompe cada vez que alguien mejora una frase, y acaba borrándose.
    await expect(page).toHaveTitle(new RegExp(site.city, "i"));
    await expect(page).toHaveTitle(new RegExp(site.artistName, "i"));
  });

  test("publica JSON-LD parseable", async ({ page }) => {
    await page.goto("/");
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(raw).toBeTruthy();

    const jsonLd = JSON.parse(raw!);
    expect(jsonLd["@type"]).toContain("MusicGroup");
    // Sin reseñas todavía: no debe declararse valoración agregada (M1-UJ-003)
    expect(jsonLd.aggregateRating).toBeUndefined();
  });

  test("la sección de opiniones está oculta mientras no haya reseñas", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Opiniones", { exact: true })).toHaveCount(0);
  });

  /**
   * El canvas NO sirve como marcador: va en dynamic(ssr:false) y WebGL puede no
   * inicializar nunca en headless, así que `toHaveCount(0)` pasaba con el 3D
   * encendido — un falso verde. El botón de audio sí es determinista: solo existe
   * si Hero3D llegó a montarse.
   */
  test("con NEXT_PUBLIC_HERO3D=off no se monta el hero 3D", async ({ page }) => {
    test.skip(process.env.HERO3D_E2E === "on", "este caso comprueba el 3D apagado");
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Escuchar" })).toHaveCount(0);
  });

  test("con el hero 3D encendido aparece el control de audio", async ({ page }) => {
    test.skip(process.env.HERO3D_E2E !== "on", "solo con HERO3D_E2E=on");
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Escuchar" })).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("home EN", () => {
  test("responde en /en y está en inglés", async ({ page }) => {
    const response = await page.goto("/en");
    expect(response?.status()).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("las páginas legales de ambos idiomas responden", async ({ page }) => {
    for (const path of ["/aviso-legal", "/privacidad", "/en/legal-notice", "/en/privacy"]) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} no responde 200`).toBe(200);
    }
  });
});
