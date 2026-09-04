import { readFileSync } from "node:fs";
import { join } from "node:path";
import { EMPTY_REVIEWS, reviewsFileSchema, type Review, type ReviewsFile } from "./schema";

/**
 * Lectura de data/reviews.json en tiempo de build. Solo servidor: importa node:fs, así que
 * un componente de cliente que lo importe rompe el build — que es exactamente lo que se
 * quiere.
 *
 * NUNCA lanza. Fichero ausente, JSON corrupto o esquema incumplido devuelven el fichero
 * vacío y dejan el motivo en el log del build. Principio 5 de la constitución: degradar en
 * silencio de cara al visitante, nunca romper.
 */

export const DEFAULT_REVIEWS_PATH = join(process.cwd(), "data", "reviews.json");

export function loadReviews(path: string = DEFAULT_REVIEWS_PATH): ReviewsFile {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    console.warn(`[reviews] No se pudo leer ${path}. La sección de reseñas queda oculta.`);
    return EMPTY_REVIEWS;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    console.warn(`[reviews] ${path} no es JSON válido: ${(error as Error).message}`);
    return EMPTY_REVIEWS;
  }

  const result = reviewsFileSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".") || "(raíz)"}: ${issue.message}`)
      .join(" · ");
    console.warn(`[reviews] ${path} no cumple el esquema → ${issues}`);
    return EMPTY_REVIEWS;
  }

  // El orden lo garantiza quien carga, no quien escribe el fichero: así una edición
  // manual desordenada no cambia lo que ve el visitante.
  return {
    ...result.data,
    reviews: [...result.data.reviews].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    ),
  };
}

/**
 * Las `limit` más recientes. Sin criba por puntuación: mostrar solo las positivas
 * ocultando las negativas es práctica desleal (RDL 24/2021, Directiva Omnibus).
 */
export function visibleReviews(file: ReviewsFile, limit = 6): Review[] {
  return file.reviews.slice(0, limit);
}
