import { describe, expect, it, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

/**
 * Encontrado por el crítico de la review del 25 sep: el revisor verificó bien el camino
 * sin token (nada se renderiza, confirmado contra el HTML real servido), pero nadie
 * verificó el camino CON token — que es el único que importa de verdad, porque es el que
 * corre en producción una vez Manuel pegue el token real. Sin este test, un error en el
 * nombre del atributo o en la forma del JSON de `data-cf-beacon` dejaría las métricas
 * silenciosamente rotas para siempre, con todo el resto del tablero en verde.
 *
 * `vi.mock` en vez de tocar `site.ts` de verdad: `site` es `as const`, y el resto del
 * proyecto no tiene precedente de mockearlo — este es el primero, documentado aquí para
 * que el siguiente test que lo necesite no tenga que redescubrir el patrón.
 */
describe("CloudflareAnalytics", () => {
  afterEach(() => {
    cleanup();
    vi.resetModules();
    vi.doUnmock("@/config/site");
  });

  it("sin token, no renderiza nada", async () => {
    vi.doMock("@/config/site", () => ({
      site: { analytics: { cloudflareToken: "" } },
    }));
    const { default: CloudflareAnalytics } = await import("@/components/CloudflareAnalytics");
    const { container } = render(<CloudflareAnalytics />);
    expect(container).toBeEmptyDOMElement();
  });

  it("con token, renderiza el beacon con el src, defer y data-cf-beacon correctos", async () => {
    vi.doMock("@/config/site", () => ({
      site: { analytics: { cloudflareToken: "TEST_TOKEN_123" } },
    }));
    const { default: CloudflareAnalytics } = await import("@/components/CloudflareAnalytics");
    const { container } = render(<CloudflareAnalytics />);

    const script = container.querySelector("script");
    expect(script).not.toBeNull();
    expect(script).toHaveAttribute("src", "https://static.cloudflareinsights.com/beacon.min.js");
    expect(script).toHaveAttribute("defer");

    // El beacon de Cloudflare exige el token dentro de un JSON con esta clave exacta
    // ("token"): un nombre de clave distinto deja el beacon cargado pero mudo, sin
    // ningún error visible — exactamente el fallo silencioso que este test existe para
    // que no pase desapercibido.
    const beacon = script!.getAttribute("data-cf-beacon");
    expect(beacon).not.toBeNull();
    expect(JSON.parse(beacon!)).toEqual({ token: "TEST_TOKEN_123" });
  });
});
