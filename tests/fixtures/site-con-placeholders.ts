// Fixture para EV-010. Réplica reducida de src/config/site.ts con TODO sin rellenar:
// tres placeholders legales y los cuatro campos pendientes.
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
    fullName: "[NOMBRE Y APELLIDOS]",
    nif: "[NIF / DNI]",
    address: "[Dirección postal completa]",
  },
} as const;
