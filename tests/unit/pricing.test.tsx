import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pricing } from "@/components/Sections";
import { getDict, locales } from "@/i18n/dictionaries";

/**
 * La tarifa publicada es el diferenciador central del plan (§4): ningún competidor local
 * publica precio. Estos tests existen para que no desaparezca por descuido en un rediseño.
 */
describe("Pricing", () => {
  it("pinta las seis líneas de la tarifa", () => {
    render(<Pricing dict={getDict("es")} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
  });

  it("enseña el precio de entrada, que es el que sostiene el titular del hero", () => {
    const dict = getDict("es");
    render(<Pricing dict={dict} />);
    expect(screen.getByText("390 €")).toBeInTheDocument();
    // El hero promete "desde 390 €": si alguien sube la tarifa y olvida el hero, mienten.
    expect(dict.hero.subtitle).toContain("390 €");
  });

  it("declara la política de desplazamiento junto al precio, no escondida en la FAQ", () => {
    const dict = getDict("es");
    render(<Pricing dict={dict} />);
    expect(screen.getByText(dict.pricing.note)).toBeInTheDocument();
    expect(dict.pricing.note).toMatch(/50 km/);
  });

  it("los dos idiomas tienen las mismas líneas y los mismos importes", () => {
    const es = getDict("es").pricing.items;
    const en = getDict("en").pricing.items;
    expect(en).toHaveLength(es.length);

    const soloDigitos = (p: string) => p.replace(/\D/g, "");
    expect(en.map((i) => soloDigitos(i.price))).toEqual(es.map((i) => soloDigitos(i.price)));
  });

  it("hay exactamente un paquete destacado", () => {
    for (const locale of locales) {
      const destacados = getDict(locale).pricing.items.filter((i) => i.featured);
      expect(destacados, `${locale} debe destacar un solo paquete`).toHaveLength(1);
    }
  });
});
