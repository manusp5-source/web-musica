# Wireframes — web-musica

Solo se documenta lo que cambia en esta tanda. El resto de la página ya existe y no se toca.

---

## Home — ruta `/` (ES) y `/en` (EN)

**Se llega desde:** buscador, Instagram, enlace directo. Es la única página real del sitio.
**Journeys:** `M1-UJ-001` (ES), `M1-UJ-002` (EN), `M1-UJ-003` (JSON-LD), `M1-UJ-005` (legal)

### Orden de secciones (actual, se conserva)

```
Nav → Hero → Servicios → Media → Sobre mí → Proceso → [RESEÑAS] → Agenda → FAQ → Contacto → Footer
```

La sección de reseñas mantiene la posición que hoy ocupa `Testimonials`: después de
`Proceso` y antes de `Agenda`. Es el sitio correcto — el visitante acaba de leer cómo
trabajas y lo siguiente que necesita es que alguien lo confirme.

---

## Sección de reseñas — `src/components/Reviews.tsx`

### Estructura

```
┌──────────────────────────────────────────────────────────────────┐
│  OPINIONES                                    (eyebrow, bronce)   │
│  Lo que dicen quienes ya me han contratado    (h-section, serif)  │
│                                                                   │
│  ★★★★★  4,9 · 23 reseñas en Google        ← cabecera de agregado │
│                                                                   │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐       │
│  │ (LM) Laura M.  │ │ (JR) Javier R. │ │ (AN) Ana N.    │       │
│  │ ★★★★★  jun 26  │ │ ★★★★☆  may 26  │ │ ★★★★★  abr 26  │       │
│  │                │ │                │ │                │       │
│  │ "Tocó en       │ │ "Puntual y     │ │ "El cóctel     │       │
│  │  nuestra boda  │ │  muy profe…"   │ │  con la viola…"│       │
│  │  y fue…"       │ │                │ │                │       │
│  └────────────────┘ └────────────────┘ └────────────────┘       │
│         (grid de 3 columnas en md+, 1 columna en móvil)          │
│                                                                   │
│  Reseñas publicadas en Google, sin filtrar ni editar.             │
│  Ver las 23 en Google →                     ← nota Omnibus + CTA │
└──────────────────────────────────────────────────────────────────┘
```

### Componentes

| Componente | Función | Datos que lee |
|---|---|---|
| `Reviews` | Sección completa; decide si se renderiza | `loadReviews()` en build |
| `RatingSummary` | Estrellas + media + total + enlace | `file.aggregate`, `file.profileUrl` |
| `ReviewCard` | Una reseña | `Review` |
| `Stars` | 5 estrellas, `n` llenas | `rating`, con `aria-label` legible |
| `Avatar` | Foto o iniciales sobre círculo dorado | `avatarUrl`, `author` |

### Detalles que no son negociables

- **Atribución visible:** nombre del autor, puntuación, fecha y enlace a Google en cada
  bloque de la sección. Nunca una reseña suelta sin decir de dónde sale.
- **Texto sin editar.** Si es largo, se recorta **visualmente** con `line-clamp` y el
  bloque completo enlaza a Google. Nada de puntos suspensivos escritos en los datos.
- **Reseña sin texto** (solo estrellas): se muestra la tarjeta con estrellas, autor y
  fecha, sin cita. No se descarta: descartarlas sería filtrar.
- **Fecha** en formato corto localizado (`jun 2026` / `Jun 2026`), con `<time dateTime>`.
- **Estrellas accesibles:** las estrellas son decorativas (`aria-hidden`) y va un
  `<span class="sr-only">4 de 5 estrellas</span>` al lado.
- El texto de la reseña va en `<blockquote>` con `<cite>` para el autor.

### Estado vacío

**No se renderiza nada.** Ni encabezado, ni marco, ni «todavía no hay reseñas». Una sección
vacía en una web de contratación resta; su ausencia no se nota. Es el comportamiento que ya
tiene `Testimonials` hoy y el que exige el principio 5 de la constitución.

### Estado de error

Indistinguible del vacío para el visitante. El motivo se registra en la salida del build,
donde lo ve quien construye, no quien navega.

### Idioma

Los rótulos (eyebrow, título, nota de verificación, CTA) salen del diccionario y se
traducen. **El texto de las reseñas no se traduce nunca**: cada una aparece en el idioma en
que la escribió su autor, en las dos versiones del sitio.

---

## Textos nuevos en `dictionaries.ts`

| Clave | ES | EN |
|---|---|---|
| `reviews.eyebrow` | Opiniones | Reviews |
| `reviews.title` | Lo que dicen quienes ya me han contratado | What my clients say |
| `reviews.aggregate` | `{rating} · {count} reseñas en Google` | `{rating} · {count} reviews on Google` |
| `reviews.disclosure` | Reseñas publicadas en Google por clientes reales. Se muestran todas, sin filtrar ni editar. | Reviews published on Google by real clients. All of them are shown, unfiltered and unedited. |
| `reviews.cta` | Ver todas en Google | See all on Google |
| `reviews.starsLabel` | `{n} de 5 estrellas` | `{n} out of 5 stars` |

`reviews.disclosure` es el texto que cumple la Directiva Omnibus. No es decorativo y no se
recorta por diseño.
