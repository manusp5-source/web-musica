import type { Review, ReviewsFile } from "./schema";

/**
 * Integración con Google Business Profile — M1-UJ-004.
 *
 * Solo Node: OAuth por refresh token + GET v4 + mapper. **No escribe nada en disco** —
 * eso lo hace `scripts/fetch-reviews.mjs`, para que el mapeo se pueda probar sin tocar el
 * fichero real. Y no lo importa ningún componente ni ninguna ruta de `app/`: si alguna
 * vez lo hiciera, el build fallaría al intentar empaquetar código server-only para el
 * cliente — es la red de seguridad, no solo una convención.
 */

export type GoogleEnv = {
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REFRESH_TOKEN?: string;
};

type Kind = "auth" | "quota" | "notfound" | "ratelimit" | "server" | "other";

export class GoogleReviewsError extends Error {
  readonly hint?: string;
  readonly status?: number;
  readonly kind: Kind;

  constructor(message: string, options: { hint?: string; status?: number; kind?: Kind } = {}) {
    super(message);
    this.name = "GoogleReviewsError";
    this.hint = options.hint;
    this.status = options.status;
    this.kind = options.kind ?? "other";
  }
}

const DOC_SETUP = "docs/google-business-setup.md";

// --- OAuth ---------------------------------------------------------------

export async function fetchAccessToken(env: GoogleEnv): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID ?? "",
      client_secret: env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: env.GOOGLE_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    // Nunca se vuelca el body de la respuesta de OAuth: puede traer eco de credenciales.
    if (res.status === 400 || res.status === 401) {
      throw new GoogleReviewsError("El refresh token está revocado o caducado.", {
        status: res.status,
        kind: "auth",
        hint: `Regenera las credenciales siguiendo ${DOC_SETUP}.`,
      });
    }
    throw new GoogleReviewsError(`OAuth falló con código ${res.status}.`, { status: res.status });
  }

  const data = (await res.json()) as { access_token?: unknown };
  if (typeof data.access_token !== "string" || data.access_token.length === 0) {
    throw new GoogleReviewsError("La respuesta de OAuth no trae access_token.");
  }
  return data.access_token;
}

// --- Lectura de reseñas (v4) ----------------------------------------------

type RawReview = {
  reviewId: string;
  reviewer: { displayName: string; profilePhotoUrl?: string; isAnonymous?: boolean };
  starRating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "STAR_RATING_UNSPECIFIED";
  comment?: string;
  createTime: string;
  reviewReply?: { comment: string; updateTime: string };
};

type PaginaV4 = {
  reviews?: RawReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
};

const TOPE_PAGINAS = 20; // 1.000 reseñas a pageSize=50. Un bucle roto no se come la cuota.
const REINTENTOS_TRANSITORIOS = 1;

async function esperar(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function pedirPagina(url: string, token: string, intento = 0): Promise<PaginaV4> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.ok) return (await res.json()) as PaginaV4;

  if (res.status === 401) {
    throw new GoogleReviewsError("El access token fue rechazado.", { status: 401, kind: "auth" });
  }
  if (res.status === 403) {
    throw new GoogleReviewsError("Google devolvió 403: cuota de la API no aprobada o sin permiso sobre la ficha.", {
      status: 403,
      kind: "quota",
      hint: `Sigue ${DOC_SETUP} para solicitar la cuota y comprobar los permisos.`,
    });
  }
  if (res.status === 404) {
    throw new GoogleReviewsError(`Google devolvió 404 para la ruta pedida: "${url}". Revisa GBP_ACCOUNT_ID y GBP_LOCATION_ID.`, {
      status: 404,
      kind: "notfound",
    });
  }
  if (res.status === 429) {
    if (intento < REINTENTOS_TRANSITORIOS) {
      await esperar(500 * (intento + 1));
      return pedirPagina(url, token, intento + 1);
    }
    throw new GoogleReviewsError("Google devolvió 429 (límite por minuto) tras reintentar.", {
      status: 429,
      kind: "ratelimit",
    });
  }
  if (res.status >= 500) {
    if (intento < REINTENTOS_TRANSITORIOS) {
      await esperar(500 * (intento + 1));
      return pedirPagina(url, token, intento + 1);
    }
    throw new GoogleReviewsError(`Google devolvió ${res.status} tras reintentar. Se conserva el snapshot anterior.`, {
      status: res.status,
      kind: "server",
    });
  }
  throw new GoogleReviewsError(`Google devolvió ${res.status}, no contemplado.`, { status: res.status });
}

export async function fetchReviews(
  token: string,
  locationPath: string
): Promise<{ raw: RawReview[]; averageRating: number; totalReviewCount: number }> {
  const raw: RawReview[] = [];
  let averageRating = 0;
  let totalReviewCount = 0;
  let pageToken: string | undefined;

  for (let pagina = 0; pagina < TOPE_PAGINAS; pagina++) {
    const url = new URL(`https://mybusiness.googleapis.com/v4/${locationPath}/reviews`);
    url.searchParams.set("pageSize", "50");
    url.searchParams.set("orderBy", "updateTime desc");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const data = await pedirPagina(url.toString(), token);
    raw.push(...(data.reviews ?? []));
    if (typeof data.averageRating === "number") averageRating = data.averageRating;
    if (typeof data.totalReviewCount === "number") totalReviewCount = data.totalReviewCount;

    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;

    if (pagina === TOPE_PAGINAS - 1) {
      console.warn(`[reviews] Tope de ${TOPE_PAGINAS} páginas alcanzado con más reseñas pendientes.`);
    }
  }

  return { raw, averageRating, totalReviewCount };
}

// --- Mapeo al esquema propio ----------------------------------------------

const RATING: Record<string, 1 | 2 | 3 | 4 | 5> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export function mapToSchema(
  raw: RawReview[],
  meta: { averageRating: number; totalReviewCount: number; profileUrl: string | null }
): ReviewsFile {
  const reviews: Review[] = [];

  for (const r of raw) {
    const rating = RATING[r.starRating];
    if (rating === undefined) continue; // STAR_RATING_UNSPECIFIED — se descarta, nunca se filtra a propósito

    reviews.push({
      id: r.reviewId,
      author: r.reviewer.isAnonymous ? "Anónimo" : r.reviewer.displayName,
      avatarUrl: r.reviewer.profilePhotoUrl ?? null,
      rating,
      text: r.comment ?? "",
      lang: null, // la v4 no informa idioma; se anota a mano si hace falta
      createdAt: r.createTime,
      url: null, // la v4 no da enlace por reseña individual — ver design/data_model.md
      reply: r.reviewReply
        ? { text: r.reviewReply.comment, repliedAt: r.reviewReply.updateTime }
        : null,
    });
  }

  return {
    schemaVersion: 1,
    source: "google-business-profile",
    fetchedAt: new Date().toISOString(),
    profileUrl: meta.profileUrl,
    aggregate: {
      rating: Math.round(meta.averageRating * 10) / 10,
      count: meta.totalReviewCount, // el total de la ficha, nunca recortado a lo mostrado
    },
    reviews,
  };
}
