import { visibleReviews } from "./load";
import type { ReviewsFile } from "./schema";

/**
 * Fragmento de JSON-LD con la valoración agregada y las reseñas — M1-UJ-003.
 *
 * Regla que manda sobre todas las demás: **lo declarado tiene que coincidir con lo que
 * se ve en la página.** Un `aggregateRating` que no se corresponde con el contenido
 * visible es motivo de acción manual de Google, y encima es mentir.
 */

type JsonLdRating = {
  "@type": "Rating";
  ratingValue: number;
  bestRating: 5;
  worstRating: 1;
};

export type JsonLdReview = {
  "@type": "Review";
  author: { "@type": "Person"; name: string };
  reviewRating: JsonLdRating;
  datePublished: string;
  reviewBody?: string;
};

export type RatingJsonLd = {
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating: 5;
    worstRating: 1;
  };
  review?: JsonLdReview[];
};

export function buildRatingJsonLd(file: ReviewsFile): RatingJsonLd {
  // Sin reseñas no se declara nada. Un aggregateRating a cero es peor que ninguno:
  // Google lo trata como una valoración pésima, no como ausencia de valoración.
  if (file.aggregate.count === 0) return {};

  const review: JsonLdReview[] = visibleReviews(file).map((r) => {
    const entry: JsonLdReview = {
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      datePublished: r.createdAt,
    };
    // Sin texto no se emite reviewBody: un campo vacío es peor que no tenerlo.
    if (r.text.trim().length > 0) entry.reviewBody = r.text;
    return entry;
  });

  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: file.aggregate.rating,
      // El total de la ficha, no el de las mostradas. Recortarlo a lo visible
      // desinforma a la baja y contradice lo que Google ya sabe.
      reviewCount: file.aggregate.count,
      bestRating: 5,
      worstRating: 1,
    },
    review,
  };
}
