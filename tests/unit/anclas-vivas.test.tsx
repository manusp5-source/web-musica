import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import HomePage from "@/components/HomePage";
import Hero from "@/components/Hero";
import { getDict } from "@/i18n/dictionaries";

/**
 * Hallazgo de la review adversarial (11 sep): `#tarifa` existía como sección pero ningún
 * `href` de toda la página apuntaba a ella — el CTA principal prometía "Ver tarifa" y
 * enlazaba a `#contacto`, y `Nav.tsx` no la listaba. El precio publicado es una de las
 * tres patas del posicionamiento (§4 del plan de negocio) y era inalcanzable por enlace.
 *
 * Generalizado en vez de fijado a un solo caso: toda sección con `id` tiene que tener al
 * menos un `href="#ese-id"` en algún sitio de la página. Si mañana aparece otra sección
 * nueva sin enlazar, esto se pone rojo solo, sin que nadie tenga que acordarse de añadirla
 * a una lista — mismo principio que `EV-008`/`EV-013`/`EV-015`.
 */
function idsYHrefsAncla(html: string) {
  // Solo el `id` de un <section>: son los objetivos de navegación reales. Un `id` en un
  // <input> (p. ej. "cf-name") existe para su <label htmlFor>, no para un enlace — primer
  // intento de este mismo test los contaba igual y daba un falso positivo.
  const ids = [...html.matchAll(/<section\b[^>]*\sid="([\w-]+)"/g)].map((m) => m[1]);
  const hrefs = [...html.matchAll(/href="#([\w-]+)"/g)].map((m) => m[1]);
  return { ids: new Set(ids), hrefs: new Set(hrefs) };
}

describe("Ninguna sección con id queda sin enlace entrante", () => {
  it("en la home ES, todo id tiene un href=\"#id\" en algún sitio de la página", () => {
    const { container } = render(<HomePage locale="es" />);
    const { ids, hrefs } = idsYHrefsAncla(container.innerHTML);
    const huerfanos = [...ids].filter((id) => !hrefs.has(id));
    expect(huerfanos, `sin enlace entrante: ${huerfanos.join(", ")}`).toEqual([]);
  });

  it("en la home EN, todo id tiene un href=\"#id\" en algún sitio de la página", () => {
    const { container } = render(<HomePage locale="en" />);
    const { ids, hrefs } = idsYHrefsAncla(container.innerHTML);
    const huerfanos = [...ids].filter((id) => !hrefs.has(id));
    expect(huerfanos, `sin enlace entrante: ${huerfanos.join(", ")}`).toEqual([]);
  });

  it("el CTA principal del hero enlaza a la tarifa, no a contacto", () => {
    // Renderizado el Hero SOLO, no toda la home: así el test aísla la fuente del enlace.
    // La primera versión comprobaba "algún href=#tarifa en la página", y con Nav.tsx ya
    // proveyéndolo, un regreso aislado del botón del hero no se habría detectado —
    // hallazgo del revisor en la pasada de reverificación, corregido aquí.
    const dict = getDict("es");
    const { getByRole } = render(<Hero dict={dict} />);
    const cta = getByRole("link", { name: dict.hero.ctaPrimary });
    expect(cta).toHaveAttribute("href", "#tarifa");
  });
});
