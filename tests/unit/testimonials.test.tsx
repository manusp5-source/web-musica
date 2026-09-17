import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Testimonials } from "@/components/Sections";
import { getDict, type Dict } from "@/i18n/dictionaries";

/**
 * Este invariante se hereda en M1-UJ-001: sin datos, la sección no se renderiza.
 * Cuando Testimonials sea sustituido por Reviews, el test se mueve, no se borra.
 */
describe("Testimonials", () => {
  it("no renderiza nada cuando no hay testimonios", () => {
    const { container } = render(<Testimonials dict={getDict("es")} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza una tarjeta por testimonio cuando los hay", () => {
    const dict = getDict("es");
    const withItems = {
      ...dict,
      testimonials: {
        ...dict.testimonials,
        items: [
          { quote: "Tocó en nuestra boda y fue perfecto.", author: "Laura M.", role: "Boda en Madrid" },
          { quote: "Puntual y muy profesional.", author: "Javier R.", role: "Evento de empresa" },
        ],
      },
    } as Dict;

    render(<Testimonials dict={withItems} />);

    expect(screen.getByText("Laura M.")).toBeInTheDocument();
    expect(screen.getByText("Javier R.")).toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(2);
  });
});
