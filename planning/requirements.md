# Requirements — web-musica

Generado: 2026-09-03 | Claridad tras discovery: **94%** (ambigüedad 6%)
Intent de origen: `planning/intent-001.md`

---

## Qué hace

Web pública de un músico (piano y viola) que toca en bodas, eventos corporativos y
celebraciones en España. Existe ya: Next.js 15 con App Router, dos raíces de idioma
(`(es)` en `/` y `(en)` en `/en`), hero con partículas 3D audio-reactivas, secciones de
servicios, media, sobre mí, proceso, agenda, FAQ y contacto, páginas legales (aviso legal,
privacidad, cookies) y JSON-LD `MusicGroup` + `LocalBusiness`.

Lo que se añade en esta tanda:

1. **Sección de reseñas alimentada por Google.** Un fichero `data/reviews.json` es la única
   fuente de datos de la sección. Un script CLI lo regenera desde Google Business Profile
   API (v4) usando OAuth de propietario. La web nunca llama a Google.
2. **Datos estructurados de valoración.** El JSON-LD de la home incorpora
   `aggregateRating` y las reseñas individuales, de forma coherente con lo que se pinta.
3. **Cumplimiento de la Directiva Omnibus.** La sección declara el origen de las reseñas y
   cómo se verifican, en ES y EN.
4. **Base de método FactorIA.** `design/`, `planning/`, `implementation/`, `docs/`,
   `task_tracker` con Skill y Model por tarea, y `CLAUDE.md` de proyecto.
5. **Red de seguridad.** Primer commit, repo privado en GitHub, Vitest, Playwright, runner
   de evals y GitHub Actions que ejecuta todo.

## Qué NO hace (exclusiones explícitas)

- No responde reseñas ni interactúa con Google más allá de leer.
- No usa widgets de terceros ni scripts externos.
- No recolecta reseñas propias (sin formulario post-evento ni invitaciones).
- No agrega reseñas de otras plataformas.
- No traduce las reseñas: cada una se muestra en su idioma original.
- No filtra por número de estrellas.
- No despliega en producción, no configura dominio, no monta el Cron Trigger.
- No rellena datos legales, de contacto ni vídeos reales.
- No audita rendimiento ni accesibilidad.
- No toca el diseño visual existente más allá de la sección de reseñas.

## Integraciones

| Servicio | Uso | Autenticación | Estado |
|---|---|---|---|
| Google Business Profile API v4 (`mybusiness.googleapis.com`) | Leer reseñas de la ficha | OAuth 2.0, refresh token de propietario | **Bloqueado**: ni ficha creada ni cuota solicitada |
| Google OAuth 2.0 (`oauth2.googleapis.com/token`) | Canjear refresh token por access token | `client_id` + `client_secret` + `refresh_token` | Pendiente de credenciales |
| GitHub | Repo privado + Actions | `gh` CLI ya autenticado | Por crear |
| `lh3.googleusercontent.com` | Avatares de los reseñadores | Ninguna (público) | Requiere abrir `remotePatterns` y CSP |
| Formspree | Formulario de contacto | ID público | Ya integrado, sin ID configurado |

## Usuarios

| Actor | Qué hace | Frecuencia |
|---|---|---|
| **Visitante** (pareja que se casa, organizador de eventos) | Entra desde Google o Instagram, lee servicios y reseñas, contacta por WhatsApp o formulario | Continuo |
| **Manuel** (titular, músico, operador) | Ejecuta `npm run reviews:fetch` cuando quiere refrescar; revisa el snapshot antes de commitear | Ocasional, semanas |
| **CI (GitHub Actions)** | Ejecuta lint, tests, build y evals en cada push | Cada push |
| **Googlebot** | Indexa, lee JSON-LD, puede mostrar estrellas | Continuo |

## Criterios de éxito

Los del intent, uno a uno, cada uno con su eval en `implementation/evals/`. Resumen:

1. Repo con historial y árbol limpio.
2. `npm run build` verde con la sección activa.
3. Degradación limpia: sin reseñas, sin sección, sin error.
4. Render correcto en ES y EN con atribución completa.
5. JSON-LD válido y coherente con lo mostrado.
6. Fetcher que funciona con fixtures y falla con mensaje claro sin credenciales.
7. Cero secretos en el bundle cliente.
8. `npm run evals` ejecuta toda la suite y devuelve 0.
9. Declaración de verificación de reseñas presente en ambos idiomas.

## Restricciones

- **Externa y sin fecha:** la ficha de Google no existe; después hay que solicitar cuota de
  la API a Google (formulario + espera). Nada del plan depende de que eso llegue.
- **Técnica:** sitio estático, sin servidor en runtime. Todo el trabajo de datos ocurre en
  build o antes.
- **Seguridad:** CSP estricta ya en `next.config.mjs`; cada origen nuevo se añade a mano.
  `images.remotePatterns` sin comodines (un `**` convierte `/_next/image` en proxy abierto).
- **Legal:** LSSI art. 10, RGPD art. 13, Directiva Omnibus (RDL 24/2021), términos de uso
  de Google sobre atribución de reseñas.
- **Económica:** sin coste recurrente. La API es gratuita; el hosting elegido también.
- **Versiones fijadas:** React `19.0.0` exacto — las dependencias de test tienen que ser
  compatibles con React 19 (Testing Library ≥ 16).
