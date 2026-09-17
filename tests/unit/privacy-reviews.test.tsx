import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacidadES from "../../app/(es)/privacidad/page";
import PrivacyEN from "../../app/(en)/en/privacy/page";
import { site } from "@/config/site";

/**
 * M1-UJ-005 — la política de privacidad explica de dónde salen las reseñas, con base
 * jurídica y vía de retirada, en los dos idiomas. Es el tercer criterio de aceptación
 * del UJ; los dos primeros (disclosure en la sección, atribución por reseña) ya los
 * cubren EV-001/EV-003.
 */
describe("Política de privacidad — apartado de reseñas (ES)", () => {
  it("explica el origen de las reseñas y su base legal", () => {
    render(<PrivacidadES />);
    // El título del apartado 2 y la referencia cruzada de la sección de legitimación
    // mencionan las dos "reseñas de Google" a propósito — de ahí getAllByText.
    expect(screen.getAllByText(/Rese[ñn]as de Google/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/inter[ée]s leg[ií]timo/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/6\.1\.f/).length).toBeGreaterThan(0);
  });

  it("explica cómo pedir la retirada, con el email real de privacidad", () => {
    render(<PrivacidadES />);
    // El email aparece varias veces en la página (responsable, derechos, reseñas):
    // basta con que exista al menos una vez cerca del texto de retirada.
    expect(screen.getAllByText(site.legal.privacyEmail).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/retirar/i).length).toBeGreaterThan(0);
  });

  it("no promete plazo distinto del que se puede cumplir de verdad", () => {
    render(<PrivacidadES />);
    expect(screen.getByText(/30 d[íi]as/)).toBeInTheDocument();
  });
});

describe("Privacy policy — reviews section (EN)", () => {
  it("explains the source of the reviews and the legal basis", () => {
    render(<PrivacyEN />);
    // The section-2 heading and the section-4 cross-reference both say "Google Reviews"
    // on purpose — hence getAllByText instead of getByText.
    expect(screen.getAllByText(/Google Reviews/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/legitimate interest/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/6\.1\.f/).length).toBeGreaterThan(0);
  });

  it("explains how to request removal, with the real privacy email", () => {
    render(<PrivacyEN />);
    expect(screen.getAllByText(site.legal.privacyEmail).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/remov(e|al)/i).length).toBeGreaterThan(0);
  });
});

describe("Coherencia ES/EN", () => {
  it("las dos versiones mencionan el mismo email de privacidad", () => {
    const { unmount } = render(<PrivacidadES />);
    const es = screen.getAllByText(site.legal.privacyEmail).length;
    unmount();
    render(<PrivacyEN />);
    const en = screen.getAllByText(site.legal.privacyEmail).length;
    expect(en).toBe(es);
  });
});
