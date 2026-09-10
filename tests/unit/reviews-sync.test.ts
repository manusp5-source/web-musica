import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runSync } from "@/lib/reviews/sync";

const FIXTURES = join(process.cwd(), "tests", "fixtures");
const page1 = () => JSON.parse(readFileSync(join(FIXTURES, "google-v4-page1.json"), "utf8"));
const page2 = () => JSON.parse(readFileSync(join(FIXTURES, "google-v4-page2.json"), "utf8"));

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

const ENV_COMPLETO = {
  GOOGLE_CLIENT_ID: "id",
  GOOGLE_CLIENT_SECRET: "secreto",
  GOOGLE_REFRESH_TOKEN: "refresh",
  GBP_ACCOUNT_ID: "1",
  GBP_LOCATION_ID: "2",
  GBP_PROFILE_URL: "https://g.page/r/ejemplo/review",
};

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("runSync — variables de entorno", () => {
  it("sin ninguna variable, falla ANTES de llamar a fetch, y nombra las que faltan", async () => {
    const resultado = await runSync({ env: {} });
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(resultado.error.message).toContain("GOOGLE_CLIENT_ID");
      expect(resultado.error.message).toContain("GBP_LOCATION_ID");
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it("con solo algunas variables, sigue fallando y solo nombra las que faltan de verdad", async () => {
    const resultado = await runSync({
      env: { GOOGLE_CLIENT_ID: "id", GOOGLE_CLIENT_SECRET: "s", GOOGLE_REFRESH_TOKEN: "r" },
    });
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(resultado.error.message).not.toContain("GOOGLE_CLIENT_ID");
      expect(resultado.error.message).toContain("GBP_ACCOUNT_ID");
    }
  });
});

describe("runSync — camino feliz", () => {
  it("token + dos páginas → un ReviewsFile válido, con dry=false por defecto", async () => {
    const mock = fetch as ReturnType<typeof vi.fn>;
    mock
      .mockResolvedValueOnce(jsonResponse({ access_token: "ya29.x" }))
      .mockResolvedValueOnce(jsonResponse(page1()))
      .mockResolvedValueOnce(jsonResponse(page2()));

    const resultado = await runSync({ env: ENV_COMPLETO });
    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      expect(resultado.dry).toBe(false);
      expect(resultado.file.reviews.length).toBeGreaterThan(0);
      expect(resultado.file.profileUrl).toBe(ENV_COMPLETO.GBP_PROFILE_URL);
    }
  });

  it("dry=true se refleja en el resultado sin cambiar la lógica de fetch", async () => {
    const mock = fetch as ReturnType<typeof vi.fn>;
    mock
      .mockResolvedValueOnce(jsonResponse({ access_token: "ya29.x" }))
      .mockResolvedValueOnce(jsonResponse(page1()))
      .mockResolvedValueOnce(jsonResponse(page2()));

    const resultado = await runSync({ env: ENV_COMPLETO, dry: true });
    expect(resultado.ok).toBe(true);
    if (resultado.ok) expect(resultado.dry).toBe(true);
  });
});

describe("runSync — reintento de 401", () => {
  it("renueva el token una vez y reintenta la lectura de reseñas", async () => {
    const mock = fetch as ReturnType<typeof vi.fn>;
    mock
      .mockResolvedValueOnce(jsonResponse({ access_token: "token-viejo" })) // 1er OAuth
      .mockResolvedValueOnce(jsonResponse({}, 401)) // reseñas rechaza el token viejo
      .mockResolvedValueOnce(jsonResponse({ access_token: "token-nuevo" })) // 2º OAuth
      .mockResolvedValueOnce(jsonResponse(page2())); // reseñas con el token nuevo

    const resultado = await runSync({ env: ENV_COMPLETO });
    expect(resultado.ok).toBe(true);
    expect(mock).toHaveBeenCalledTimes(4);
  });

  it("si el token renovado también falla, se propaga el error sin más reintentos", async () => {
    const mock = fetch as ReturnType<typeof vi.fn>;
    mock
      .mockResolvedValueOnce(jsonResponse({ access_token: "token-viejo" }))
      .mockResolvedValueOnce(jsonResponse({}, 401))
      .mockResolvedValueOnce(jsonResponse({ access_token: "token-nuevo" }))
      .mockResolvedValueOnce(jsonResponse({}, 401));

    const resultado = await runSync({ env: ENV_COMPLETO });
    expect(resultado.ok).toBe(false);
    expect(mock).toHaveBeenCalledTimes(4); // no un quinto intento
  });
});

describe("runSync — nunca filtra secretos en el resultado de error", () => {
  it("el mensaje de un fallo de red no contiene el client_secret", async () => {
    const mock = fetch as ReturnType<typeof vi.fn>;
    mock.mockRejectedValueOnce(new Error("network down"));
    const resultado = await runSync({ env: ENV_COMPLETO });
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error.message).not.toContain(ENV_COMPLETO.GOOGLE_CLIENT_SECRET);
  });
});
