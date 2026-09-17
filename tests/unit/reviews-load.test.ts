import { describe, expect, it, vi, afterEach } from "vitest";
import { join } from "node:path";
import { loadReviews, visibleReviews } from "@/lib/reviews/load";
import { EMPTY_REVIEWS } from "@/lib/reviews/schema";

const FIXTURES = join(process.cwd(), "tests", "fixtures");

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadReviews", () => {
  it("lee y valida un fichero correcto", () => {
    const file = loadReviews(join(FIXTURES, "reviews.valid.json"));
    expect(file.reviews).toHaveLength(3);
    expect(file.aggregate).toEqual({ rating: 4.7, count: 23 });
  });

  it("ordena por fecha descendente aunque el fichero venga desordenado", () => {
    const file = loadReviews(join(FIXTURES, "reviews.valid.json"));
    expect(file.reviews.map((r) => r.id)).toEqual(["rev-reciente", "rev-sin-texto", "rev-antigua"]);
  });

  it("no filtra las reseñas malas: la de 1 estrella sigue ahí", () => {
    const file = loadReviews(join(FIXTURES, "reviews.valid.json"));
    expect(file.reviews.some((r) => r.rating === 1)).toBe(true);
  });

  it("devuelve vacío y no lanza si el fichero no existe", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(loadReviews(join(FIXTURES, "no-existe.json"))).toEqual(EMPTY_REVIEWS);
  });

  it("devuelve vacío y no lanza si el JSON está corrupto", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(loadReviews(join(FIXTURES, "reviews.corrupt.json"))).toEqual(EMPTY_REVIEWS);
    expect(warn).toHaveBeenCalled();
  });

  it("devuelve vacío si el fichero es JSON válido pero incumple el esquema", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(loadReviews(join(FIXTURES, "reviews.invalid-schema.json"))).toEqual(EMPTY_REVIEWS);
  });
});

describe("visibleReviews", () => {
  it("recorta al límite pedido conservando las más recientes", () => {
    const file = loadReviews(join(FIXTURES, "reviews.valid.json"));
    expect(visibleReviews(file, 2).map((r) => r.id)).toEqual(["rev-reciente", "rev-sin-texto"]);
  });

  it("no filtra por puntuación en ningún caso", () => {
    const file = loadReviews(join(FIXTURES, "reviews.valid.json"));
    expect(visibleReviews(file, 10)).toHaveLength(3);
  });
});
