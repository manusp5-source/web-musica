import { describe, expect, it, afterEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import Nav from "@/components/Nav";
import { getDict } from "@/i18n/dictionaries";

/**
 * Cubre el bug real de la review: el header no tenía color de texto propio, así que
 * arriba del todo (sin scroll) leía carbón sobre el hero oscuro — ≈1:1 de contraste.
 * El arreglo hacía que el texto cambiara con `scrolled`; ahora que el rótulo de texto
 * se sustituyó por el logo (SVG con sus propios colores fijos), el mismo problema se
 * resuelve cambiando de fichero en vez de clase — este test comprueba que la variante
 * correcta se sirve en cada caso, no solo que el fondo cambia.
 */
describe("Nav — contraste según scroll", () => {
  afterEach(() => {
    cleanup();
    window.scrollY = 0;
  });

  it("arriba del todo usa el logo claro (marfil), legible sobre el hero oscuro", () => {
    window.scrollY = 0;
    const { container } = render(<Nav dict={getDict("es")} locale="es" />);

    const header = container.querySelector("header")!;
    const logoImg = container.querySelector("header a img")!;

    // El panel nunca es transparente de verdad: siempre lleva su propio fondo.
    expect(header.className).not.toContain("bg-transparent");
    expect(header.className).toMatch(/bg-carbon\/\d+/);
    expect(logoImg.getAttribute("src")).toBe("/logo/logo-horizontal-dark.svg");
  });

  it("tras hacer scroll, el fondo se aclara y el logo pasa a la variante oscura", () => {
    window.scrollY = 100;
    const { container } = render(<Nav dict={getDict("es")} locale="es" />);
    // El listener se añade en useEffect; se dispara aquí para que aplique el estado inicial.
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    const header = container.querySelector("header")!;
    const logoImg = container.querySelector("header a img")!;

    expect(header.className).toMatch(/bg-marfil\/\d+/);
    expect(logoImg.getAttribute("src")).toBe("/logo/logo-horizontal.svg");
  });
});
