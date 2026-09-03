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

  const links = [
    { href: "#servicios", label: dict.nav.services },
    { href: "#media", label: dict.nav.media },
    { href: "#sobre-mi", label: dict.nav.about },
    { href: "#eventos", label: dict.nav.events },
  ];

  const otherLocale: Locale = locale === "es" ? "en" : "es";
  const otherHref = otherLocale === "es" ? "/" : "/en";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-marfil/90 shadow-sm backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-serif text-xl tracking-wide text-carbon">
          {site.brand}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-carbon/80 transition-colors hover:text-carbon">
              {l.label}
            </a>
          ))}
          <a href={otherHref} className="text-sm font-medium uppercase tracking-wide text-carbon/70 hover:text-carbon">
            {otherLocale}
          </a>
          <a href="#contacto" className="btn-gold !px-5 !py-2 text-sm">
            {dict.nav.cta}
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-carbon md:hidden"
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
