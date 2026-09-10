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
type Price = { name: string; detail: string; price: string; featured?: boolean };

export type Dict = {
  seo: { description: string };
  nav: { services: string; media: string; about: string; events: string; contact: string; cta: string; menu: string };
  hero: { eyebrow: string; title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string; location: string };
  trust: string[];
  services: { eyebrow: string; title: string; intro: string; items: Service[] };
  // Tarifa publicada. Es el diferenciador central del plan de negocio (§4): ningún
  // competidor local publica precio. Cambiarla aquí la cambia en toda la web.
  pricing: {
    eyebrow: string; title: string; intro: string; note: string; cta: string;
    items: Price[];
  };
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
        "Viola en directo para ceremonias de boda en Granada. Arreglo propio de vuestra canción, equipo de sonido incluido y tarifa publicada desde 390 €.",
    },
    nav: { services: "Servicios", media: "Escuchar", about: "Sobre mí", events: "Eventos", contact: "Contratar", cta: "Reservar fecha", menu: "Menú" },
    hero: {
      eyebrow: "Música en directo · Granada",
      title: "La ceremonia a viola sola, con vuestro arreglo hecho por mí",
      subtitle:
        "Soy Manuel, violista en Granada. Toco vuestra ceremonia yo solo, y la pieza que elegáis la arreglo yo para vosotros. Desde 390 €, con equipo incluido y precio cerrado.",
      ctaPrimary: "Ver tarifa y reservar",
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
    pricing: {
      eyebrow: "Tarifa",
      title: "Lo que cuesta, sin tener que preguntar",
      intro:
        "Sé lo incómodo que es pedir presupuesto sin saber si te vas a salir del budget, así que aquí están mis precios. Incluyen el equipo de sonido y el arreglo de vuestra pieza. Lo que veéis es lo que cuesta.",
      note: "Desplazamiento gratis hasta 50 km de Granada; a partir de ahí, 0,40 €/km. Sin extras ocultos.",
      cta: "Reservar fecha",
      items: [
        { name: "Ceremonia", detail: "Viola sola, sin bases. 45 min, equipo incluido y 1 arreglo propio.", price: "390 €" },
        { name: "Ceremonia + cóctel", detail: "Lo anterior más 1 h de cóctel con viola y bases propias.", price: "690 €", featured: true },
        { name: "Jornada completa", detail: "Ceremonia, cóctel y entrada al banquete.", price: "990 €" },
        { name: "Comunión o funeral", detail: "45 minutos, viola sola.", price: "250 €" },
        { name: "Hostelería · set de 1 h", detail: "Repertorio de ambiente. Precio por recurrencia.", price: "200 €" },
        { name: "Vídeo-concierto grabado", detail: "Pieza a medida, grabada con calidad de estudio.", price: "150 €" },
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
        "Me llamo Manuel y toco la viola. Si no sabéis muy bien qué es: imaginad un violín algo más grande, con un sonido más grave y más cálido. Es el instrumento de cuerda que más se parece a una voz cantando, y en una ceremonia eso se nota — no acompaña el momento, lo sostiene.",
        "Trabajo en Granada y en su provincia. Voy solo, con mi viola y mi equipo, y en cada boda toco para una sola pareja: no encadeno dos eventos el mismo día.",
        "Y vuestra canción no la compro hecha. La arreglo yo, la grabo y os la mando antes del día para que la escuchéis con calma. Si algo no os encaja, lo cambio. Es la parte del trabajo que más me gusta.",
      ],
      highlights: ["Viola en directo", "Arreglo propio de vuestra canción", "Equipo de sonido incluido", "Tarifa publicada, sin sorpresas"],
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
        { q: "¿El precio de la web es el precio final?", a: "Sí. Incluye equipo de sonido y desplazamiento hasta 50 km de Granada. Más lejos, 0,40 €/km. Sin extras ocultos." },
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
        "Live viola for wedding ceremonies in Granada. Your song arranged by me, PA included, and the price already on the site — from €390.",
    },
    nav: { services: "Services", media: "Listen", about: "About", events: "Events", contact: "Book", cta: "Check date", menu: "Menu" },
    hero: {
      eyebrow: "Live music · Granada",
      title: "The ceremony on solo viola, with your song arranged by me",
      subtitle:
        "I'm Manuel, a violist based in Granada. I play your ceremony on my own, and I arrange the piece you choose myself. From €390, PA included and a fixed price.",
      ctaPrimary: "See prices and book",
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
    pricing: {
      eyebrow: "Prices",
      title: "What it costs, without having to ask",
      intro:
        "I know how awkward it is to request a quote without knowing whether you're about to blow the budget, so here are my prices. They include the PA and the arrangement of your piece. What you see is what it costs.",
      note: "Travel is free within 50 km of Granada; beyond that, €0.40/km. No hidden extras.",
      cta: "Check your date",
      items: [
        { name: "Ceremony", detail: "Solo viola, no backing. 45 min, PA included, one custom arrangement.", price: "€390" },
        { name: "Ceremony + cocktail", detail: "The above plus one hour of cocktail with viola and my own tracks.", price: "€690", featured: true },
        { name: "Full day", detail: "Ceremony, cocktail and the entrance to the reception.", price: "€990" },
        { name: "Communion or funeral", detail: "45 minutes, solo viola.", price: "€250" },
        { name: "Hospitality · 1 h set", detail: "Ambient repertoire. Priced by recurrence.", price: "€200" },
        { name: "Recorded video performance", detail: "A custom piece, recorded at studio quality.", price: "€150" },
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
        "My name is Manuel and I play the viola. In case you're not sure what that is: picture a slightly larger violin with a lower, warmer sound. It's the string instrument closest to a singing voice, and in a ceremony you can hear it — it doesn't accompany the moment, it holds it up.",
        "I work in Granada and its province. I come on my own, with my viola and my PA, and I only play one wedding a day — never two.",
        "And I don't buy your song ready-made. I arrange it, record it and send it to you before the day so you can listen properly. If something doesn't sit right, I change it. It's the part of the job I enjoy most.",
      ],
      highlights: ["Live viola", "Your song, arranged by me", "PA system included", "Published prices, no surprises"],
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
        { q: "Is the price on the site the final price?", a: "Yes. It includes the PA system and travel within 50 km of Granada. Beyond that, €0.40/km. No hidden extras." },
        { q: "What if you fall ill?", a: "I have a standing agreement with two trusted musicians to cover the date. A wedding does not get postponed." },
        { q: "How long is each part?", a: "The ceremony runs about 45 minutes: entrance, key moments and exit. The cocktail, one hour." },
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
      typeOptions: ["Church wedding", "Civil wedding", "Funeral or farewell", "Communion", "Hospitality", "Other"],
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
