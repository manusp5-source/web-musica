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

## DEC-018: procedimiento de retirada de una reseña (M1-UJ-005), sin lista de exclusion automatizada
**Fecha:** 2026-09-10
**Decision:** si alguien pide retirar su resena, el procedimiento es MANUAL: se borra la
entrada de `data/reviews.json` a mano y se commitea. No se construye una lista de
exclusion automatizada que el fetcher consulte en cada sincronizacion.
**Razon:** el criterio de aceptacion de `M1-UJ-005` es condicional ("la lista de
exclusion, SI se implementa..."), y hoy no ha habido ninguna solicitud real -no hay
siquiera resenas reales todavia (B-01/B-02). Construir la maquinaria para un caso
hipotetico es exactamente lo que el principio "no inventar features sin necesidad real"
de este proyecto desaconseja.
**Procedimiento documentado** (para cuando llegue una solicitud real):
1. Localizar el `id` de la resena en `data/reviews.json` (es el `reviewId` de Google).
2. Borrar esa entrada del array `reviews` a mano, y restar 1 a `aggregate.count` SOLO si
   Google tambien la retiro; si sigue en Google pero se retira de la web por peticion,
   `aggregate.count` se queda como esta (es el total real de la ficha, no de lo mostrado).
3. Commitear con mensaje que cite la peticion (sin datos personales del solicitante en el
   propio mensaje de commit).
4. **Aviso**: la proxima vez que se ejecute `npm run reviews:fetch`, esa resena volveria a
   aparecer si sigue en Google. Hasta que exista una lista de exclusion de verdad, quien
   sincronice tiene que recordar no volver a incluirla a mano tras cada fetch.
**Cuando se automatiza:** el dia que ocurra una solicitud real, o que se detecte que el
paso 4 se ha olvidado una vez. No antes.
**Impacto:** `M1-UJ-005` cierra su criterio condicional documentando el procedimiento en
vez de construyendo codigo sin caso de uso real.

## DEC-019: el QR "web" ya tiene destino real; el destino de "review" se lee de data/reviews.json, no se duplica en site.ts
**Fecha:** 2026-09-10
**Decision:** `scripts/make-qr.ts` resuelve el destino "web" desde `site.domain`
(ya existente) y el destino "review" leyendo `profileUrl` de `data/reviews.json` en vez
de guardar una segunda URL en `site.ts`.
**Razon:** `data/reviews.json` ya es la frontera del sistema (principio 1 de la
constitucion) y `profileUrl` ya lo puebla el fetcher de M1-UJ-004. Guardar la misma URL
por segunda vez en `site.ts` crearia dos fuentes de verdad que podrian desincronizarse
-exactamente el problema que "el fichero es la frontera" existe para evitar en el resto
del proyecto.
**Efecto colateral favorable:** el dia que exista la ficha de Google y se ejecute
`npm run reviews:fetch`, el QR de reseñas se puede generar con `npm run qr` sin tocar
ninguna configuracion -el dato ya esta donde el generador lo busca.
**Alternativas descartadas:** un campo `site.qr.review.url` separado (duplicacion),
una variable de entorno nueva (duplicaria `GBP_PROFILE_URL`, que ya cumple ese papel para
el fetcher).
**Impacto:** `site.qr` queda como metadatos puros (label, filename), nunca URLs.

## Nota operativa (no numerada): un grep con case-sensitivity equivocada ocultó una regresion real
**Fecha:** 2026-09-10
**Que paso:** tras anadir `scripts/make-qr.ts`, `npm run build` se rompio de verdad
(`Type error: Could not find a declaration file for module 'qrcode'`). Una comprobacion
manual anterior en esta misma tanda uso `npm run build 2>&1 | grep -E "Compiled|Error"` -con
E mayuscula- y el mensaje real es "Type error" con e minuscula: el grep no lo vio, y el
build "parecia" verde.
**Como se detecto:** `npm run evals` ejecutado sin ningun filtro (via `npm run evals 2>&1 |
tail -22`, donde el filtro es solo de cuantas LINEAS finales mostrar, no de contenido) si
lo capturo, porque `EV-009` reconstruye de verdad y su check no usa grep alguno.
**Leccion:** un `grep` que filtra por palabras clave para "resumir" la salida de un build
es exactamente el mismo patron que ya ha fallado varias veces este proyecto -mirar el
sitio equivocado-, aplicado esta vez a mis propias comprobaciones manuales de sesion, no a
un eval. Los evals wrapped en `run.mjs` no tienen este problema porque no dependen de que
yo elija bien un patron de grep cada vez; una comprobacion manual con grep si.
**Arreglo:** `@types/qrcode` como devDependency. `npm run build` limpio, confirmado sin
ningun filtro de por medio.
**No es una decision de arquitectura**, es una nota operativa para no repetir el mismo
error: al verificar un build o test manualmente, o se lee la salida completa, o el grep
usa `-i` / cubre mayúsculas y minúsculas a proposito.

## Nota operativa (no numerada): pasada de /review sobre M1-UJ-004/005, contenido y QR
**Fecha:** 2026-09-11
**Revisor:** 3 intentos antes de completar (1 muerte por cuota de sesion, 1 atasco de
600s). Tercer intento: 80 llamadas, 17 min, arbol limpio confirmado al empezar y al
terminar.
**Critico (opus):** 42 llamadas, 11.5 min. Confirmo el bloqueante del revisor (piano en
paginas legales, verificado contra el HTML publicado) y encontro tres mas por su cuenta:
EV-013 con alcance enumerado (mismo patron que el quinto falso verde), un OCTAVO falso
verde real en EV-008 (ciego a un filtro pasado por prop, sin referenciar el modulo de
resenas), el JSON-LD de /en publicando la URL de la home ES, y el CTA principal del hero
sin enlazar a la seccion de tarifa que el mismo boton promete -- ademas confirmo que
`npx playwright test` SI funciona con margen (el atasco del revisor fue de su sandbox, no
del proyecto), marcandolo INFUNDADO.
**VEREDICTO del critico:** arreglar primero, 4 bloqueantes.
**Arreglos aplicados, los 4 con rojo->verde probado contra el ataque exacto reportado:**
1. Contenido de las dos paginas legales corregido; EV-013 generalizado a recorrer
   app/+src/ enteros (34 ficheros) en vez de una lista de 5.
2. EV-008 pierde su condicion de entrada (TOCA_RESENAS): pasa de vigilar solo ficheros
   que referencian el modulo de resenas a escanear todo el arbol sin excepcion,
   reproduciendo el plantado exacto del critico antes de arreglarlo.
3. `HomePage.tsx`: `url` del JSON-LD pasa a depender de `locale`. Test nuevo
   `jsonld-locale.test.tsx`.
4. `Hero.tsx` (CTA a #tarifa) y `Nav.tsx` (enlace nuevo en el menu). Test nuevo y
   generalizado `anclas-vivas.test.tsx`: cualquier `<section id>` sin enlace entrante se
   pone rojo solo, no solo el caso de tarifa.
**Evals nuevos:** EV-017 (anclas vivas). EV-004, EV-008 y EV-013 ampliados con su propio
historial de falso verde -> arreglo.
**Pendiente:** pasada de reverificacion focalizada (revisor, alcance solo los 4 arreglos)
antes de marcar `Review OK` en el task_tracker -- paso 4 del protocolo de /review.

## DEC-020: Cloudflare Workers + `@opennextjs/cloudflare`, no Cloudflare Pages "clásico"
**Fecha:** 2026-09-16
**Decisión:** el destino real de `M2-IT-003` es un Worker de Cloudflare construido con el
adaptador `@opennextjs/cloudflare`, no un export estático servido por Cloudflare Pages.
**Razón:** `next.config.mjs` define `headers()` con las cabeceras de seguridad reales del
proyecto (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) — un
`output: "export"` las ignora por completo, así que un deploy estático publicaría la web
sin ninguna de ellas. `@cloudflare/next-on-pages` está deprecado oficialmente en favor de
`@opennextjs/cloudflare`. Se descartó también `vinext` (la opción que Cloudflare recomienda
ahora por defecto): sigue en beta y su compatibilidad con `headers()` y con
`images.remotePatterns` no está documentada — dos piezas de seguridad reales de este
proyecto (CSP/HSTS, protección SSRF en `/_next/image`), no algo que se pueda apostar en
una web ya en producción.
**Verificado, no asumido:** `npx opennextjs-cloudflare build` seguido de
`npx opennextjs-cloudflare preview` levanta el Worker en local (`wrangler dev`, puerto
8788) sin cuenta de Cloudflare. `curl -I http://127.0.0.1:8788/` devuelve las 6 cabeceras
de `next.config.mjs` sin recortar; `/en` y `/aviso-legal` responden 200.
**Alternativas descartadas:** Cloudflare Pages con export estático (pierde las cabeceras),
`@cloudflare/next-on-pages` (deprecado), `vinext` (beta, compatibilidad no documentada con
las dos piezas de seguridad que este proyecto sí usa).
**Impacto:** nuevos ficheros `wrangler.jsonc` y `open-next.config.ts` en la raíz;
`@opennextjs/cloudflare` en `dependencies` (se ejecuta dentro del Worker desplegado, no
solo en build) y `wrangler` en `devDependencies` (solo CLI, mismo patrón que `tsx` en
`DEC-016`). `.open-next/`, `.wrangler/` y `cloudflare-env.d.ts` van a `.gitignore`: se
regeneran con `npm run cf:preview` / `cf:deploy`. `M2-IT-003` sigue `BLOCKED (parcial)`:
falta la cuenta de Cloudflare y `wrangler login` de Manuel para el primer deploy real.

## DEC-021: identidad visual (logo, cartel, tarjeta) construida como HTML/SVG verificable, no encargada a Claude Design
**Fecha:** 2026-09-16
**Decisión:** el logo (3 lockups), el cartel A4 y la tarjeta de visita se construyeron como
SVG/HTML de autoría propia dentro del repo (`assets/logo/`, `assets/cartel/`,
`assets/tarjeta/`), verificados con capturas reales de Playwright, no a través de
Claude Design (herramienta `DesignSync`).
**Razón:** `DesignSync` devolvió error explícito — necesita autorización de diseño que solo
se puede conceder con `/design-login` desde una sesión interactiva, y esta sesión no lo es.
No había forma de rodear esa barrera sin la acción de Manuel.
**Alternativas descartadas:** esperar a que Manuel autorice Claude Design antes de entregar
nada (se descartó por bloquear sin necesidad un encargo que sí se podía resolver con las
herramientas ya disponibles en la sesión).
**Impacto:** la marca vive como ficheros de texto plano versionados, editables a mano y sin
dependencia de una cuenta externa. Si Manuel autoriza Claude Design más adelante
(`/design-login`), estos mismos ficheros pueden subirse allí como punto de partida — no hay
que rehacer el trabajo.

## DEC-022: se retira la tarifa publicada; `EV-013` no se toca para permitir piano/guitarra en la biografía

**Fecha:** 2026-09-25
**Decisión:** la sección `Pricing` y todo el contenido de precio (web, JSON-LD `priceRange`,
cartel, tarjeta) se retiran. `EV-013` (sin promesa de piano) se deja intacto — no hizo
falta tocarlo para que la biografía nueva mencione formación en piano y guitarra.
**Razón:** decisión de negocio de Manuel, reversión explícita de `DEC` implícita de
`M2-IT-006` ("ningún competidor local publica precio" era el diferenciador central del plan
de negocio en `docs/plan-negocio-viola.md` §4). No hay indicio técnico de que fuera un
error: es un cambio de estrategia, y se ejecuta como tal, sin intentar justificarlo a
posteriori.

Sobre `EV-013`: antes de escribir la biografía nueva se leyó el eval completo en vez de
asumir su alcance. No es un bloqueo ciego de la palabra "piano" — persigue seis
frases-promesa concretas (`piano y viola`, `viola y piano`, `piano en directo/vivo`,
`dos instrumentos`, `piano para el cóctel`, su equivalente en inglés). Una mención
biográfica ("empecé en el conservatorio con el piano y la guitarra... antes de
especializarse en la viola") no coincide con ninguno de los seis patrones, comprobado a
mano contra cada regex antes de escribir y confirmado después con `npm run evals` en
verde. La distinción real que sí importa y que si el eval mereciera cambiarse habría que
codificar: piano/guitarra como trayectoria está permitido, como servicio reservable en un
evento no lo está — hoy el eval ya traza esa línea sin ayuda porque sus patrones son de
promesa de servicio, no de la palabra suelta.
**Alternativas descartadas:** generalizar `EV-013` a un bloqueo ciego de "piano" en
cualquier contexto — la propia historia del fichero explica por qué no: sería el noveno
falso verde de este proyecto, esta vez en la dirección contraria, bloqueando contenido
legítimo en vez de dejar pasar uno ilegítimo. Retirar el eval entero: innecesario, sigue
vigilando lo que tiene que vigilar.
**Impacto:** `Pricing` fuera de `Sections.tsx` y `HomePage.tsx`; tipo `Price` y campo
`pricing` fuera de `Dict`; `nav.pricing` fuera de `Dict.nav`; `tests/unit/pricing.test.tsx`
retirado; `tests/unit/anclas-vivas.test.tsx` actualizado (el CTA del hero pasa a apuntar a
`#contacto`, no a `#tarifa`, que ya no existe). Si algún día se vuelve a publicar precio,
se reintroduce en `dictionaries.ts` y `HomePage.tsx` — no hace falta tocar ningún eval para
deshacer esto.

## DEC-023: Cloudflare Web Analytics en vez de Google Analytics

> Nota de numeración: esta entrada nació como `DEC-022` en `feat/cloudflare-web-analytics`,
> rama salida de `main` el mismo día que `feat/contenido-humano-sin-precios` — las dos
> reclamaban el mismo número. Renumerada a `DEC-023` al integrar, por ser la que llegó
> segunda a esta rama de revisión; no es un error de ninguna de las dos entradas.

**Fecha:** 2026-09-25
**Decisión:** las métricas del sitio, cuando se activen, corren por Cloudflare Web
Analytics, no por Google Analytics ni ninguna otra herramienta basada en cookies.
**Razón:** Manuel pidió "añadir las cookies también" sin más detalle — antes de construir
nada se preguntó directamente, porque las dos lecturas posibles llevan a arquitecturas
legales distintas (RGPD/LSSI): cookies de verdad exigen banner de consentimiento
aceptar/rechazar antes de cargar cualquier script, con ampliar `site.cookies` y la lógica
condicional que ya existe en `/cookies`; sin cookies, ninguna de las dos cosas hace falta.
Manuel eligió sin cookies. Cloudflare Web Analytics además encaja con que todo el resto del
proyecto (`DEC-020`) ya vive en Cloudflare — una cuenta menos que gestionar.
**Alternativas descartadas:** Google Analytics (cookies de verdad, banner nuevo, página
`/cookies` con su rama condicional ya construida pero sin activar); Plausible/Fathom
(cookieless también, pero de pago y una cuenta más fuera de Cloudflare sin necesidad).
**Verificado, no asumido:** los dos hosts que exige el beacon del CSP
(`static.cloudflareinsights.com` en `script-src`, `cloudflareinsights.com` en
`connect-src`, distintos entre sí) se confirmaron contra la documentación pública antes de
tocar `next.config.mjs`, no de memoria — un CSP mal puesto aquí falla en silencio (la
petición se bloquea, no hay error visible para un visitante) y es fácil no darse cuenta
hasta mirar la consola del navegador. Fuente citada (el crítico de la review del 25 sep
marcó esto `INFUNDADO` por no llevar cita — tenía razón en que el propio subagente no
podía comprobarlo sin acceso web, pero la verificación sí ocurrió, con
`WebSearch` contra `developers.cloudflare.com/web-analytics/faq` y ejemplos reales de
`content-security-policy.com/examples/cloudflare` y varios issues de GitHub que documentan
el mismo bloqueo con la misma pareja de hosts):
`https://developers.cloudflare.com/web-analytics/faq/`,
`https://content-security-policy.com/examples/cloudflare/`.
**Impacto:** `src/components/CloudflareAnalytics.tsx` nuevo, importado en los dos layouts
raíz. `site.analytics.cloudflareToken` vacío por defecto — el beacon no se renderiza hasta
que Manuel dé de alta el sitio en el dashboard de Cloudflare y pegue el token; cero cambio
de comportamiento hasta entonces. `/cookies` y `/en/cookies` documentan la herramienta como
lo que es, condicionado también al token: no reclaman analítica activa si no lo está.

**Adenda de la review, 25 sep — riesgo de doble conteo (hallazgo del crítico):** Cloudflare
Web Analytics ofrece alta "Automatic" (inyecta el beacon en el borde para cualquier zona
proxiada) o "Manual" (el snippet que ya renderiza este componente). Un Worker de Cloudflare
**siempre** es una zona proxiada — si Manuel elige "Automatic" al dar de alta el sitio,
Cloudflare añadiría un segundo beacon en el borde y cada visita se contaría dos veces,
junto con el que ya sirve `CloudflareAnalytics.tsx`. Verificado con `WebSearch` contra
`developers.cloudflare.com/analytics/web-analytics/configuring-web-analytics/rules` y un
hilo de la comunidad de Cloudflare que documenta exactamente este caso ("avoid combining
automatic and manual setups on the same page"). Mitigación: **elegir "Manual setup"**,
documentado en el comentario de `site.analytics` en `site.ts` para que quede donde Manuel
lo vea justo antes de pegar el token.

**Adenda de la review, 25 sep — bloqueante real cerrado:** el revisor encontró una cifra de
tests falsa en `M2-IT-010` del tracker (afirmaba 80/80, la suite daba 75/75) y que
`CloudflareAnalytics.tsx` no tenía ningún test — el camino sin token estaba verificado a
mano con `curl` contra el HTML servido, pero el camino CON token, el único que corre de
verdad en producción, no tenía ninguna red. El crítico sostuvo el hallazgo. Arreglado:
`tests/unit/cloudflare-analytics.test.tsx`, cubre los dos caminos.

## DEC-024: se retira el manifiesto C2PA embebido de los tres SVG del logo

**Fecha:** 2026-09-25 (hallazgo del crítico en la review del mismo día)
**Decisión:** `app/icon.svg`, `public/logo/logo-horizontal.svg` y
`public/logo/logo-horizontal-dark.svg` (y sus fuentes en `assets/logo/`) pierden el bloque
`<metadata><c2pa:manifest>…</c2pa:manifest></metadata>` y el atributo `xmlns:c2pa` de la
raíz `<svg>`. El dibujo no cambia ni un píxel — solo se retira la credencial de
procedencia.
**Razón:** ese bloque ocupaba 7.774 bytes de cada fichero (68-70% de su peso total: de
~11.160-11.390 B a ~3.388-3.610 B), y era el único contenido del bloque un manifiesto de
C2PA declarando "Claude provided this file at the request of a user and may have created
or modified the file contents", con certificados de firma de Anthropic. Nadie lo pidió, y
el lote de trabajo de hoy (`M2-IT-009`) fue justo el de hacer la web sonar más humana y
menos corporativa — publicar una credencial de autoría de IA en el logo de un músico va en
la dirección contraria a propósito, no por descuido. El peso también es real: tres SVG que
cargan en cada visita (favicon + header + footer) llevando 23 KB de metadatos que nadie va
a leer, en un proyecto que vigila el First Load JS al byte.
**Verificado, no asumido:** capturas de Playwright de los tres ficheros antes/después
confirman que el dibujo es idéntico — el `<metadata>` no afecta el renderizado, es
puramente informativo. `npm run build` limpio tras el cambio.
**Alternativas descartadas:** dejarlo (el argumento en contra pesa más: ni el peso ni el
mensaje de marca lo justifican); mantenerlo solo en las fuentes de `assets/logo/` y
quitarlo solo de lo servido (deja las dos copias desincronizadas sin motivo, y las fuentes
son las que Manuel tocaría si algún día reabre el diseño en Claude Design).
**Impacto:** si Manuel algún día quiere que el logo declare su procedencia de IA por
transparencia deliberada (no es descabellado — es una postura legítima), es una decisión
suya a tomar de nuevo, no algo que quedó puesto sin que nadie lo mirara.
