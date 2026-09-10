import { describe, expect, it, afterEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import Nav from "@/components/Nav";
import { getDict } from "@/i18n/dictionaries";

/**
 * Cubre el bug real de la review: el header no tenía color de texto propio, así que
 * arriba del todo (sin scroll) leía carbón sobre el hero oscuro — ≈1:1 de contraste.
 * El arreglo hace que el texto cambie con `scrolled`; este test comprueba que ese
 * cambio ocurre de verdad, no solo el fondo.
 */
describe("Nav — contraste según scroll", () => {
  afterEach(() => {
    cleanup();
    window.scrollY = 0;
  });

  it("arriba del todo usa texto claro (marfil), no carbón sobre el hero oscuro", () => {
    window.scrollY = 0;
    const { container } = render(<Nav dict={getDict("es")} locale="es" />);

    const header = container.querySelector("header")!;
    const logo = container.querySelector("header a")!;

    // El panel nunca es transparente de verdad: siempre lleva su propio fondo.
    expect(header.className).not.toContain("bg-transparent");
    expect(header.className).toMatch(/bg-carbon\/\d+/);
    expect(logo.className).toContain("text-marfil");
    expect(logo.className).not.toContain("text-carbon");
  });

  it("tras hacer scroll, el fondo se aclara y el texto pasa a oscuro", () => {
    window.scrollY = 100;
    const { container } = render(<Nav dict={getDict("es")} locale="es" />);
    // El listener se añade en useEffect; se dispara aquí para que aplique el estado inicial.
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    const header = container.querySelector("header")!;
    const logo = container.querySelector("header a")!;

    expect(header.className).toMatch(/bg-marfil\/\d+/);
    expect(logo.className).toContain("text-carbon");
  });
});
