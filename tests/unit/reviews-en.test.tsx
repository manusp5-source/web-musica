import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { join } from "node:path";
import Reviews from "@/components/Reviews";
import { loadReviews } from "@/lib/reviews/load";
import { getDict } from "@/i18n/dictionaries";

const valid = loadReviews(join(process.cwd(), "tests", "fixtures", "reviews.valid.json"));
const es = getDict("es");
const en = getDict("en");

describe("Reviews en la raíz inglesa", () => {
  it("traduce los rótulos", () => {
    render(<Reviews dict={en} file={valid} locale="en" />);
    expect(screen.getByText("Reviews")).toBeInTheDocument();
    expect(screen.getByText("What my clients say")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See all on Google" })).toBeInTheDocument();
  });

  it("NO traduce el texto de las reseñas: cada una en su idioma original", () => {
    render(<Reviews dict={en} file={valid} locale="en" />);
    expect(
      screen.getByText("Tocó en nuestra boda y fue el momento más recordado del día.")
    ).toBeInTheDocument();
  });

  it("formatea la fecha con la convención inglesa", () => {
    const { unmount } = render(<Reviews dict={en} file={valid} locale="en" />);
    const inglesa = screen.getAllByText(/2026/)[0].textContent;
    unmount();

    render(<Reviews dict={es} file={valid} locale="es" />);
    const espanola = screen.getAllByText(/2026/)[0].textContent;

    expect(inglesa).not.toBe(espanola);
  });

  it("usa la etiqueta de estrellas en inglés", () => {
    render(<Reviews dict={en} file={valid} locale="en" />);
    expect(screen.getByText("1 out of 5 stars")).toBeInTheDocument();
  });

  it("declara el origen de las reseñas también en inglés (Omnibus)", () => {
    render(<Reviews dict={en} file={valid} locale="en" />);
    expect(screen.getByText(en.reviews.disclosure)).toBeInTheDocument();
  });

  it("las dos raíces leen el mismo fichero: no hay dos fuentes de datos", () => {
    const { unmount } = render(<Reviews dict={en} file={valid} locale="en" />);
    const enIds = screen.getAllByRole("figure").length;
    unmount();

    render(<Reviews dict={es} file={valid} locale="es" />);
    expect(screen.getAllByRole("figure")).toHaveLength(enIds);
  });
});
