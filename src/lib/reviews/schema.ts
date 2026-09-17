import { z } from "zod";

/**
 * Esquema de data/reviews.json — el contrato entre la integración con Google y la web.
 * Ver design/data_model.md. Zod solo corre en Node (build, scripts y tests): no entra
 * en el bundle del navegador.
 */

// Evita z.string().datetime() / z.iso.datetime(): cambió de sitio entre Zod 3 y 4 y este
// fichero tiene que sobrevivir a esa actualización.
const isoDate = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "no es una fecha ISO 8601 válida",
});

export const reviewSchema = z.object({
  id: z.string().min(1),
  author: z.string().min(1),
  avatarUrl: z.string().url().nullable(),
  rating: z.number().int().min(1).max(5),
  // Cadena vacía = reseña de solo estrellas. Nunca null: así el componente
  // no necesita dos comprobaciones distintas para lo mismo.
  text: z.string(),
  lang: z.string().nullable().optional(),
  createdAt: isoDate,
  url: z.string().url().nullable().optional(),
  reply: z.object({ text: z.string(), repliedAt: isoDate }).nullable().optional(),
});

export const aggregateSchema = z.object({
  rating: z.number().min(0).max(5),
  count: z.number().int().min(0),
});

export const reviewsFileSchema = z
  .object({
    schemaVersion: z.literal(1),
    source: z.enum(["google-business-profile", "manual"]),
    fetchedAt: isoDate,
    profileUrl: z.string().url().nullable(),
    aggregate: aggregateSchema,
    reviews: z.array(reviewSchema),
  })
  .superRefine((file, ctx) => {
    const ids = new Set(file.reviews.map((r) => r.id));
    if (ids.size !== file.reviews.length) {
      ctx.addIssue({ code: "custom", message: "hay reseñas con el mismo id" });
    }
    // El total es el de la ficha de Google, no el de lo que se muestra: puede ser mayor,
    // nunca menor.
    if (file.aggregate.count < file.reviews.length) {
      ctx.addIssue({ code: "custom", message: "aggregate.count es menor que el número de reseñas" });
    }
  });

export type Review = z.infer<typeof reviewSchema>;
export type ReviewsFile = z.infer<typeof reviewsFileSchema>;

/** Fichero válido y vacío. Con esto la sección no se renderiza y la página no rompe. */
export const EMPTY_REVIEWS: ReviewsFile = Object.freeze({
  schemaVersion: 1 as const,
  source: "manual" as const,
  fetchedAt: "1970-01-01T00:00:00.000Z",
  profileUrl: null,
  aggregate: { rating: 0, count: 0 },
  reviews: [],
});
