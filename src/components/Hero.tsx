import type { Dict } from "@/i18n/dictionaries";
import { site } from "@/config/site";
import { IconArrow, IconPin } from "./icons";
import Hero3D from "./hero3d/Hero3D";

export default function Hero({ dict }: { dict: Dict }) {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      {/* Fondo: gradiente elegante (placeholder hasta foto/vídeo real) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-carbon via-carbon2 to-burdeos" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #C9A86A 0%, transparent 40%), radial-gradient(circle at 80% 70%, #C9A86A 0%, transparent 35%)",
        }}
      />
      {/*
        SWAP FOTO/VÍDEO: cuando tengas material, sustituye el bloque de arriba por:
        <Image src="/hero.jpg" alt="" fill priority className="object-cover -z-10" />
        o un <video> de fondo.
      */}

      {/* Partículas 3D audio-reactivas (se auto-desactivan en móvil/reduce-motion) */}
      {site.effects.hero3d && <Hero3D label={dict.hero.ctaSecondary} />}

      {/* Velo para garantizar legibilidad del texto sobre las partículas */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-carbon/80 via-carbon/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-carbon/60 via-transparent to-carbon/20" />

      {/* Ambiente móvil: el 3D se apaga ≤768px; estos halos dan textura sin coste */}
      <div className="pointer-events-none absolute inset-0 z-0 md:hidden" aria-hidden>
        <div className="absolute right-[-10%] top-[15%] h-64 w-64 rounded-full bg-dorado/20 blur-3xl motion-safe:animate-pulse" />
        <div className="absolute bottom-[20%] left-[-15%] h-72 w-72 rounded-full bg-burdeos/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-32 text-marfil">
        <div className="max-w-3xl motion-safe:animate-fadeUp">
          <p className="eyebrow !text-dorado">{dict.hero.eyebrow}</p>
          <h1 className="font-serif text-4xl font-medium leading-[1.05] md:text-6xl lg:text-7xl">
            {dict.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-marfil/80 md:text-xl">
            {dict.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#contacto" className="btn-gold group">
              {dict.hero.ctaPrimary}
              <IconArrow className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#media" className="btn border border-marfil/40 text-marfil hover:bg-marfil hover:text-carbon">
              {dict.hero.ctaSecondary}
            </a>
          </div>

          <div className="mt-10 flex items-center gap-2 text-sm text-marfil/70">
            <IconPin className="h-4 w-4 text-dorado" />
            {dict.hero.location}
          </div>
        </div>
      </div>

      {/* Tira de confianza */}
      <div className="absolute inset-x-0 bottom-0 border-t border-marfil/10 bg-carbon/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6 py-4 text-center text-xs uppercase tracking-widest2 text-marfil/60">
          {dict.trust.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
