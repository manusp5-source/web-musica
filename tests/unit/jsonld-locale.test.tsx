import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import HomePage from "@/components/HomePage";
import { site } from "@/config/site";

/**
 * Hallazgo de la review adversarial (11 sep): el JSON-LD de `/en` publicaba
 * `url: site.domain` sin `/en` — la URL de la home española, en la página inglesa.
 * Ningún test lo cubría porque EV-004 solo mira `aggregateRating`/`review`, no `url`.
 */
function jsonLdDe(html: string) {
  const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  if (!match) throw new Error("No se encontró el bloque JSON-LD");
  return JSON.parse(match[1].replace(/\\u003c/g, "<"));
}

describe("JSON-LD — url coherente con el locale", () => {
  it("la home ES declara la raíz del dominio", () => {
    const { container } = render(<HomePage locale="es" />);
    const ld = jsonLdDe(container.innerHTML);
    expect(ld.url).toBe(site.domain);
  });

  it("la home EN declara /en, no la raíz española", () => {
    const { container } = render(<HomePage locale="en" />);
    const ld = jsonLdDe(container.innerHTML);
    expect(ld.url).toBe(`${site.domain}/en`);
  });

  it("las dos URLs son distintas entre sí", () => {
    const es = jsonLdDe(render(<HomePage locale="es" />).container.innerHTML);
    const en = jsonLdDe(render(<HomePage locale="en" />).container.innerHTML);
    expect(en.url).not.toBe(es.url);
  });
});
