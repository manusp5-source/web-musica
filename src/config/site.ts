/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  CONFIGURACIÓN PRINCIPAL — EDITA AQUÍ TUS DATOS                    ║
 * ║  Todo lo marcado con  ←CAMBIAR  son placeholders provisionales.    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

export const site = {
  // --- Identidad ---
  artistName: "Manuel", //                         ←CAMBIAR  (tu nombre)
  brand: "Manuel · Viola en directo", //           ←CAMBIAR
  tagline: "Viola en directo para ceremonias", // subtítulo corto

  // --- Localización (SEO local España) ---
  city: "Granada", // decidido en plan-negocio-viola.md §4: el segmento nucleo son
  region: "Provincia de Granada", //               las 736 ceremonias religiosas de Granada
  serviceArea: "Granada y provincia · desplazamiento gratis hasta 50 km",

  // --- Contacto ---
  email: "manuelgpw@gmail.com",
  // OJO: 858 es prefijo fijo de Granada. El botón de WhatsApp solo funciona si este
  // número está dado de alta en WhatsApp Business (se puede, verificando por llamada).
  whatsapp: "34858886795", // solo dígitos, con prefijo país
  whatsappDisplay: "+34 858 886 795",

  // --- Dominio (para metadatos / SEO) ---
  domain: "https://violagranada.es",

  // --- Redes (deja "" para ocultar el icono) ---
  social: {
    instagram: "https://instagram.com/viola.granada",
    youtube: "", //    https://youtube.com/@...     ←CAMBIAR
    spotify: "", //    https://open.spotify.com/... ←CAMBIAR
    tiktok: "", //                                  ←CAMBIAR
  },

  // --- Formulario de contacto ---
  // 1) Crea un form gratis en https://formspree.io y pega el ID (ej: "xayzqwer")
  // 2) Mientras esté vacío, el formulario usa mailto: como fallback.
  formspreeId: "", //                              ←CAMBIAR

  // --- Embeds de media (pega URLs cuando tengas el material) ---
  media: {
    // IDs/URLs de YouTube para los reels. Deja "" para mostrar placeholder.
    youtubeIds: ["", "", ""], //                   ←CAMBIAR (3 vídeos)
    // URL EMBED de Spotify (empieza por https://open.spotify.com/embed/...), no el link
    // normal de compartir. Deja "" mientras no haya nada subido — no se renderiza nada,
    // cero cambio de comportamiento. Pégala según vayas subiendo temas (25 sep: todavía
    // nada en Spotify).
    spotifyEmbed: "", //                           ←CAMBIAR
    // Audio del hero para el efecto reactivo. Pon un mp3 en /public (ej: "/sample.mp3").
    // Si está vacío, las partículas flotan en modo ambiente (sin botón de play).
    heroAudio: "/demo-tone.wav", //                ←CAMBIAR (ahora un demo; pon tu mp3 real)
    // Foto principal del hero. Deja "" para volver al gradiente.
    // Ponla en /public y escribe aqui su ruta, por ejemplo "/manuel-viola.jpg".
    heroPhoto: "/manuel-viola.jpg",
    // Retrato de la seccion "Sobre mi". Puede ser la misma foto u otra distinta.
    portraitPhoto: "/manuel-viola.jpg",
    // Repertorio publicado en la web — lista real, no inventada: limpiada a partir del
    // set list que Manuel pasó (playlist de versiones karaoke usadas como referencia de
    // arreglo), quitando "(Karaoke Version)" y el nombre del canal, dejando solo título y
    // artista original. Vacío = la sección de repertorio no se renderiza.
    repertoire: [
      { title: "All of Me", artist: "John Legend" },
      { title: "A Thousand Years", artist: "Christina Perri" },
      { title: "Perfect", artist: "Ed Sheeran" },
      { title: "My Heart Will Go On", artist: "Celine Dion" },
      { title: "Shallow", artist: "Lady Gaga, Bradley Cooper" },
      { title: "Viva la Vida", artist: "Coldplay" },
      { title: "Dancing in the Moonlight", artist: "Toploader" },
      { title: "Hallelujah", artist: "Leonard Cohen" },
      { title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee" },
      { title: "Can't Help Falling in Love", artist: "Elvis Presley" },
      { title: "Until I Found You", artist: "Stephen Sanchez" },
      { title: "Golden", artist: "KPop Demon Hunters" },
      { title: "We Are Young", artist: "fun. ft. Janelle Monáe" },
      { title: "Accidentally in Love", artist: "Counting Crows" },
      { title: "Wrecking Ball", artist: "Miley Cyrus" },
      { title: "Die With a Smile", artist: "Lady Gaga, Bruno Mars" },
      { title: "Te Regalo", artist: "Rels B, J Abecia" },
      { title: "Ordinary", artist: "Alex Warren" },
      { title: "Somebody That I Used to Know", artist: "Gotye ft. Kimbra" },
      { title: "Those Eyes", artist: "New West" },
      { title: "La Salvación", artist: "Arde Bogotá" },
      { title: "Human", artist: "Christina Perri" },
      { title: "Somewhere Only We Know", artist: "Keane" },
      { title: "Another Love", artist: "Tom Odell" },
      { title: "Piano Man", artist: "Billy Joel" },
      { title: "Flowers", artist: "Miley Cyrus" },
      { title: "I'm Good (Blue)", artist: "David Guetta, Bebe Rexha" },
      { title: "Bam Bam", artist: "Camila Cabello, Ed Sheeran" },
      { title: "Me and My Broken Heart", artist: "Rixton" },
      { title: "Telephone", artist: "Lady Gaga, Beyoncé" },
      { title: "Let Me Down Slowly", artist: "Alec Benjamin" },
      { title: "El Despertar", artist: "Nil Moliner" },
      { title: "Jerk It Out", artist: "Caesars" },
      { title: "The Night We Met", artist: "Lord Huron" },
      { title: "Ni Tú Ni Nadie", artist: "Alaska y Dinarama" },
      { title: "Alquitrán y Carmín", artist: "El Niño de la Hipoteca" },
      { title: "Englishman in New York", artist: "Sting" },
      { title: "La Vie en Rose", artist: "Édith Piaf" },
    ],
  },

  // --- Efectos visuales ---
  effects: {
    // Partículas 3D audio-reactivas en el hero (React Three Fiber).
    // Se desactivan SOLAS en móvil y con "reduce motion" (fallback = gradiente).
    // NEXT_PUBLIC_HERO3D=off lo apaga sin tocar código: lo usan los tests e2e,
    // donde WebGL en headless es lento e inestable. Por defecto, encendido.
    hero3d: process.env.NEXT_PUBLIC_HERO3D !== "off", // pon "off" para volver al hero plano
  },

  // --- Datos legales (RGPD / LSSI España) — RELLENA antes de publicar ---
  legal: {
    fullName: "Manuel Gálvez del Postigo Fernández",
    nif: "77148158V",
    address: "Calle Emir 5, 18006 Granada, España",
    // Email para ejercer derechos RGPD (puede ser el mismo de contacto)
    privacyEmail: "manuelgpw@gmail.com",
    lastUpdated: "2026-10-01", // fecha última revisión de los textos legales
  },

  // --- Cookies / analytics ---
  cookies: {
    // Pon true SOLO si algún día se añade analytics QUE USE COOKIES (Google Analytics,
    // Meta Pixel, etc.). Cloudflare Web Analytics (justo abajo) es distinto: no usa
    // cookies, así que no activa este flag ni el banner de consentimiento.
    analyticsEnabled: false,
  },

  // --- Cloudflare Web Analytics — métricas sin cookies ---
  // Pega aquí el token del beacon cuando lo tengas (dashboard de Cloudflare → Analytics →
  // Web Analytics → Add a site → copia el token, no el snippet entero). Vacío = el
  // <script> del beacon no se renderiza, cero cambio de comportamiento.
  //
  // OJO al dar de alta el sitio (hallazgo del crítico, review 25 sep): elige "Manual
  // setup", NO "Automatic setup". El sitio corre en un Worker de Cloudflare, así que
  // TODA su respuesta ya pasa por el borde de Cloudflare — "Automatic" inyectaría un
  // segundo beacon ahí, duplicando cada visita en el panel de métricas junto con el que
  // ya renderiza CloudflareAnalytics.tsx. Un solo beacon por página, siempre.
  analytics: {
    cloudflareToken: "", //                          ←CAMBIAR (opcional)
  },

  // --- Códigos QR para imprenta (planning/intent-002.md) ---
  // Solo metadatos: el destino de "web" es site.domain, de arriba (no se duplica aquí).
  // El destino de "review" lo resuelve scripts/make-qr.ts leyendo data/reviews.json →
  // profileUrl, que puebla el fetcher de M1-UJ-004 el día que exista la ficha de Google
  // (B-01/B-02). Hasta entonces el script avisa y no lo genera — nunca un QR a un
  // placeholder, por diseño.
  qr: {
    web: { label: "Web", filename: "web" },
    review: { label: "Reseña en Google", filename: "resena-google" },
  },
} as const;

export type Site = typeof site;
