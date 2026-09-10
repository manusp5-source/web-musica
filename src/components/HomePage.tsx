import { site } from "@/config/site";
import { getDict, type Locale } from "@/i18n/dictionaries";
import Nav from "./Nav";
import Hero from "./Hero";
import { Services, Pricing, About, Process, Events, Media, Faq } from "./Sections";
import Reviews from "./Reviews";
import Contact from "./Contact";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import CookieBanner from "./CookieBanner";
import { loadReviews } from "@/lib/reviews/load";
import { buildRatingJsonLd } from "@/lib/reviews/jsonld";

export default function HomePage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  // Se lee una sola vez, en build. Las dos raíces de idioma comparten el mismo fichero.
  const reviews = loadReviews();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["MusicGroup", "LocalBusiness"],
    name: site.brand,
    description: dict.seo.description,
    url: site.domain,
    email: site.email,
    telephone: "+" + site.whatsapp,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: "ES",
    },
    // El área servida es la provincia, no el país: el plan de negocio acota a Granada
    // en el año 1, y declarar "España" diluye la señal local que es todo el activo SEO.
    areaServed: { "@type": "AdministrativeArea", name: site.region },
    genre: ["Classical", "Wedding", "Ceremony music", "Viola"],
    // Rango real de la tarifa publicada. Coherente con la sección de precios: si cambia
    // una, cambia la otra, porque salen del mismo sitio.
    priceRange: "150 € – 990 €",
    sameAs: [site.social.instagram, site.social.youtube, site.social.spotify].filter(Boolean),
    // Valoración y reseñas. Sin datos no añade ninguna clave: lo declarado siempre
    // coincide con lo que se ve en la página (M1-UJ-003).
    ...buildRatingJsonLd(reviews),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escape defensivo de "<" para impedir cierre prematuro de </script>
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Nav dict={dict} locale={locale} />
      <main>
        <Hero dict={dict} />
        <Services dict={dict} />
        {/* La tarifa va justo detrás de los servicios: es lo que el visitante viene a
            buscar y lo que ningún competidor local le enseña sin pedirla. */}
        <Pricing dict={dict} />
        <Media dict={dict} />
        <About dict={dict} />
        <Process dict={dict} />
        <Reviews dict={dict} file={reviews} locale={locale} />
        <Events dict={dict} />
        <Faq dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer dict={dict} />
      <WhatsAppButton label={dict.contact.whatsapp} prefill={dict.contact.prefill} />
      <CookieBanner dict={dict} />
    </>
  );
}
