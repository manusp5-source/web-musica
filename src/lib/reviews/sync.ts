import { GoogleReviewsError, fetchAccessToken, fetchReviews, mapToSchema } from "./google";
import { reviewsFileSchema, type ReviewsFile } from "./schema";

/**
 * Orquestación de la sincronización — M1-UJ-004.
 *
 * Separado de `google.ts` a propósito: `google.ts` no sabe nada de variables de entorno
 * ni de reintentos entre llamadas; esto sí, y sigue **sin tocar el disco**, para que el
 * camino completo (env ausente, reintento de 401, validación final) se pueda probar
 * mockeando `fetch`, sin depender de credenciales reales ni de red.
 * `scripts/fetch-reviews.ts` es la única pieza que escribe `data/reviews.json`.
 */

const VARS_OBLIGATORIAS = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "GBP_ACCOUNT_ID",
  "GBP_LOCATION_ID",
] as const;

export type SyncOk = { ok: true; dry: boolean; file: ReviewsFile };
export type SyncFail = { ok: false; error: GoogleReviewsError | Error };
export type SyncResult = SyncOk | SyncFail;

export async function runSync(opts: {
  env: Record<string, string | undefined>;
  dry?: boolean;
}): Promise<SyncResult> {
  const { env, dry = false } = opts;

  const faltantes = VARS_OBLIGATORIAS.filter((v) => !env[v]);
  if (faltantes.length > 0) {
    return {
      ok: false,
      error: new GoogleReviewsError(`Faltan variables de entorno: ${faltantes.join(", ")}.`, {
        hint: "Revisa .env.example y docs/google-business-setup.md.",
      }),
    };
  }

  const locationPath = `accounts/${env.GBP_ACCOUNT_ID}/locations/${env.GBP_LOCATION_ID}`;
  const profileUrl = env.GBP_PROFILE_URL ?? null;

  try {
    let token = await fetchAccessToken(env);
    let resultado;
    try {
      resultado = await fetchReviews(token, locationPath);
    } catch (error) {
      // 401 → se renueva el token una sola vez y se reintenta. Cualquier otro fallo,
      // o si el reintento también falla, se propaga tal cual.
      if (error instanceof GoogleReviewsError && error.kind === "auth") {
        token = await fetchAccessToken(env);
        resultado = await fetchReviews(token, locationPath);
      } else {
        throw error;
      }
    }

    const file = mapToSchema(resultado.raw, {
      averageRating: resultado.averageRating,
      totalReviewCount: resultado.totalReviewCount,
      profileUrl,
    });

    // Última comprobación antes de que el CLI escriba nada: si el esquema no valida,
    // aquí se corta — "no se escribe nada" no es responsabilidad del CLI, es de aquí.
    reviewsFileSchema.parse(file);

    return { ok: true, dry, file };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
}
