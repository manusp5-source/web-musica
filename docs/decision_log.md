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
**Revertida parcialmente por DEC-010 el mismo día.**

## DEC-009: Se instala `gh` y se arregla `sharp`
**Fecha:** 2026-09-03
**Decisión:** `winget install GitHub.cli` (2.99.0) y `npm audit fix`.
**Razón:** sin `gh` no hay remoto y el CI sería un YAML decorativo. `sharp` traía 4
vulnerabilidades altas en dependencias **de producción**, heredadas del proyecto original.
**Impacto:** 0 vulnerabilidades tras el fix; tests 6/6 y build 13/13 siguen en verde.
Queda pendiente `gh auth login`, que exige navegador y lo hace Manuel.

## DEC-013: El crítico de `/review` baja a `sonnet` — desviación del método
**Fecha:** 2026-09-09
**Decisión:** la auditoría del crítico se ejecuta con `sonnet` en vez de `opus`.
**Razón:** cuatro intentos, cuatro muertes por límite de cuota del modelo (dos de sesión,
una semanal, una de sesión otra vez). El método fija `opus` para el crítico y hay motivo:
es el papel que tiene que ser más listo que el constructor. Pero **la alternativa real no
es un crítico `opus`, es ningún crítico**, y llevamos cinco días sin veredicto con tres UJs
esperando en `REVIEW`.
**Qué se pierde:** capacidad de razonamiento en la parte más adversarial del ciclo. Un
crítico `sonnet` encuentra menos que uno `opus`; el hallazgo que destapó el quinto falso
verde lo hizo `opus`, y no es casualidad.
**Mitigación:** el encargo se estrecha para compensar — en vez de «audita todo», se le
piden las áreas concretas que nadie ha mirado y se le dice exactamente qué romper. Un
crítico más limitado con instrucciones más precisas.
**Cuándo se revierte:** en la siguiente frontera de milestone (`M1-UJ-004` y `UJ-005`), el
crítico vuelve a `opus` si hay cuota. Esta desviación **no sienta precedente**: es una
excepción con fecha, no un cambio del método.
**Alternativa descartada:** esperar a las 21:00 y arriesgar una quinta muerte.

## DEC-011: Iniciales en vez de las fotos de Google (resuelve Q-02)
**Fecha:** 2026-09-05
**Decisión:** las tarjetas de reseña muestran las iniciales del autor sobre un círculo
dorado. `avatarUrl` se sigue guardando en `data/reviews.json`, pero no se renderiza.
**Razón:** mostrar la foto obliga a abrir `images.remotePatterns` y la CSP a
`lh3.googleusercontent.com`, y hace que cada visitante pida imágenes a Google desde una web
que hoy no tiene ni analítica ni cookies de terceros. El beneficio visual no compensa.
**Alternativas descartadas:** hotlink al avatar, descargar y servir las fotos (implica
almacenar imágenes de terceros, peor desde RGPD).
**Impacto:** reversible en diez líneas si algún día se quiere. El dato ya está guardado.

## DEC-012: `M0-IT-002` se aparta a `SKIP` temporal
**Fecha:** 2026-09-05
**Decisión:** el repo remoto deja de bloquear el arranque de M1.
**Razón:** `gh` lleva instalado desde el 4 sep y sigue sin autenticar; `gh auth login` exige
navegador. La regla «ningún UJ con un IT abierto» protege contra empezar un journey sin la
infraestructura que necesita, y `M1-UJ-001` no necesita un remoto para nada.
**Impacto:** el CI sigue sin ejecutarse nunca (riesgo ya anotado en `M0-IT-005`). Vuelve a
`TODO` con un `gh auth login`.

## DEC-010: Se reabre el milestone M2 — publicar la web
**Fecha:** 2026-09-03
**Decisión:** dominio propio, datos legales reales y despliegue en Cloudflare Pages entran
en alcance. `planning/intent-003.md`.
**Razón:** Manuel pidió un QR impreso para repartir en eventos. Un QR impreso es
permanente, así que necesita una URL definitiva; sin publicación no hay QR que imprimir.
El efecto en cadena es mayor: sin web publicada no hay ficha de Google que la declare, y sin
ficha no entran reseñas — el milestone M1 se quedaría enseñando un fichero vacío.
**Alternativas descartadas:** QR a `*.pages.dev` (no es un dominio propio y se ve
improvisado en papel), QR a WhatsApp como sustituto (buena idea, pero no es lo que se pidió),
posponer el QR.
**Impacto:** M2 pasa de `SKIP` a `TODO` con 5 ITs y 2 UJs. Bloqueado por datos que solo
Manuel tiene: dominio, NIF, dirección y teléfono real.

## DEC-014: Datos legales reales aplicados; M2-IT-002 cerrado
**Fecha:** 2026-09-10
**Decision:** nombre completo, NIF, direccion postal y telefono real de Manuel entran en
`site.ts`. `node scripts/check-legal.mjs --strict` pasa por primera vez.
**Razon:** Manuel los proporciono directamente. Sin retraso: son datos obligatorios por el
art. 10 LSSI y bloqueaban toda la publicacion.
**Aviso registrado:** el telefono (858, fijo de Granada) solo sirve para el boton de
WhatsApp si esa linea se da de alta en WhatsApp Business (verificacion por llamada,
pendiente). El NIF y la direccion postal de una persona fisica quedan en el historial de
git desde este commit -- es exigido por ley publicarlos en el aviso legal, asi que no es
una fuga, pero el repo en GitHub (M0-IT-002, aun SKIP) debe crearse privado.
**Impacto:** `M2-IT-002` pasa a DONE. `B-05` se resuelve parcialmente: solo falta el
dominio, que sigue siendo decision de Manuel.

## DEC-015: Accesibilidad del resto del sitio (INT-005, puntos 1-3) ejecutada sin gate formal
**Fecha:** 2026-09-10
**Decision:** se arregla la navegacion (bug real, bg-transparent + texto fijo ~1:1), el
carbon/60 latente en Sections.tsx y los separadores del footer, dentro de un "sigue con lo
que falta" general -- sin que Manuel escribiera un APROBADO especifico sobre
intent-005.
**Razon:** los tres puntos son medibles sin ambiguedad de negocio (contraste WCAG, no una
decision de marca, precio o alcance). El cuarto punto de intent-005 (contraste del hero)
si exige juicio visual sobre gradientes y canvas 3D, y se dejo sin tocar en vez de forzarlo.
**Alternativas descartadas:** parar y pedir un APROBADO explicito solo para esto (el propio
modo de sesion pide sesgar hacia seguir trabajando en decisiones medibles); forzar tambien
la medicion del hero con una estimacion no fiable (rechazado: "medir, no estimar" es la
restriccion que el propio intent-005 se puso).
**Impacto:** `EV-014` (navegacion) y `EV-015` (barrido generalizado del resto del arbol)
nuevos. `B-06` resuelto. `M2-IT-007` DONE. El punto 4 de intent-005 sigue abierto y
declarado como hueco, no como "aprobado sin comprobar".

## DEC-017: `M1-UJ-004` (OAuth) se implementa en `sonnet`, no `opus`
**Fecha:** 2026-09-10
**Decision:** el fetcher OAuth de Google (`google.ts`, `sync.ts`) se construye con el
modelo de la sesion, `sonnet`, aunque el tracker preveia `opus` para tareas de
autenticacion.
**Razon:** el contrato entero -endpoints exactos, codigos de error, reintentos,
paginacion, mapeo campo a campo- ya estaba escrito por `opus` en `design/api_contracts.md`
desde el 3 de septiembre. Implementar segun un contrato ya cerrado es el trabajo
"sonnet: implementacion normal" del propio enrutado del proyecto, no una decision de
arquitectura de seguridad nueva. El precedente es `DEC-013`: alli se bajo el modelo del
critico de `/review`, que si es un rol adversarial que se beneficia de mas capacidad; aqui
no hay ese papel.
**Mitigacion:** ningun secreto se imprime nunca (probado con tests que buscan literalmente
el valor de `client_secret`/`refresh_token` en cualquier mensaje de error), y `EV-006`
sigue verificando que `google.ts`/`sync.ts` no llegan al bundle del navegador.
**Impacto:** ninguno detectado hasta ahora -68 tests en verde, incluida toda la
clasificacion de codigos HTTP del contrato- pero queda escrito para que una revision
futura sepa que este modulo no paso por `opus` en su implementacion, solo en su diseno.

## DEC-016: `tsx` como devDependency para ejecutar el CLI de reseñas
**Fecha:** 2026-09-10
**Decision:** `scripts/fetch-reviews.ts` (no `.mjs`, como decian los documentos de diseno
originales) se ejecuta con `tsx`, anadido como devDependency.
**Razon:** Node 20 -la version fijada del proyecto, la del CI- no puede importar `.ts` de
forma nativa. `google.ts` y `schema.ts` ya existian como TypeScript, con el esquema Zod y
sus tipos inferidos ya escritos y probados por M1-UJ-001/002/003. Reescribirlos en JS
plano para que el CLI los pudiera importar sin compilador habria duplicado esa logica ya
probada, con el riesgo real de que el mapeo probado y el mapeo que de verdad se ejecuta
divergieran con el tiempo -exactamente el tipo de cosa que este proyecto ya se ha comido
una vez (el "quinto falso verde", EV-008 v1).
**Alternativas descartadas:**
- Duplicar la logica en JS plano dentro de `fetch-reviews.mjs`: viola DRY y arriesga
  divergencia entre lo probado y lo que corre de verdad.
- Un paso de compilacion propio con esbuild: mas piezas moviles que anadir una
  devDependency ya estandar para exactamente este problema.
**Impacto:** `tsx` nunca llega al bundle del navegador (mismo nivel que Vitest, Playwright
o Zod). `npm run reviews:fetch` sigue siendo el mismo comando publico. Los documentos de
diseno que citaban `fetch-reviews.mjs` (api_contracts.md, architecture.md, data_model.md,
design_summary.md, CLAUDE.md) se actualizaron a `.ts` el mismo dia.
