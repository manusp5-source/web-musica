"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import type { Dict, Locale } from "@/i18n/dictionaries";
import { IconMenu, IconClose } from "./icons";

export default function Nav({ dict, locale }: { dict: Dict; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mismo orden que las secciones en HomePage.tsx. "Tarifa" faltaba: la review
  // adversarial encontró que #tarifa no tenía ni un solo enlace entrante en toda la
  // página — el precio publicado es una de las tres patas del posicionamiento (§4 del
  // plan de negocio) y era inalcanzable salvo haciendo scroll a ciegas.
  const links = [
    { href: "#servicios", label: dict.nav.services },
    { href: "#tarifa", label: dict.nav.pricing },
    { href: "#media", label: dict.nav.media },
    { href: "#sobre-mi", label: dict.nav.about },
    { href: "#eventos", label: dict.nav.events },
  ];

  const otherLocale: Locale = locale === "es" ? "en" : "es";
  const otherHref = otherLocale === "es" ? "/" : "/en";

  /**
   * Legibilidad del header — INT-005 / EV-014.
   *
   * Antes: `bg-transparent` con texto `text-carbon` fijo. Sin hacer scroll, eso queda
   * leyendo carbón sobre el gradiente oscuro del hero: contraste medido ≈1:1 en la
   * review. Arreglo: el panel nunca es transparente de verdad (siempre lleva su propio
   * fondo semiopaco), y cada tono cambia con `scrolled` para que el texto siempre lea
   * contra SU panel, nunca contra lo que haya detrás en el hero (gradiente hoy, foto o
   * vídeo mañana).
   *
   * Los cuatro `const` de abajo son justo lo que EV-014 verifica: compone cada panel
   * sobre marfil y sobre carbón —los dos extremos de la paleta— y exige 4.5:1 en ambos.
   */
  const panel = scrolled ? "bg-marfil/90 shadow-sm backdrop-blur" : "bg-carbon/70 backdrop-blur-sm";
  const textStrong = scrolled ? "text-carbon" : "text-marfil";
  const textMuted = scrolled ? "text-carbon/80 hover:text-carbon" : "text-marfil/90 hover:text-marfil";
  const textFaint = scrolled ? "text-carbon/70 hover:text-carbon" : "text-marfil/80 hover:text-marfil";

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${panel}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className={`font-serif text-xl tracking-wide transition-colors ${textStrong}`}>
          {site.brand}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={`text-sm transition-colors ${textMuted}`}>
              {l.label}
            </a>
          ))}
          <a href={otherHref} className={`text-sm font-medium uppercase tracking-wide transition-colors ${textFaint}`}>
            {otherLocale}
          </a>
          <a href="#contacto" className="btn-gold !px-5 !py-2 text-sm">
            {dict.nav.cta}
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className={`transition-colors md:hidden ${textStrong}`}
          aria-label={dict.nav.menu}
          aria-expanded={open}
        >
          {open ? <IconClose className="h-7 w-7" /> : <IconMenu className="h-7 w-7" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-carbon/10 bg-marfil md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-carbon/80"
              >
                {l.label}
              </a>
            ))}
            <a href="#contacto" onClick={() => setOpen(false)} className="btn-gold mt-2 w-full">
              {dict.nav.cta}
            </a>
            <a href={otherHref} className="mt-3 text-sm uppercase tracking-wide text-carbon/70">
              {otherLocale === "es" ? "Español" : "English"}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
