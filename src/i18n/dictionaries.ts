/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  TEXTOS DE LA WEB (ES / EN) — EDITA AQUÍ TODA LA COPY              ║
 * ║  La estructura es idéntica en ambos idiomas.                      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

export type Locale = "es" | "en";
export const locales: Locale[] = ["es", "en"];
export const defaultLocale: Locale = "es";

type Service = { title: string; desc: string };
type Faq = { q: string; a: string };
type Testimonial = { quote: string; author: string; role: string };
type Step = { title: string; desc: string };

export type Dict = {
  seo: { description: string };
  nav: { services: string; media: string; about: string; events: string; contact: string; cta: string; menu: string };
  hero: { eyebrow: string; title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string; location: string };
  trust: string[];
  services: { eyebrow: string; title: string; intro: string; items: Service[] };
  media: { eyebrow: string; title: string; intro: string; placeholder: string; videoTitle: string };
  about: { eyebrow: string; title: string; body: string[]; highlights: string[]; photoSoon: string };
  process: { eyebrow: string; title: string; steps: Step[] };
  events: { eyebrow: string; title: string; intro: string; empty: string };
  testimonials: { eyebrow: string; title: string; items: Testimonial[] };
  faq: { eyebrow: string; title: string; items: Faq[] };
  contact: {
    eyebrow: string; title: string; intro: string;
    name: string; emailField: string; phone: string; date: string; type: string; message: string;
    typeOptions: string[]; submit: string; whatsapp: string; or: string; sent: string;
    error: string; mailtoHint: string; prefill: string;
  };
  footer: { rights: string; built: string };
  legal: {
    notice: string; privacy: string; cookies: string; consent: string; consentLink: string;
    consentEmail: string;
    paths: { notice: string; privacy: string; cookies: string };
  };
  cookieBanner: { text: string; accept: string; reject: string };
};

export const dictionaries: Record<Locale, Dict> = {
  es: {
    seo: {
      description:
        "Piano y viola en directo para bodas, eventos corporativos y celebraciones. Música en vivo a medida en toda España.",
    },
    nav: { services: "Servicios", media: "Escuchar", about: "Sobre mí", events: "Eventos", contact: "Contratar", cta: "Reservar fecha", menu: "Menú" },
    hero: {
      eyebrow: "Música en vivo para eventos",
      title: "Piano y viola en directo para los momentos que no se repiten",
      subtitle:
        "Un solo músico, dos instrumentos. Pongo la banda sonora de tu boda, evento corporativo o celebración con la elegancia que cada momento merece.",
      ctaPrimary: "Consultar disponibilidad",
      ctaSecondary: "Escuchar",
      location: "Madrid · Disponible en toda España",
    },
    trust: ["Bodas", "Eventos corporativos", "Hoteles & restaurantes", "Celebraciones privadas"],
    services: {
      eyebrow: "Servicios",
      title: "Música a medida para cada momento",
      intro:
        "Adapto repertorio, instrumento y formato a tu evento. Piano para el cóctel, viola para la ceremonia, o ambos para una experiencia única.",
      items: [
        { title: "Bodas", desc: "Ceremonia, cóctel y banquete. Repertorio clásico, moderno o personalizado para vuestro día." },
        { title: "Eventos corporativos", desc: "Inauguraciones, galas, cenas de empresa y presentaciones con música en directo de nivel." },
        { title: "Hoteles y restaurantes", desc: "Música ambiente recurrente que eleva la experiencia de tus clientes." },
        { title: "Celebraciones privadas", desc: "Aniversarios, cumpleaños y cenas especiales con la pieza perfecta para cada instante." },
      ],
    },
    media: {
      eyebrow: "Escuchar",
      title: "Mira y escucha",
      intro: "Una muestra del directo. La mejor forma de imaginar tu evento es escucharlo.",
      placeholder: "Vídeos próximamente — material en producción",
      videoTitle: "Vídeo",
    },
    about: {
      eyebrow: "Sobre mí",
      title: "Dos instrumentos, una misma sensibilidad",
      photoSoon: "Foto próximamente",
      body: [
        "Soy pianista y violista. Lo que empezó como una doble pasión se ha convertido en mi sello: la capacidad de cubrir un evento completo —el recogimiento de la viola en la ceremonia, la calidez del piano en el cóctel— sin perder coherencia ni elegancia.",
        "Cada evento es distinto y por eso preparo el repertorio contigo, pieza a pieza, hasta que la música cuente exactamente la historia que quieres contar.",
      ],
      highlights: ["Piano y viola en directo", "Repertorio personalizado", "Sonido propio de calidad", "Trato cercano y profesional"],
    },
    process: {
      eyebrow: "Cómo funciona",
      title: "Reservar es sencillo",
      steps: [
        { title: "1. Cuéntame tu evento", desc: "Fecha, lugar y tipo de celebración. Me escribes y te respondo con disponibilidad." },
        { title: "2. Diseñamos la música", desc: "Elegimos juntos repertorio, instrumento y momentos clave del evento." },
        { title: "3. Disfruta el directo", desc: "Llego con tiempo, monto mi equipo y me encargo de que todo suene perfecto." },
      ],
    },
    events: {
      eyebrow: "Agenda",
      title: "Próximas actuaciones",
      intro: "Dónde podrás escucharme en directo.",
      empty: "Agenda en actualización. Escríbeme para consultar fechas disponibles.",
    },
    testimonials: {
      eyebrow: "Opiniones",
      title: "Lo que dicen quienes ya me han contratado",
      // IMPORTANTE: añade aquí SOLO testimonios REALES de clientes.
      // La sección permanece oculta mientras esté vacío.
      // Formato: { quote: "…", author: "Nombre", role: "Boda en Madrid" }
      items: [],
    },
    faq: {
      eyebrow: "Dudas frecuentes",
      title: "Preguntas habituales",
      items: [
        { q: "¿Te desplazas fuera de tu ciudad?", a: "Sí. Trabajo en toda España; para desplazamientos largos lo valoramos en el presupuesto." },
        { q: "¿Puedo elegir el repertorio?", a: "Por supuesto. Preparamos juntos las piezas, incluida 'la canción' de los momentos clave." },
        { q: "¿Tocas piano y viola en el mismo evento?", a: "Sí, es mi especialidad: viola para la ceremonia y piano para el cóctel, por ejemplo." },
        { q: "¿Aportas tú el equipo de sonido?", a: "Sí, llevo mi propio equipo. Solo necesito un punto de luz y espacio para montar." },
      ],
    },
    contact: {
      eyebrow: "Contratar",
      title: "Reserva tu fecha",
      intro: "Cuéntame los detalles de tu evento y te respondo en menos de 24 h con disponibilidad y presupuesto.",
      name: "Nombre",
      emailField: "Email",
      phone: "Teléfono",
      date: "Fecha del evento",
      type: "Tipo de evento",
      message: "Cuéntame más",
      typeOptions: ["Boda", "Evento corporativo", "Hotel / Restaurante", "Celebración privada", "Otro"],
      submit: "Enviar consulta",
      whatsapp: "Escríbeme por WhatsApp",
      or: "o",
      sent: "¡Gracias! Te responderé muy pronto.",
      error: "No se pudo enviar. Inténtalo de nuevo o escríbeme directamente por WhatsApp o email.",
      mailtoHint: "Se ha abierto tu programa de correo con la consulta preparada. Si no se abrió, escríbeme directamente al email de arriba.",
      prefill: "Hola, me gustaría consultar disponibilidad para un evento.",
    },
    footer: { rights: "Todos los derechos reservados.", built: "Música en vivo para eventos en España." },
    legal: {
      notice: "Aviso legal",
      privacy: "Política de privacidad",
      cookies: "Cookies",
      consent: "He leído y acepto la",
      consentLink: "política de privacidad",
      consentEmail: "Consentimiento RGPD (política de privacidad aceptada): Sí",
      paths: { notice: "/aviso-legal", privacy: "/privacidad", cookies: "/cookies" },
    },
    cookieBanner: {
      text: "Usamos cookies analíticas para mejorar el sitio. Puedes aceptarlas o rechazarlas.",
      accept: "Aceptar",
      reject: "Rechazar",
    },
  },

  en: {
    seo: {
      description:
        "Live piano and viola for weddings, corporate events and celebrations. Tailor-made live music across Spain.",
    },
    nav: { services: "Services", media: "Listen", about: "About", events: "Events", contact: "Book", cta: "Check date", menu: "Menu" },
    hero: {
      eyebrow: "Live music for events",
      title: "Live piano and viola for the moments that happen only once",
      subtitle:
        "One musician, two instruments. I score your wedding, corporate event or celebration with the elegance every moment deserves.",
      ctaPrimary: "Check availability",
      ctaSecondary: "Listen",
      location: "Madrid · Available across Spain",
    },
    trust: ["Weddings", "Corporate events", "Hotels & restaurants", "Private celebrations"],
    services: {
      eyebrow: "Services",
      title: "Tailor-made music for every moment",
      intro:
        "I adapt repertoire, instrument and format to your event. Piano for the cocktail, viola for the ceremony, or both for a unique experience.",
      items: [
        { title: "Weddings", desc: "Ceremony, cocktail and reception. Classic, modern or fully personalised repertoire for your day." },
        { title: "Corporate events", desc: "Openings, galas, company dinners and launches with high-level live music." },
        { title: "Hotels & restaurants", desc: "Recurring ambient music that elevates your guests' experience." },
        { title: "Private celebrations", desc: "Anniversaries, birthdays and special dinners with the perfect piece for every instant." },
      ],
    },
    media: {
      eyebrow: "Listen",
      title: "Watch & listen",
      intro: "A taste of the live performance. The best way to picture your event is to hear it.",
      placeholder: "Videos coming soon — material in production",
      videoTitle: "Video",
    },
    about: {
      eyebrow: "About",
      title: "Two instruments, one sensibility",
      photoSoon: "Photo coming soon",
      body: [
        "I'm a pianist and violist. What began as a double passion became my signature: the ability to cover a whole event —the intimacy of the viola during the ceremony, the warmth of the piano at the cocktail— without losing coherence or elegance.",
        "Every event is different, so I build the repertoire with you, piece by piece, until the music tells exactly the story you want to tell.",
      ],
      highlights: ["Live piano & viola", "Personalised repertoire", "Own quality sound", "Warm, professional service"],
    },
    process: {
      eyebrow: "How it works",
      title: "Booking is simple",
      steps: [
        { title: "1. Tell me about your event", desc: "Date, venue and type of celebration. Write to me and I'll reply with availability." },
        { title: "2. We design the music", desc: "Together we choose repertoire, instrument and the key moments of your event." },
        { title: "3. Enjoy the live show", desc: "I arrive early, set up my gear and make sure everything sounds perfect." },
      ],
    },
    events: {
      eyebrow: "Agenda",
      title: "Upcoming performances",
      intro: "Where you'll be able to hear me live.",
      empty: "Agenda being updated. Write to me to check available dates.",
    },
    testimonials: {
      eyebrow: "Reviews",
      title: "What clients say",
      // IMPORTANT: add ONLY REAL client testimonials here.
      // The section stays hidden while empty.
      items: [],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      items: [
        { q: "Do you travel outside your city?", a: "Yes. I work across Spain; long trips are factored into the quote." },
        { q: "Can I choose the repertoire?", a: "Absolutely. We prepare the pieces together, including 'the song' for key moments." },
        { q: "Do you play piano and viola at the same event?", a: "Yes, that's my specialty: viola for the ceremony and piano for the cocktail, for example." },
        { q: "Do you bring the sound equipment?", a: "Yes, I bring my own gear. I just need a power point and space to set up." },
      ],
    },
    contact: {
      eyebrow: "Book",
      title: "Reserve your date",
      intro: "Tell me about your event and I'll reply within 24 h with availability and a quote.",
      name: "Name",
      emailField: "Email",
      phone: "Phone",
      date: "Event date",
      type: "Event type",
      message: "Tell me more",
      typeOptions: ["Wedding", "Corporate event", "Hotel / Restaurant", "Private celebration", "Other"],
      submit: "Send enquiry",
      whatsapp: "Message me on WhatsApp",
      or: "or",
      sent: "Thank you! I'll get back to you very soon.",
      error: "It couldn't be sent. Please try again, or contact me directly via WhatsApp or email.",
      mailtoHint: "Your email client should have opened with the enquiry ready. If it didn't, write to me directly at the email above.",
      prefill: "Hi! I'd like to check availability for an event.",
    },
    footer: { rights: "All rights reserved.", built: "Live music for events in Spain." },
    legal: {
      notice: "Legal notice",
      privacy: "Privacy policy",
      cookies: "Cookies",
      consent: "I have read and accept the",
      consentLink: "privacy policy",
      consentEmail: "GDPR consent (privacy policy accepted): Yes",
      paths: { notice: "/en/legal-notice", privacy: "/en/privacy", cookies: "/en/cookies" },
    },
    cookieBanner: {
      text: "We use analytics cookies to improve the site. You can accept or reject them.",
      accept: "Accept",
      reject: "Reject",
    },
  },
};

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
