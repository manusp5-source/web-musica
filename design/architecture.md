# Arquitectura — web-musica

---

## Resumen

Sitio estático de Next.js 15 (App Router) con dos raíces de idioma, generado en build y
servido sin servidor de aplicación. La novedad de esta tanda es una capa de reseñas cuya
única fuente es un fichero JSON versionado; un CLI de Node lo regenera desde Google Business
Profile API con OAuth de propietario, fuera del ciclo de petición del visitante.

## Stack

| Capa | Tecnología | Versión | Por qué |
|---|---|---|---|
| Framework | Next.js (App Router) | 15.5.x | Ya en uso. RSC permite leer el JSON en build sin JS de cliente |
| UI | React | 19.0.0 (exacta) | Ya en uso |
| Estilos | Tailwind CSS | 3.4.x | Ya en uso, con tokens propios |
| Lenguaje | TypeScript | 5.7.x | Ya en uso, `strict` |
| 3D | three + @react-three/fiber | 0.184 / 9.6 | Ya en uso, solo en el hero |
| Validación | Zod | ^3 (dev) | Valida `data/reviews.json` en build y en tests. **No entra en el bundle** |
| Test unitario | Vitest + Testing Library + jsdom | 3.x / 16.x | Esquema, mapper y componentes |
| Test e2e | Playwright | 1.4x | Render real de la home ES y EN |
| CI | GitHub Actions | — | lint, check-legal, unit, build, e2e, evals |
| OAuth + API | `fetch` nativo de Node 20 | — | 60 líneas contra `oauth2.googleapis.com` y `mybusiness.googleapis.com/v4`. Sin dependencias |

## Estructura de módulos

```
app/
  (es)/            raíz española: /  ·  /aviso-legal  /privacidad  /cookies
  (en)/en/         raíz inglesa:  /en ·  /en/legal-notice /en/privacy /en/cookies
  sitemap.ts robots.ts globals.css

src/
  components/      Nav, Hero, Sections, Contact, Footer, CookieBanner, WhatsAppButton
    Reviews.tsx    NUEVO — sustituye a Sections.Testimonials
    hero3d/        escena R3F, se desactiva por env o por reduce-motion
  config/          site.ts (datos del negocio), fonts.ts
  i18n/            dictionaries.ts — todos los textos ES/EN
  lib/reviews/     NUEVO
    schema.ts      esquema Zod + tipos exportados
    load.ts        lectura + validación en build (server-only)
    google.ts      OAuth refresh + GET v4 + mapper al esquema propio
    jsonld.ts      construye aggregateRating + review para el JSON-LD

data/
  reviews.json     NUEVO — el contrato. Versionado

scripts/
  check-legal.mjs      existente, ampliado con más placeholders
  fetch-reviews.ts    NUEVO — CLI: npm run reviews:fetch
  make-demo-audio.mjs  existente

tests/
  unit/          Vitest
  fixtures/      respuestas de la API v4 capturadas/sintéticas
  e2e/           Playwright

implementation/evals/   runner + un eval por criterio de éxito
```

## Flujo de datos

### Camino del visitante (el 99,9% del tráfico)

```
Navegador ──▶ HTML estático ya renderizado, con las reseñas dentro
              (cero peticiones a Google, salvo los avatares si se activan)
```

`Reviews.tsx` es un Server Component: `load.ts` lee y valida el JSON durante `next build`,
y lo que llega al navegador es HTML. No hay estado, ni efectos, ni fetch de cliente.

### Camino de la sincronización (manual hoy, programado el día que haya deploy)

```
npm run reviews:fetch
  │
  ├─ lee .env: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN / GBP_LOCATION
  ├─ POST oauth2.googleapis.com/token   (grant_type=refresh_token) ──▶ access_token (1 h)
  ├─ GET  mybusiness.googleapis.com/v4/{location}/reviews          ──▶ página(s) de reseñas
  ├─ mapea: FIVE→5, starRating→rating, comment→text, reviewer→author…
  ├─ valida con el esquema Zod
  └─ escribe data/reviews.json  (si algo falla: mensaje claro, exit≠0, fichero intacto)
```

El fallo nunca escribe un fichero a medias: se serializa en memoria, se valida, y solo
entonces se sobrescribe.

### Degradación

| Situación | Comportamiento |
|---|---|
| `data/reviews.json` no existe | `load.ts` devuelve estructura vacía; la sección no se renderiza |
| JSON corrupto o fuera de esquema | Se registra el error en el log de build; se trata como vacío |
| `reviews: []` con `aggregate` a cero | Sección oculta y JSON-LD **sin** `aggregateRating` |
| Fetch fallido | Se conserva el snapshot anterior; el build ni se entera |

## Integraciones externas

| Integración | Momento | Credencial | Nivel |
|---|---|---|---|
| `oauth2.googleapis.com/token` | CLI / build | `client_id` + `client_secret` + `refresh_token` | 1 en local (`.env`), 2 en CI |
| `mybusiness.googleapis.com/v4/.../reviews` | CLI / build | `Bearer` access token | derivado |
| `lh3.googleusercontent.com` | Navegador, si se activan avatares | ninguna | pública |
| Formspree | Navegador, al enviar el formulario | ID público en `site.ts` | pública |
| YouTube (nocookie) | Navegador, al reproducir | ninguna | pública |

## Decisiones de seguridad que ya existen y se respetan

- CSP estricta en `next.config.mjs` con `frame-ancestors 'none'` y `form-action` acotado.
- `images.remotePatterns` sin comodines.
- El JSON-LD se inyecta con escape defensivo de `<` para impedir cierre prematuro de
  `</script>` (`HomePage.tsx`). **El texto de las reseñas entra ahí**: el mismo escape lo
  cubre, y hay un test que lo verifica con una reseña que contiene `</script>`.
