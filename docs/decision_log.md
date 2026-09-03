# Registro de decisiones — web-musica

---

## DEC-001: Google Business Profile API en vez de Places API
**Fecha:** 2026-09-03
**Decisión:** las reseñas se leen de Business Profile API v4, con OAuth de propietario.
**Razón:** Places API (New) devuelve **máximo 5 reseñas**, elegidas por Google, sin poder
ordenarlas ni completarlas, y sus términos prohíben cachear el contenido más de 30 días.
Business Profile devuelve todas y son del titular.
**Alternativas descartadas:** Places API (New), widgets de terceros, copiar a mano.
**Impacto:** obliga a crear y verificar una ficha y a solicitar cuota a Google — dos
bloqueantes externos sin fecha. Se absorbe con DEC-002.

## DEC-002: `data/reviews.json` es la frontera del sistema
**Fecha:** 2026-09-03
**Decisión:** la web lee un fichero, nunca una API. El fetcher es un CLI independiente.
**Razón:** desacopla la entrega de la aprobación de Google, permite rellenar a mano
mientras tanto, hace el build reproducible sin red y elimina el riesgo de que una API caída
tumbe un despliegue.
**Alternativas descartadas:** fetch en runtime, ISR, fetch desde el navegador.
**Impacto:** atraviesa toda la arquitectura. Es el principio 1 de la constitución.

## DEC-003: No se filtran las reseñas por puntuación
**Fecha:** 2026-09-03
**Decisión:** se muestran todas, sin criba, con una nota visible sobre su origen.
**Razón:** el RDL 24/2021 (Directiva Omnibus) tipifica como práctica desleal mostrar solo
las reseñas positivas ocultando las negativas, y obliga a informar de si se verifica que
proceden de clientes reales. Además es más creíble: una media de 5,0 con 40 reseñas
perfectas genera desconfianza.
**Alternativas descartadas:** filtro ≥4 con aviso, selección manual.
**Impacto:** `EV-008` verifica por trayectoria que no existe filtro en la ruta de render.

## DEC-004: `fetch` nativo en vez del SDK `googleapis`
**Fecha:** 2026-09-03
**Decisión:** OAuth y las llamadas se hacen con `fetch` de Node 20.
**Razón:** son dos peticiones HTTP. `googleapis` son decenas de megas y un grafo de
dependencias entero para eso.
**Alternativas descartadas:** `googleapis`, `google-auth-library`.
**Impacto:** cero dependencias nuevas en runtime; el mapeo se escribe y se prueba a mano.

## DEC-005: Cloudflare Pages como destino (ejecución aplazada)
**Fecha:** 2026-09-03
**Decisión:** el destino será Cloudflare Pages con refresco por Deploy Hook + Cron Trigger.
El deploy **no** se ejecuta en esta tanda.
**Razón:** el plan gratuito de Vercel prohíbe el uso comercial y una web para conseguir
bolos lo es; Vercel Pro son 20 $/mes por un ISR que un sitio estático no necesita.
**Alternativas descartadas:** Vercel Pro, Vercel Hobby (prohibido).
**Impacto:** milestone M2, hoy en `SKIP`. Requiere un intent nuevo.

## DEC-006: Renombrar la carpeta a `web-musica`
**Fecha:** 2026-09-03
**Decisión:** `Desktop\Página web música` → `Desktop\web-musica`.
**Razón:** los subagentes juez de `/review` no leen rutas no-ASCII en runtimes con sandbox
— es la misma razón por la que la fábrica de arneses no vive en el Escritorio. Se hizo
antes del primer commit, cuando era gratis.
**Alternativas descartadas:** dejarla, mover a `C:\Users\Manuel\web-musica`.
**Impacto:** hay que reabrir el proyecto en el IDE con la ruta nueva.

## DEC-007: Vitest + Playwright, ambos solo en devDependencies
**Fecha:** 2026-09-03
**Decisión:** Vitest + Testing Library para unidad y componente; Playwright para tres smoke.
**Razón:** «la sección se oculta con 0 reseñas» solo se comprueba de verdad en el HTML
renderizado; el mapeo de la API se comprueba mejor con unitarios y fixtures.
**Alternativas descartadas:** solo Vitest, `node:test`, Jest, Cypress.
**Impacto:** el bundle del visitante no crece.

## DEC-008: Alcance recortado a la base FactorIA
**Fecha:** 2026-09-03
**Decisión:** de las cuatro áreas de mejora posibles se entra solo en «base FactorIA +
tests + CI». Quedan fuera datos reales, rendimiento, accesibilidad, SEO local y deploy.
**Razón:** decisión de Manuel en discovery.
**Impacto:** **la web sigue sin ser publicable al terminar esta tanda.** Está escrito en
`planning/scope.md` y vigilado en `docs/maintain.md` para que no se olvide.
