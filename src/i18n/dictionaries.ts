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
  // Rótulos de la sección de reseñas de Google. Los datos NO viven aquí: vienen de
  // data/reviews.json (ver design/data_model.md).
  reviews: {
    eyebrow: string; title: string; aggregate: string; disclosure: string;
    cta: string; starsLabel: string;
  };
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
        "Viola en directo para ceremonias de boda en Granada, con más de 20 años de experiencia. Arreglo propio de vuestra canción y equipo de sonido incluido.",
    },
    nav: { services: "Servicios", media: "Escuchar", about: "Sobre mí", events: "Eventos", contact: "Contratar", cta: "Reservar fecha", menu: "Menú" },
    hero: {
      eyebrow: "Música en directo · Granada",
      title: "La ceremonia a viola sola, con vuestro arreglo hecho por mí",
      subtitle:
        "Soy Manuel, violista granadino con más de veinte años sobre el escenario. Toco vuestra ceremonia yo solo, y la pieza que elegáis la arreglo yo para vosotros.",
      ctaPrimary: "Consultar disponibilidad",
      ctaSecondary: "Escuchar",
      location: "Granada y provincia",
    },
    trust: ["Bodas religiosas", "Ceremonias civiles", "Funerales", "Comuniones"],
    services: {
      eyebrow: "Servicios",
      title: "La ceremonia y el cóctel, con una sola llamada",
      intro:
        "La viola es como un violín un poco más grande, con un sonido más grave y más cálido — el más parecido a la voz humana. En la ceremonia la toco sola, sin nada detrás. En el cóctel la acompaño con bases que produzco yo, para que lo moderno suene lleno.",
      items: [
        { title: "Ceremonia", desc: "Viola sola, sin bases. 45 minutos: entrada, momentos clave y salida. Es donde el instrumento se sostiene solo." },
        { title: "Cóctel", desc: "Una hora de viola sobre bases propias. Repertorio moderno con cuerpo, sin necesidad de más músicos." },
        { title: "Funerales y despedidas", desc: "Disponibilidad todo el año, también fuera de temporada de bodas. Discreción y puntualidad." },
        { title: "Comuniones y hostelería", desc: "Ceremonias breves y música de ambiente recurrente para hoteles y restaurantes." },
      ],
    },
    media: {
      eyebrow: "Escuchar",
      title: "Escuchadme antes de decidir",
      intro: "Ninguna descripción sustituye a oírlo. Aquí tenéis grabaciones del directo y alguno de los arreglos que he preparado para otras parejas.",
      placeholder: "Vídeos próximamente — material en producción",
      videoTitle: "Vídeo",
    },
    about: {
      eyebrow: "Sobre mí",
      title: "Hola, soy Manuel",
      photoSoon: "Foto próximamente",
      body: [
        "Me llamo Manuel, soy de Granada y llevo más de veinte años sobre un escenario. Empecé en el conservatorio, donde antes de la viola pasé por el piano y la guitarra, y desde entonces he tocado en orquestas y en todo tipo de eventos por la ciudad y la provincia — hasta que la viola se quedó con la parte de mí que más me gusta compartir en una boda.",
        "Si no sabéis muy bien qué es la viola: imaginad un violín algo más grande, con un sonido más grave y más cálido. Es el instrumento de cuerda que más se parece a una voz cantando, y en una ceremonia eso se nota — no acompaña el momento, lo sostiene.",
        "Hoy trabajo solo, con mi viola y mi equipo, y en cada boda toco para una sola pareja: no encadeno dos citas el mismo día. Y vuestra canción no la compro hecha — la arreglo yo, la grabo y os la mando antes del día para que la escuchéis con calma. Si algo no os encaja, lo cambio. Es la parte del trabajo que más me gusta.",
      ],
      highlights: ["Viola en directo", "Arreglo propio de vuestra canción", "Equipo de sonido incluido", "Más de 20 años de experiencia"],
    },
    process: {
      eyebrow: "Cómo funciona",
      title: "Cómo trabajamos",
      steps: [
        { title: "1. Me escribís", desc: "Con la fecha y el sitio me basta para deciros si estoy libre. Contesto el mismo día, y si no puedo ir os lo digo a la primera." },
        { title: "2. Hablamos de la música", desc: "Qué queréis en la entrada, en las firmas y en la salida. Preparo el arreglo de vuestra pieza y os lo mando grabado para que lo aprobéis." },
        { title: "3. El día no tenéis que pensar en mí", desc: "Llego con antelación, monto mi equipo, hablo con el fotógrafo y con quien oficia, y me coloco donde no estorbe. Vosotros a lo vuestro." },
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
    reviews: {
      eyebrow: "Opiniones",
      title: "Lo que dicen quienes ya me han contratado",
      aggregate: "{rating} · {count} reseñas en Google",
      // Texto exigido por el RDL 24/2021 (Directiva Omnibus). No se recorta por diseño.
      disclosure:
        "Reseñas publicadas en Google por clientes reales. Se muestran todas, sin filtrar ni editar.",
      cta: "Ver todas en Google",
      starsLabel: "{n} de 5 estrellas",
    },
    faq: {
      eyebrow: "Dudas frecuentes",
      title: "Preguntas habituales",
      items: [
        { q: "¿Se puede tocar en iglesia?", a: "Sí, y es donde mejor funciona. La ceremonia se toca a viola sola, sin pistas ni altavoces, así que no hay nada que negociar con el párroco." },
        { q: "¿Las bases son grabaciones de otros?", a: "No. Las produzco yo, con mis propios arreglos. Ni descargo pistas ni uso audio de terceros: además de ser ilegal en una actuación comercial, sonaría a genérico." },
        { q: "¿Puedo elegir la canción?", a: "Sí, y es la parte que más disfruto. Me decís la pieza, la arreglo para viola y os la mando grabada antes del día para que la aprobéis." },
        { q: "¿Y si te pones enfermo?", a: "Tengo acuerdo previo con dos músicos de confianza para cubrir la fecha. Una boda no se aplaza." },
        { q: "¿Cuánto dura cada parte?", a: "La ceremonia son unos 45 minutos: entrada, momentos clave y salida. El cóctel, una hora." },
      ],
    },
    contact: {
      eyebrow: "Contratar",
      title: "Reserva tu fecha",
      intro: "Contadme la fecha y el sitio y os digo enseguida si estoy libre. Respondo siempre, aunque sea para deciros que no puedo.",
      name: "Nombre",
      emailField: "Email",
      phone: "Teléfono",
      date: "Fecha del evento",
      type: "Tipo de evento",
      message: "Cuéntame más",
      typeOptions: ["Boda religiosa", "Boda civil", "Funeral o despedida", "Comunión", "Hostelería", "Otro"],
      submit: "Enviar consulta",
      whatsapp: "Escríbeme por WhatsApp",
      or: "o",
      sent: "¡Gracias! Te responderé muy pronto.",
      error: "No se pudo enviar. Inténtalo de nuevo o escríbeme directamente por WhatsApp o email.",
      mailtoHint: "Se ha abierto tu programa de correo con la consulta preparada. Si no se abrió, escríbeme directamente al email de arriba.",
      prefill: "Hola, me gustaría consultar disponibilidad para un evento.",
    },
    footer: { rights: "Todos los derechos reservados.", built: "Música en directo para bodas y eventos en Granada." },
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
        "Live viola for wedding ceremonies in Granada, with more than 20 years of experience. Your song arranged by me, PA included.",
    },
    nav: { services: "Services", media: "Listen", about: "About", events: "Events", contact: "Book", cta: "Check date", menu: "Menu" },
    hero: {
      eyebrow: "Live music · Granada",
      title: "The ceremony on solo viola, with your song arranged by me",
      subtitle:
        "I'm Manuel, a Granada-born violist with more than twenty years on stage. I play your ceremony on my own, and I arrange the piece you choose myself.",
      ctaPrimary: "Check availability",
      ctaSecondary: "Listen",
      location: "Granada and province",
    },
    trust: ["Church weddings", "Civil ceremonies", "Funerals", "Communions"],
    services: {
      eyebrow: "Services",
      title: "Ceremony and cocktail, with a single call",
      intro:
        "A viola is like a slightly larger violin with a lower, warmer sound — the string instrument closest to a human voice. For the ceremony I play it alone, with nothing behind it. At the cocktail I add backing tracks I produce myself, so modern repertoire sounds full.",
      items: [
        { title: "Ceremony", desc: "Solo viola, no backing. 45 minutes: entrance, key moments and exit. This is where the instrument carries itself." },
        { title: "Cocktail", desc: "One hour of viola over my own backing tracks. Modern repertoire with body, without hiring more musicians." },
        { title: "Funerals and farewells", desc: "Available all year, including outside the wedding season. Discretion and punctuality." },
        { title: "Communions and hospitality", desc: "Short ceremonies and recurring ambient music for hotels and restaurants." },
      ],
    },
    media: {
      eyebrow: "Listen",
      title: "Watch & listen",
      intro: "No description replaces hearing it. Here are live recordings and some of the arrangements I've written for other couples.",
      placeholder: "Videos coming soon — material in production",
      videoTitle: "Video",
    },
    about: {
      eyebrow: "About",
      title: "Hello, I'm Manuel",
      photoSoon: "Photo coming soon",
      body: [
        "My name is Manuel, I'm from Granada, and I've spent more than twenty years on stage. I started at the conservatory, where I played piano and guitar before the viola, and I've since performed with orchestras and at all kinds of events across the city and province — until the viola became the part of me I most enjoy bringing to a wedding.",
        "In case you're not sure what a viola is: picture a slightly larger violin with a lower, warmer sound. It's the string instrument closest to a singing voice, and in a ceremony you can hear it — it doesn't accompany the moment, it holds it up.",
        "Today I work on my own, with my viola and my PA, and I only play one wedding a day — never two. And I don't buy your song ready-made. I arrange it, record it and send it to you before the day so you can listen properly. If something doesn't sit right, I change it. It's the part of the job I enjoy most.",
      ],
      highlights: ["Live viola", "Your song, arranged by me", "PA system included", "20+ years of experience"],
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
    reviews: {
      eyebrow: "Reviews",
      title: "What my clients say",
      aggregate: "{rating} · {count} reviews on Google",
      // Required by the Omnibus Directive (RDL 24/2021 in Spain). Never trimmed for design.
      disclosure:
        "Reviews published on Google by real clients. All of them are shown, unfiltered and unedited.",
      cta: "See all on Google",
      starsLabel: "{n} out of 5 stars",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      items: [
        { q: "Can you play inside a church?", a: "Yes, and that is where it works best. The ceremony is solo viola — no tracks, no speakers — so there is nothing to negotiate with the priest." },
        { q: "Are the backing tracks somebody else's recordings?", a: "No. I produce them myself, with my own arrangements. I never download tracks or use third-party audio: besides being illegal in a commercial performance, it would sound generic." },
        { q: "Can I choose the song?", a: "Yes, and it's the part I enjoy most. Tell me the piece, I arrange it for viola and send you a recording before the day so you can approve it." },
        { q: "What if you fall ill?", a: "I have a standing agreement with two trusted musicians to cover the date. A wedding does not get postponed." },
        { q: "How long is each part?", a: "The ceremony runs about 45 minutes: entrance, key moments and exit. The cocktail, one hour." },
      ],
    },
    contact: {
      eyebrow: "Book",
      title: "Reserve your date",
      intro: "Tell me about your event and I'll reply within 24 h with availability.",
      name: "Name",
      emailField: "Email",
      phone: "Phone",
      date: "Event date",
      type: "Event type",
      message: "Tell me more",
      typeOptions: ["Church wedding", "Civil wedding", "Funeral or farewell", "Communion", "Hospitality", "Other"],
      submit: "Send enquiry",
      whatsapp: "Message me on WhatsApp",
      or: "or",
      sent: "Thank you! I'll get back to you very soon.",
      error: "It couldn't be sent. Please try again, or contact me directly via WhatsApp or email.",
      mailtoHint: "Your email client should have opened with the enquiry ready. If it didn't, write to me directly at the email above.",
      prefill: "Hi! I'd like to check availability for an event.",
    },
    footer: { rights: "All rights reserved.", built: "Live music for weddings and events in Granada." },
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
