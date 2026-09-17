import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { buildRatingJsonLd } from "@/lib/reviews/jsonld";
import { loadReviews } from "@/lib/reviews/load";
import { EMPTY_REVIEWS } from "@/lib/reviews/schema";

const valid = loadReviews(join(process.cwd(), "tests", "fixtures", "reviews.valid.json"));

describe("buildRatingJsonLd sin reseñas", () => {
  it("no emite aggregateRating: un rating a cero es peor que ninguno", () => {
    const jsonLd = buildRatingJsonLd(EMPTY_REVIEWS);
    expect(jsonLd).toEqual({});
    expect("aggregateRating" in jsonLd).toBe(false);
  });
});

describe("buildRatingJsonLd con reseñas", () => {
  const jsonLd = buildRatingJsonLd(valid);

  it("declara la valoración agregada con los mismos números que se muestran", () => {
    expect(jsonLd.aggregateRating).toEqual({
      "@type": "AggregateRating",
      ratingValue: 4.7,
      reviewCount: 23,
      bestRating: 5,
      worstRating: 1,
    });
  });

  it("publica el total de la ficha, no el número de reseñas mostradas", () => {
    // 23 en Google, 3 en el fichero. Declarar 3 sería mentir a la baja;
    // recortar el total a lo mostrado es motivo de acción manual de Google.
    expect(jsonLd.aggregateRating?.reviewCount).toBe(23);
    expect(jsonLd.review).toHaveLength(3);
  });

  it("cada reseña lleva autor, puntuación y fecha", () => {
    const first = jsonLd.review?.[0];
    expect(first).toMatchObject({
      "@type": "Review",
      author: { "@type": "Person", name: "Laura M." },
      reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5, worstRating: 1 },
      datePublished: "2026-06-14T18:22:03.123Z",
    });
  });

  it("una reseña sin texto no lleva reviewBody vacío", () => {
    const sinTexto = jsonLd.review?.find((r) => r.author.name === "Anónimo");
    expect(sinTexto).toBeDefined();
    expect(sinTexto && "reviewBody" in sinTexto).toBe(false);
  });

  it("incluye también las reseñas malas", () => {
    expect(jsonLd.review?.some((r) => r.reviewRating.ratingValue === 1)).toBe(true);
  });

  it("sobrevive al escape de </script> que aplica HomePage", () => {
    const malicioso = {
      ...valid,
      reviews: [{ ...valid.reviews[0], text: "</script><script>alert(1)</script>" }],
    };
    const serialized = JSON.stringify(buildRatingJsonLd(malicioso)).replace(/</g, "\\u003c");
    expect(serialized).not.toContain("</script>");
    expect(() => JSON.parse(serialized.replace(/\\u003c/g, "<"))).not.toThrow();
  });
});
