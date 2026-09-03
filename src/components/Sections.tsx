import { site } from "@/config/site";
import type { Dict } from "@/i18n/dictionaries";
import { IconNote } from "./icons";

export function Services({ dict }: { dict: Dict }) {
  return (
    <section id="servicios" className="bg-marfil">
      <div className="section">
        <p className="eyebrow">{dict.services.eyebrow}</p>
        <h2 className="h-section max-w-2xl">{dict.services.title}</h2>
        <p className="mt-4 max-w-2xl text-carbon/70">{dict.services.intro}</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.services.items.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-carbon/10 bg-white/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-dorado/50 hover:shadow-lg hover:shadow-carbon/5"
            >
              <IconNote className="h-7 w-7 text-dorado" />
              <h3 className="mt-5 font-serif text-2xl font-medium text-carbon">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-carbon/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About({ dict }: { dict: Dict }) {
  return (
    <section id="sobre-mi" className="bg-marfil2">
      <div className="section grid items-center gap-12 md:grid-cols-2">
        {/* Retrato placeholder — swap por foto profesional */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-carbon2 to-burdeos">
          <div className="absolute inset-0 flex items-center justify-center">
            <IconNote className="h-20 w-20 text-dorado/40" />
          </div>
          <span className="absolute bottom-4 left-4 text-xs uppercase tracking-widest2 text-marfil/60">
            {dict.about.photoSoon}
          </span>
        </div>

        <div>
          <p className="eyebrow">{dict.about.eyebrow}</p>
          <h2 className="h-section">{dict.about.title}</h2>
          <div className="mt-5 space-y-4 text-carbon/75">
            {dict.about.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {dict.about.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm text-carbon/80">
                <span className="h-1.5 w-1.5 rounded-full bg-dorado" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Process({ dict }: { dict: Dict }) {
  return (
    <section className="bg-carbon text-marfil">
      <div className="section">
        <p className="eyebrow !text-dorado">{dict.process.eyebrow}</p>
        <h2 className="h-section !text-marfil max-w-2xl">{dict.process.title}</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {dict.process.steps.map((s) => (
            <div key={s.title} className="border-t border-dorado/40 pt-5">
              <h3 className="font-serif text-2xl text-marfil">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-marfil/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Events({ dict }: { dict: Dict }) {
  // Cuando tengas fechas, rellena este array: { date, title, place }
  const events: { date: string; title: string; place: string }[] = [];

  return (
    <section id="eventos" className="bg-marfil">
      <div className="section">
        <p className="eyebrow">{dict.events.eyebrow}</p>
        <h2 className="h-section">{dict.events.title}</h2>
        <p className="mt-4 max-w-2xl text-carbon/70">{dict.events.intro}</p>

        <div className="mt-10">
          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-carbon/20 p-10 text-center text-carbon/70">
              {dict.events.empty}
            </div>
          ) : (
            <ul className="divide-y divide-carbon/10">
              {events.map((e, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-5">
                  <span className="w-28 font-medium text-dorado">{e.date}</span>
                  <span className="font-serif text-xl text-carbon">{e.title}</span>
                  <span className="text-sm text-carbon/60">{e.place}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export function Media({ dict }: { dict: Dict }) {
  const ids = site.media.youtubeIds.filter(Boolean);

  return (
    <section id="media" className="bg-marfil2">
      <div className="section">
        <p className="eyebrow">{dict.media.eyebrow}</p>
        <h2 className="h-section">{dict.media.title}</h2>
        <p className="mt-4 max-w-2xl text-carbon/70">{dict.media.intro}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {ids.length > 0
            ? ids.map((id, i) => (
                <div key={id} className="aspect-video overflow-hidden rounded-xl bg-carbon">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${id}`}
                    title={`${dict.media.videoTitle} ${i + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))
            : [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-carbon/20 bg-white/40 text-center text-sm text-carbon/70"
                >
                  {dict.media.placeholder}
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ dict }: { dict: Dict }) {
  // Oculta la sección hasta que haya testimonios REALES en dictionaries.ts
  if (dict.testimonials.items.length === 0) return null;
  return (
    <section className="bg-marfil">
      <div className="section">
        <p className="eyebrow">{dict.testimonials.eyebrow}</p>
        <h2 className="h-section max-w-2xl">{dict.testimonials.title}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {dict.testimonials.items.map((t, i) => (
            <figure key={i} className="rounded-2xl border border-carbon/10 bg-white/50 p-7">
              <div className="font-serif text-4xl leading-none text-dorado">&ldquo;</div>
              <blockquote className="mt-2 text-carbon/80">{t.quote}</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-medium text-carbon">{t.author}</span>
                <span className="block text-carbon/70">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq({ dict }: { dict: Dict }) {
  return (
    <section className="bg-marfil2">
      <div className="section max-w-3xl">
        <p className="eyebrow">{dict.faq.eyebrow}</p>
        <h2 className="h-section">{dict.faq.title}</h2>
        <div className="mt-8 divide-y divide-carbon/10">
          {dict.faq.items.map((f, i) => (
            <details key={i} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-xl text-carbon">
                {f.q}
                <span className="ml-4 text-dorado transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-carbon/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
