import { site } from "@/config/site";
import { getDict, type Locale } from "@/i18n/dictionaries";
import Nav from "./Nav";
import Hero from "./Hero";
import { Services, About, Process, Events, Media, Faq } from "./Sections";
import Reviews from "./Reviews";
import Contact from "./Contact";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import CookieBanner from "./CookieBanner";
import { loadReviews } from "@/lib/reviews/load";

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
    areaServed: { "@type": "Country", name: "España" },
    genre: ["Classical", "Wedding", "Live music"],
    sameAs: [site.social.instagram, site.social.youtube, site.social.spotify].filter(Boolean),
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
