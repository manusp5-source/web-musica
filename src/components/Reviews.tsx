import type { Dict, Locale } from "@/i18n/dictionaries";
import { visibleReviews } from "@/lib/reviews/load";
import type { Review, ReviewsFile } from "@/lib/reviews/schema";

/**
 * Sección de reseñas — M1-UJ-001. Server Component: los datos se resuelven en build y al
 * navegador llega HTML. No añade ni un byte de JavaScript de cliente.
 *
 * Recibe el fichero por props en lugar de leerlo aquí: así se puede probar sin tocar disco.
 * Quien lo lee es la página (`HomePage`), una sola vez.
 */

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span aria-hidden className="text-dorado">
        {"★".repeat(rating)}
        <span className="text-carbon/20">{"★".repeat(5 - rating)}</span>
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

function Avatar({ author }: { author: string }) {
  // Iniciales, no la foto de Google: evita abrir la CSP a lh3.googleusercontent.com y
  // que el visitante haga peticiones a Google sin necesitarlo. (Q-02 de planning/questions)
  const initials = author
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span
      aria-hidden
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dorado/20 font-serif text-sm text-bronce"
    >
      {initials}
    </span>
  );
}

function ReviewCard({ review, dict, locale }: { review: Review; dict: Dict; locale: Locale }) {
  const date = new Date(review.createdAt);
  const formatted = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
    month: "short",
    year: "numeric",
  }).format(date);

  return (
    <figure className="flex flex-col rounded-2xl border border-carbon/10 bg-white/50 p-7">
      <div className="flex items-center gap-3">
        <Avatar author={review.author} />
        <div className="min-w-0">
          <span className="block truncate font-medium text-carbon">{review.author}</span>
          <span className="flex items-center gap-2 text-sm text-carbon/70">
            <Stars rating={review.rating} label={dict.reviews.starsLabel.replace("{n}", String(review.rating))} />
            <time dateTime={review.createdAt}>{formatted}</time>
          </span>
        </div>
      </div>

      {/* Ternario y no &&: con && un valor vacío puede acabar renderizándose */}
      {review.text.trim().length > 0 ? (
        <blockquote className="mt-5 text-carbon/80">{review.text}</blockquote>
      ) : null}
    </figure>
  );
}

export default function Reviews({
  dict,
  file,
  locale,
}: {
  dict: Dict;
  file: ReviewsFile;
  locale: Locale;
}) {
  // Sin nada que enseñar, la sección no existe. Ni rótulo, ni marco, ni "aún no hay
  // reseñas": una sección vacía en una web de contratación resta.
  if (file.aggregate.count === 0 && file.reviews.length === 0) return null;

  const shown = visibleReviews(file);
  const aggregateLabel = dict.reviews.aggregate
    .replace("{rating}", file.aggregate.rating.toLocaleString(locale === "es" ? "es-ES" : "en-GB"))
    .replace("{count}", String(file.aggregate.count));

  return (
    <section id="opiniones" className="bg-marfil">
      <div className="section">
        <p className="eyebrow">{dict.reviews.eyebrow}</p>
        <h2 className="h-section max-w-2xl">{dict.reviews.title}</h2>

        <p className="mt-4 flex items-center gap-2 text-carbon/80">
          <Stars
            rating={Math.round(file.aggregate.rating)}
            label={dict.reviews.starsLabel.replace("{n}", String(Math.round(file.aggregate.rating)))}
          />
          <span>{aggregateLabel}</span>
        </p>

        {shown.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {shown.map((review) => (
              <ReviewCard key={review.id} review={review} dict={dict} locale={locale} />
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Exigido por el RDL 24/2021 (Directiva Omnibus): hay que decir de dónde salen
              las reseñas y si se verifica que son de clientes reales. No es decorativo. */}
          <p className="max-w-xl text-carbon/60">{dict.reviews.disclosure}</p>
          {file.profileUrl !== null ? (
            <a
              href={file.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 font-medium text-bronce underline underline-offset-4"
            >
              {dict.reviews.cta}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
