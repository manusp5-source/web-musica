// Fixture para EV-010. Todo rellenado: ni placeholders legales ni campos pendientes.
// Es el estado al que llegará el proyecto con M2-IT-002, y el eval tiene que seguir
// siendo correcto entonces — por eso comprueba semántica, no el estado de hoy.
export const site = {
  domain: "https://ejemplo-musico.es",
  whatsapp: "34611223344",
  social: {
    instagram: "https://instagram.com/ejemplo", // ←CAMBIAR
    youtube: "",
  },
  media: {
    youtubeIds: ["dQw4w9WgXcQ", "", ""],
  },
  legal: {
    fullName: "Nombre Apellido Apellido",
    nif: "00000000X",
    address: "Calle de Ejemplo 1, 28001 Madrid",
  },
} as const;
