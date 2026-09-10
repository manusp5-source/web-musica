import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  fetchAccessToken,
  fetchReviews,
  mapToSchema,
  GoogleReviewsError,
} from "@/lib/reviews/google";
import { reviewsFileSchema } from "@/lib/reviews/schema";

const FIXTURES = join(process.cwd(), "tests", "fixtures");
const leer = (nombre: string) => JSON.parse(readFileSync(join(FIXTURES, nombre), "utf8"));

const page1 = () => leer("google-v4-page1.json");
const page2 = () => leer("google-v4-page2.json");

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const ENV_OK = {
  GOOGLE_CLIENT_ID: "id-de-prueba",
  GOOGLE_CLIENT_SECRET: "secreto-de-prueba-no-real",
  GOOGLE_REFRESH_TOKEN: "refresh-de-prueba-no-real",
};

describe("fetchAccessToken", () => {
  it("canjea el refresh token por un access token", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({ access_token: "ya29.fake", expires_in: 3599, token_type: "Bearer" })
    );
    const token = await fetchAccessToken(ENV_OK);
    expect(token).toBe("ya29.fake");

    // La petición es exactamente la del contrato: POST, form-urlencoded, grant_type correcto.
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://oauth2.googleapis.com/token");
    expect(init.method).toBe("POST");
    const body = init.body.toString();
    expect(body).toContain("grant_type=refresh_token");
    expect(body).toContain("client_id=id-de-prueba");
  });

  it("da un mensaje accionable si el refresh token está revocado (400/401)", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({ error: "invalid_grant" }, 400)
    );
    await expect(fetchAccessToken(ENV_OK)).rejects.toMatchObject({
      hint: expect.stringContaining("docs/google-business-setup.md"),
    });
  });

  it("nunca incluye el client_secret ni el refresh_token en el mensaje de error", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(jsonResponse({}, 500));
    try {
      await fetchAccessToken(ENV_OK);
      expect.fail("debía lanzar");
    } catch (e) {
      const texto = (e as Error).message + JSON.stringify(e);
      expect(texto).not.toContain(ENV_OK.GOOGLE_CLIENT_SECRET);
      expect(texto).not.toContain(ENV_OK.GOOGLE_REFRESH_TOKEN);
    }
  });
});

describe("fetchReviews — paginación", () => {
  it("sigue nextPageToken hasta agotarlo y junta las reseñas de las dos páginas", async () => {
    const mock = fetch as ReturnType<typeof vi.fn>;
    mock.mockResolvedValueOnce(jsonResponse(page1())).mockResolvedValueOnce(jsonResponse(page2()));

    const { raw, averageRating, totalReviewCount } = await fetchReviews("token", "accounts/1/locations/2");

    expect(raw.map((r) => r.reviewId)).toEqual([
      "rev-google-1",
      "rev-google-2",
      "rev-google-3",
      "rev-google-4",
    ]);
    expect(averageRating).toBe(4.7);
    expect(totalReviewCount).toBe(23);
    expect(mock).toHaveBeenCalledTimes(2);

    // La segunda llamada lleva el pageToken de la primera.
    const segundaUrl = mock.mock.calls[1][0] as string;
    expect(segundaUrl).toContain("pageToken=pagina-2");
  });

  it("para en 20 páginas aunque el nextPageToken no se acabe nunca", async () => {
    const mock = fetch as ReturnType<typeof vi.fn>;
    mock.mockImplementation(() =>
      Promise.resolve(jsonResponse({ reviews: [], averageRating: 5, totalReviewCount: 1, nextPageToken: "otra-vez" }))
    );
    await fetchReviews("token", "accounts/1/locations/2");
    expect(mock).toHaveBeenCalledTimes(20);
  });
});

describe("fetchReviews — errores por código HTTP", () => {
  it("403 → cuota no aprobada, con pista al documento de setup", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(jsonResponse({}, 403));
    await expect(fetchReviews("token", "accounts/1/locations/2")).rejects.toMatchObject({
      kind: "quota",
      hint: expect.stringContaining("docs/google-business-setup.md"),
    });
  });

  it("401 → error de tipo auth, para que el CLI renueve el token", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(jsonResponse({}, 401));
    await expect(fetchReviews("token", "accounts/1/locations/2")).rejects.toMatchObject({ kind: "auth" });
  });

  it("404 → el mensaje incluye el locationPath recibido", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(jsonResponse({}, 404));
    await expect(fetchReviews("token", "accounts/1/locations/2")).rejects.toMatchObject({
      message: expect.stringContaining("accounts/1/locations/2"),
    });
  });

  it("429 → un reintento; si el segundo también falla, aborta como ratelimit", async () => {
    const mock = fetch as ReturnType<typeof vi.fn>;
    mock.mockResolvedValueOnce(jsonResponse({}, 429)).mockResolvedValueOnce(jsonResponse({}, 429));
    await expect(fetchReviews("token", "accounts/1/locations/2")).rejects.toMatchObject({ kind: "ratelimit" });
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it("429 → si el reintento sale bien, no lanza", async () => {
    const mock = fetch as ReturnType<typeof vi.fn>;
    mock.mockResolvedValueOnce(jsonResponse({}, 429)).mockResolvedValueOnce(jsonResponse(page2()));
    const { raw } = await fetchReviews("token", "accounts/1/locations/2");
    expect(raw).toHaveLength(1);
  });

  it("5xx → un reintento; si persiste, aborta como server", async () => {
    const mock = fetch as ReturnType<typeof vi.fn>;
    mock.mockResolvedValueOnce(jsonResponse({}, 503)).mockResolvedValueOnce(jsonResponse({}, 502));
    await expect(fetchReviews("token", "accounts/1/locations/2")).rejects.toMatchObject({ kind: "server" });
  });
});

describe("mapToSchema", () => {
  it("produce un ReviewsFile que valida contra el esquema", () => {
    const file = mapToSchema([...page1().reviews, ...page2().reviews], {
      averageRating: 4.7,
      totalReviewCount: 23,
      profileUrl: "https://g.page/r/ejemplo/review",
    });
    expect(() => reviewsFileSchema.parse(file)).not.toThrow();
  });

  it("descarta STAR_RATING_UNSPECIFIED y no cuenta en la lista", () => {
    const file = mapToSchema(page1().reviews, {
      averageRating: 4.7,
      totalReviewCount: 23,
      profileUrl: null,
    });
    expect(file.reviews.some((r) => r.id === "rev-google-2")).toBe(false);
    expect(file.reviews).toHaveLength(2); // de 3 en el fixture, 1 se descarta
  });

  it('isAnonymous: true produce author "Anónimo"', () => {
    const file = mapToSchema(page1().reviews, {
      averageRating: 4.7,
      totalReviewCount: 23,
      profileUrl: null,
    });
    // rev-google-2 es anónima pero se descarta por rating sin especificar; probamos con
    // un fixture inline que sea anónimo Y tenga rating válido.
    const anonimaConRating = {
      ...page1().reviews[1],
      starRating: "THREE",
    };
    const conAnonima = mapToSchema([anonimaConRating], {
      averageRating: 3,
      totalReviewCount: 1,
      profileUrl: null,
    });
    expect(conAnonima.reviews[0].author).toBe("Anónimo");
  });

  it("no recorta aggregate.count al número de reseñas mostradas", () => {
    const file = mapToSchema(page1().reviews, {
      averageRating: 4.7,
      totalReviewCount: 23,
      profileUrl: null,
    });
    expect(file.aggregate.count).toBe(23);
    expect(file.reviews.length).toBeLessThan(23);
  });

  it("mapea la respuesta del titular cuando existe", () => {
    const file = mapToSchema(page1().reviews, {
      averageRating: 4.7,
      totalReviewCount: 23,
      profileUrl: null,
    });
    const conRespuesta = file.reviews.find((r) => r.id === "rev-google-3");
    expect(conRespuesta?.reply).toEqual({
      text: "Gracias por confiar en mí, Javier.",
      repliedAt: "2026-04-03T09:00:00.000Z",
    });
  });
});

describe("GoogleReviewsError", () => {
  it("es distinguible de un error genérico", () => {
    expect(new GoogleReviewsError("x") instanceof Error).toBe(true);
  });
});
