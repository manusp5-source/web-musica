import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { join } from "node:path";
import Reviews from "@/components/Reviews";
import { loadReviews } from "@/lib/reviews/load";
import { EMPTY_REVIEWS } from "@/lib/reviews/schema";
import { getDict } from "@/i18n/dictionaries";

const valid = loadReviews(join(process.cwd(), "tests", "fixtures", "reviews.valid.json"));
const dict = getDict("es");

describe("Reviews con datos", () => {
  it("pinta una tarjeta por reseña", () => {
    render(<Reviews dict={dict} file={valid} locale="es" />);
    expect(screen.getAllByRole("figure")).toHaveLength(3);
  });

  it("atribuye cada reseña a su autor", () => {
    render(<Reviews dict={dict} file={valid} locale="es" />);
    expect(screen.getByText("Laura M.")).toBeInTheDocument();
    expect(screen.getByText("Javier R.")).toBeInTheDocument();
  });

  it("expone la puntuación como texto, no solo como estrellas", () => {
    render(<Reviews dict={dict} file={valid} locale="es" />);
    // "5 de 5" aparece dos veces: en la reseña de Laura y en la cabecera de agregado,
    // donde 4,7 se redondea a 5 estrellas.
    expect(screen.getAllByText("5 de 5 estrellas").length).toBeGreaterThanOrEqual(1);
    // Esta es la que importa: la reseña de 1 estrella se muestra, no se esconde.
    expect(screen.getByText("1 de 5 estrellas")).toBeInTheDocument();
  });

  it("muestra la reseña sin texto sin dejar una cita vacía", () => {
    const { container } = render(<Reviews dict={dict} file={valid} locale="es" />);
    const quotes = container.querySelectorAll("blockquote");
    expect(quotes).toHaveLength(2); // 3 reseñas, una sin texto
    for (const quote of quotes) expect(quote.textContent?.trim()).not.toBe("");
  });

  it("declara el origen de las reseñas (Directiva Omnibus)", () => {
    render(<Reviews dict={dict} file={valid} locale="es" />);
    expect(screen.getByText(dict.reviews.disclosure)).toBeInTheDocument();
  });

  it("enlaza a la ficha de Google", () => {
    render(<Reviews dict={dict} file={valid} locale="es" />);
    const link = screen.getByRole("link", { name: dict.reviews.cta });
    expect(link).toHaveAttribute("href", valid.profileUrl);
  });

  it("renderiza el texto como texto, nunca como HTML", () => {
    const withHtml = {
      ...valid,
      reviews: [{ ...valid.reviews[0], id: "xss", text: "<img src=x onerror=alert(1)>" }],
    };
    const { container } = render(<Reviews dict={dict} file={withHtml} locale="es" />);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("<img src=x onerror=alert(1)>")).toBeInTheDocument();
  });
});

describe("Reviews sin datos", () => {
  it("no renderiza absolutamente nada", () => {
    const { container } = render(<Reviews dict={dict} file={EMPTY_REVIEWS} locale="es" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("tampoco renderiza el rótulo de la sección", () => {
    render(<Reviews dict={dict} file={EMPTY_REVIEWS} locale="es" />);
    expect(screen.queryByText(dict.reviews.eyebrow)).not.toBeInTheDocument();
  });
});
