// Fixture para EV-010. Datos legales rellenados, pero los campos "pendientes" siguen
// vacíos. Sirve para comprobar la regla que más fácil se rompe sin querer:
// el nivel PENDIENTE avisa y NUNCA bloquea, ni siquiera con --strict.
export const site = {
  domain: "https://tunombre.es",
  whatsapp: "34600000000",
  social: {
    instagram: "", //  https://instagram.com/...   ←CAMBIAR
    youtube: "", //    https://youtube.com/@...     ←CAMBIAR
  },
  media: {
    youtubeIds: ["", "", ""],
  },
  legal: {
    fullName: "Nombre Apellido Apellido",
    nif: "00000000X",
    address: "Calle de Ejemplo 1, 28001 Madrid",
  },
} as const;
