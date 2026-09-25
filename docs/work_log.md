# Work Log — web-musica

Registro cronológico. Una entrada por IT o UJ, escrita al terminar la tarea, no en lotes.

## Formato de entrada

### [fecha] — M0-IT-001: [nombre] completado
- **Trabajo hecho**: [qué se implementó]
- **Modelo usado / Skill cargada**: [tiene que coincidir con el task_tracker]
- **Ficheros creados / modificados**: [lista]
- **Verificación (salida)**: [el comando ejecutado y su salida confirmada]
- **Verificación (trayectoria)**: diff contra el plan · skill realmente cargada · alcance
- **Eval**: [qué eval de `implementation/evals/` lo cubre y su resultado]
- **Comprobación de seguridad**: [pasa/falla, o no aplica]
- **Tests**: [añadidos y su resultado]
- **Notas**: [lo no obvio para una sesión futura]

---

## Log

### 2026-09-03 — Scaffold FactorIA (previo a M0)
- **Trabajo hecho**: gate de fábrica, intent `INT-001`, discovery hasta 6% de ambigüedad,
  propuesta de arquitectura, planning gate superado con `APROBADO`, y scaffold completo de
  `planning/`, `design/`, `implementation/`, `docs/` y `CLAUDE.md`.
- **Modelo usado / Skill cargada**: `opus` para arquitectura y gate; skill `init-project`.
- **Ficheros creados**: 21 (4 en `planning/`, 8 en `design/`, 4 en `implementation/`,
  6 en `docs/`, más `CLAUDE.md`).
- **Verificación (salida)**: `mv` de la carpeta confirmado con `ls`; ficheros creados y
  listados. **Pendiente**: `npm run build` después del rename — se ejecuta en `M0-IT-001`.
- **Verificación (trayectoria)**: no se ha escrito ni una línea de código de aplicación,
  que es exactamente lo que exige el planning gate. El rename se adelantó al scaffold para
  no crear 21 ficheros en una ruta condenada.
- **Eval**: ninguno todavía. El runner es `M0-IT-006`.
- **Comprobación de seguridad**: no aplica (solo documentación).
- **Notas**:
  - La carpeta pasó de `Desktop\Página web música` a `Desktop\web-musica`. **Hay que
    reabrir el proyecto en el IDE con la ruta nueva.**
  - `github-actions-templates` está marcada `REFS ROTAS (todas)` en el índice de skills. No
    volver a intentar cargarla; para el CI se usa `deployment-procedures`.
  - La API v4 de Google **no devuelve enlace por reseña individual**. Se corrigió el modelo
    de datos: `url` es opcional y la atribución apunta a la ficha.
  - Descubierto durante el scaffold: `node_modules` sobrevivió al rename sin reinstalar,
    pero no se ha ejecutado ningún build para confirmarlo.

### 2026-09-03 — M0-IT-001: rama y primer commit — DONE
- **Trabajo hecho**: `master` renombrada a `main`; commit base con el sitio tal y como
  estaba (41 ficheros); rama `feat/factoria-reviews`; segundo commit con el scaffold de
  FactorIA (24 ficheros).
- **Modelo usado / Skill cargada**: `opus` (el previsto era `haiku`; no se puede cambiar de
  modelo dentro de la sesión). Skill: `ninguna`, como decía el tracker.
- **Verificación (salida)**: `git log --oneline` devuelve 2 commits; `git status --short`
  sale vacío. El primer criterio de éxito del intent queda cumplido.
- **Verificación (trayectoria)**: el commit base incluye **solo** ficheros preexistentes y
  el de la rama **solo** los del método. Sin mezcla, sin alcance de más.
- **Notas**: decisión que roza la regla «nunca commitear a main»: el commit base va en
  `main` porque importar código que ya existía no es un cambio que revisar, y sin él el
  diff de la rama serían 271 ficheros. Todo el trabajo nuevo va en rama.
  Git avisa de conversión LF→CRLF en cada fichero: es Windows, no un problema.

### 2026-09-03 — M0-IT-002: repo en GitHub — BLOCKED
- **Motivo**: `gh` no está instalado (comprobado en Git Bash y en PowerShell:
  `Get-Command gh` → nada).
- **Arrastra**: `M0-IT-005` puede escribir el workflow, pero no verlo ejecutarse.
- Registrado como B-03 en el Blockers Log.

### 2026-09-03 — M0-IT-003: Vitest + Testing Library + jsdom — DONE
- **Trabajo hecho**: `vitest.config.mts` con alias `@` espejo del tsconfig, `tests/setup.ts`
  con `cleanup` automático, y dos suites reales: estructura de los diccionarios ES/EN y el
  invariante «`Testimonials` no renderiza nada sin datos», que es el que hereda `M1-UJ-001`.
- **Modelo usado / Skill cargada**: `opus` (previsto `sonnet`). Skill
  `javascript-testing-patterns` cargada; su `resources/implementation-playbook.md` **sí
  existe** — no es de las skills con recursos fantasma.
- **Ficheros creados**: `vitest.config.mts`, `tests/setup.ts`,
  `tests/unit/dictionaries.test.ts`, `tests/unit/testimonials.test.tsx`; `package.json`
  gana `test` y `test:watch`.
- **Verificación (salida)**: `npx vitest run` → `2 passed (2)` ficheros, `6 passed (6)`
  tests, 1,78 s.
- **Verificación (trayectoria)**: primer intento en rojo con `ReferenceError: React is not
  defined`. Causa real: `tsconfig.json` usa `"jsx": "preserve"` (lo necesita Next) y esbuild
  hereda ese valor cayendo al runtime clásico de JSX. Arreglado en la configuración con
  `esbuild: { jsx: "automatic" }`, no importando React en cada test — el atajo habría
  escondido el problema hasta el siguiente fichero.
- **Tests**: 6, todos nuevos, todos en verde.
- **Notas**: confirma el supuesto **S-05** — Testing Library 16 convive con React `19.0.0`
  fijado exacto, sin `--legacy-peer-deps`.

### 2026-09-03 — Fuera de tarea: `gh` instalado y `sharp` parcheado
- **Trabajo hecho**: `winget install GitHub.cli` → 2.99.0. `npm audit fix` → de 4
  vulnerabilidades altas en dependencias de **producción** (todas en `sharp`, heredadas del
  proyecto original) a **0**.
- **Verificación (salida)**: `npm audit --omit=dev` → `found 0 vulnerabilities`;
  `npx vitest run` → 6/6; `npm run build` → 13/13 páginas. Nada se rompió.
- **Notas**: `gh` sigue sin autenticar (`gh auth status` → *not logged into any GitHub
  hosts*). `gh auth login` abre navegador y lo tiene que hacer Manuel. B-03 sigue abierto
  pero cambia de causa.

### 2026-09-03 — M0-IT-004: Playwright + smoke ES/EN — DONE
- **Trabajo hecho**: `playwright.config.ts` (puerto 3100, build de producción como
  `webServer`, no `dev`), `tests/e2e/home.spec.ts` con 7 casos, y `NEXT_PUBLIC_HERO3D` en
  `src/config/site.ts` para poder apagar el hero 3D sin tocar código.
- **Modelo usado / Skill cargada**: `opus` (previsto `sonnet`). Skill `e2e-testing`:
  **es un router de fases, no contenido** — enumera otras skills a invocar y no aporta
  patrones. No está rota, pero no aporta; para un smoke no hace falta volver a abrirla.
- **Verificación (salida)**: `npx playwright test` → `6 passed, 1 skipped` en 25 s.
- **Verificación (trayectoria)**: **se cazó un falso verde y esto es el hallazgo del día.**
  El test original afirmaba `expect(page.locator("canvas")).toHaveCount(0)` y pasaba
  **también con el 3D encendido** (`HERO3D_E2E=on`), o sea que no comprobaba nada. Causa:
  `Scene` se carga con `dynamic(ssr:false)` y WebGL puede no inicializar nunca en Chromium
  headless, así que nunca hay canvas, encendido o apagado. Sustituido por un marcador
  determinista —el botón de audio `aria-label="Escuchar"`, que solo existe si `Hero3D` se
  montó— y **comprobado en las dos direcciones**: con `HERO3D_E2E=on` el botón aparece; por
  defecto, no existe.
- **Tests**: 7 e2e (uno guardado tras `HERO3D_E2E=on`), más los 6 unitarios de M0-IT-003.
- **Notas**: la lección vale para todo el proyecto — **una aserción negativa que nunca se ha
  visto fallar no es un test, es una decoración.** Aplicará igual al «sin reseñas, sección
  ausente» de `M1-UJ-001`: hay que verlo en rojo con datos presentes.

### 2026-09-04 — M0-IT-005: workflow de CI — DONE (dormido)
- **Trabajo hecho**: `.github/workflows/ci.yml` — checkout, Node 20 con caché de npm,
  `npm ci`, lint, `check-legal` en modo aviso, unitarios, build, Chromium, smoke e2e,
  evals, y subida del informe de Playwright si algo falla. `concurrency` cancela la
  ejecución anterior de la misma rama.
- **Modelo usado / Skill cargada**: `opus` (previsto `sonnet`). Skill
  `deployment-procedures`: **es doctrina de despliegue** (plataformas, rollback, ventanas
  de verificación), no plantillas de CI. Útil para M2, poco para esta tarea. No está rota.
- **Verificación (salida)**: el workflow **no se ha ejecutado nunca en GitHub** — no hay
  remoto (B-03). Lo verificable era la cadena, y se ejecutó paso a paso en local:
  `npm run lint` limpio, `check-legal` avisa y sale 0, `vitest run` 6/6,
  `npm run build` 13/13, `playwright test` 6+1. **Un YAML que no se ha ejecutado no está
  verificado, y así queda anotado: `DONE (dormido)`.**
- **Notas**: `check-legal` va en modo aviso a propósito. Con `--strict` el CI estaría en
  rojo permanente desde el primer día, y un CI que siempre falla es un CI que nadie mira.
  `M2-IT-002` lo pasa a `--strict` cuando existan los datos reales.

### 2026-09-04 — M0-IT-006: eval harness — DONE
- **Trabajo hecho**: `implementation/evals/run.mjs` (extrae el comando del bloque ```bash
  bajo `## Comando` de cada `*.eval.md`, lo ejecuta y devuelve exit ≠ 0 si falla alguno),
  más dos evals reales: `EV-006` (ningún secreto en `.next/`) y `EV-009` (el build no
  necesita credenciales). Los checks van en Node, no en `grep`: el runner puede lanzarse
  desde PowerShell y un eval que solo corre en una shell deja de ejecutarse sin avisar.
- **Modelo usado / Skill cargada**: `opus` (previsto `sonnet`). Skill `evaluation`
  **cargada y descartada**: trata de evaluación de agentes —rúbricas multidimensionales,
  LLM-as-judge, no determinismo— y aquí los evals son comandos deterministas. No está rota,
  simplemente no era la tarea. Anotado para no volver a abrirla por este motivo.
- **Verificación (salida)**: **rojo primero.** Se plantó `.next/static/__eval-red.js` con
  un `refresh_token` falso → `npm run evals` devolvió `EXIT=1` y `EV-006 FALLA`, nombrando
  el fichero y el término encontrado. Retirado el fichero → `2 pasan · 0 fallan`, exit 0.
- **Verificación (trayectoria)**: el runner cuenta como `PENDIENTE`, nunca como aprobado,
  cualquier eval cuyo comando siga siendo el placeholder de la plantilla. Sin eso, siete
  ficheros vacíos darían una suite «verde».
- **Notas**: EV-009 tarda ~60 s porque reconstruye. Es el precio de comprobar el build de
  verdad; si molesta, se separa en una suite rápida y otra lenta.

### 2026-09-04 — M0-IT-008: guardia de placeholders — DONE
- **Trabajo hecho**: `scripts/check-legal.mjs` gana un segundo nivel. **LEGAL** (nombre,
  NIF, dirección) bloquea con `--strict`; **PENDIENTE** (dominio, WhatsApp, vídeos, redes)
  solo avisa, y cada aviso dice *por qué* importa, no solo que falta.
- **Modelo usado / Skill cargada**: `opus` (previsto `haiku`). Skill: `ninguna`.
- **Verificación (salida)**: modo aviso → 4 pendientes + 3 legales, `EXIT=0`. Modo
  `--strict` → `EXIT=1`. Los dos comportamientos, ejecutados y confirmados.
- **Verificación (trayectoria)**: **defecto propio cazado al leer la salida.** La primera
  regla de `social` daba falso negativo: buscaba `https://` dentro del bloque y encontraba
  las URLs de ejemplo de los comentarios `←CAMBIAR`. Corregido quitando los comentarios
  antes de evaluar. Es el mismo patrón que el falso verde de M0-IT-004 — una comprobación
  que mira el sitio equivocado y siempre dice que sí.
- **Notas**: no rellena nada, solo avisa. Rellenar los datos es `M2-IT-002` y necesita a
  Manuel.

### 2026-09-05 — M0-IT-002: apartado a `SKIP` temporal
- **Motivo**: `gh` instalado desde el 4 sep, sin autenticar tras dos sesiones.
  `gh auth login` abre navegador y solo lo puede hacer Manuel.
- **Decisión**: se aparta conscientemente en vez de dejar M1 parado. La regla de FactorIA
  —ningún UJ con un IT abierto de su milestone— existe para que la infraestructura que un
  UJ necesita esté lista. **Un repo remoto no es prerrequisito técnico de `M1-UJ-001`**:
  no cambia una línea del código de reseñas. Lo que se pierde es la ejecución del CI, ya
  anotada como riesgo en `M0-IT-005`.
- **Reversible**: vuelve a `TODO` con un `gh auth login`.

### 2026-09-05 — M1-UJ-001: reseñas en la home — REVIEW
- **Trabajo hecho**: `src/lib/reviews/schema.ts` (Zod + `EMPTY_REVIEWS`),
  `src/lib/reviews/load.ts` (lee, valida, ordena, nunca lanza), `src/components/Reviews.tsx`
  (Server Component), `data/reviews.json` con el snapshot vacío, rótulos `reviews.*` en ES
  y EN, y `HomePage` pasando de `Testimonials` a `Reviews`.
- **Modelo usado / Skill cargada**: `opus` (previsto `sonnet`). Skill `react-best-practices`
  cargada y **aplicada de verdad**: `rendering-conditional-render` (ternarios en vez de `&&`,
  que con una cadena vacía puede renderizar basura) y `js-early-exit` en el retorno `null`.
- **Verificación (salida)**: 23/23 unitarios · lint limpio · build 13/13 páginas.
- **Verificación (trayectoria)** — lo importante de esta tarea:
  1. **Rojo primero**: los dos suites fallaban por `Failed to resolve import`, escritos
     antes que el código.
  2. **Probado en un build real, en las dos direcciones.** Con el fixture como
     `data/reviews.json`: `id="opiniones"`, «Laura M.» y «1 de 5 estrellas» presentes en el
     HTML generado. Con el snapshot vacío: `id="opiniones"` ausente.
  3. **Tercer falso positivo del proyecto, otra vez por mirar donde no era.** El primer
     `grep` recorría `.next/server/app/` entero y daba «Opiniones» como presente incluso sin
     datos. No era un fallo del componente: Next serializa el diccionario completo en el
     payload RSC porque `dict` se pasa a componentes de cliente (Nav, Contact, CookieBanner).
     El marcador correcto es `id="opiniones"` sobre ficheros `.html`.
- **Eval**: `EV-001` — FALLA el 5 sep antes del código, PASA después.
- **Comprobación de seguridad**: el texto se renderiza como texto (test con
  `<img src=x onerror=...>`, comprueba que no aparece ningún `<img>`); `load.ts` importa
  `node:fs`, así que un componente de cliente que lo importe rompe el build; **no se
  muestran los avatares de Google** (iniciales en su lugar), lo que evita abrir la CSP y
  que el visitante haga peticiones a Google. Resuelve Q-02 por el lado conservador.
- **Notas**: un JSON válido pero fuera de esquema también degrada a vacío, con el campo
  culpable en el log. La reseña de 1 estrella del fixture está a propósito: hay un test que
  falla si alguien introduce un filtro por puntuación.
- **Hallazgo lateral**: pasar `dict` entero a componentes de cliente mete todos los textos
  ES o EN en el HTML. No es un fallo, pero es peso; la regla `server-serialization` de la
  skill apunta justo a eso. Anotado para un intent de rendimiento, fuera de alcance hoy.

### 2026-09-05 — M1-UJ-002: reseñas en la raíz inglesa — REVIEW
- **Trabajo hecho**: **ninguno de código.** `app/(en)/en/page.tsx` ya pasaba `locale="en"` y
  el componente de `M1-UJ-001` ya consumía `locale` para fecha, número y rótulos. La tarea
  se convirtió en escribir la prueba de que eso es cierto: `tests/unit/reviews-en.test.tsx`,
  6 casos.
- **Modelo usado / Skill cargada**: `opus`. Skill: **`ninguna`**, y es una decisión, no un
  olvido — `nextjs-best-practices` estaba anotada, pero no había nada que implementar y
  abrirla habría sido teatro. Anotado en el tracker.
- **Verificación (salida)**: 6/6 **en verde a la primera**. Lo digo tal cual: aquí no hubo
  rojo previo porque no hubo código nuevo. Un eval que nace verde no demuestra que el
  código de hoy funcione; demuestra que el de ayer sigue funcionando. Por eso se queda.
- **Verificación (trayectoria)**: el test compara ES y EN en la misma ejecución en vez de
  fiarse de una cadena fija, y comprueba que el número de tarjetas coincide — si alguien
  duplicara el fichero de datos por idioma, se pondría rojo.
- **Eval**: `EV-003`, PASA.
- **Notas**: el caso que de verdad importa aquí es que **una reseña en español aparece sin
  traducir en `/en`**. Traducir el texto de un tercero y seguir atribuyéndoselo es
  problemático, y ahora hay un test que lo impide.

### 2026-09-05 — M1-UJ-003: JSON-LD con valoración — REVIEW
- **Trabajo hecho**: `src/lib/reviews/jsonld.ts` con `buildRatingJsonLd`, esparcido en el
  bloque JSON-LD que `HomePage` ya emitía. Sin reseñas no añade ninguna clave.
- **Modelo usado / Skill cargada**: `opus` (previsto `sonnet`). Skill `seo-fundamentals`:
  es doctrina general —E-E-A-T, Core Web Vitals, principios— con una tabla de tipos de
  schema y una frase que sí valía: *el schema da elegibilidad para resultados enriquecidos,
  no los garantiza*. Poco sobre `AggregateRating` en concreto. No está rota.
- **Verificación (salida)**: 36/36 unitarios, lint limpio.
- **Verificación (trayectoria)**: rojo primero (`Failed to resolve import`), verde después.
  Y comprobado **sobre el HTML generado**, parseando el `<script type="application/ld+json">`
  del build real: con datos, `{"ratingValue":4.7,"reviewCount":23}`, 3 reseñas, incluida la
  de 1 estrella; sin datos, ni `aggregateRating` ni `review`, y el bloque
  `MusicGroup+LocalBusiness` intacto.
- **Comprobación de seguridad**: test con `</script><script>alert(1)</script>` dentro del
  texto de una reseña; el escape de `<` que ya tenía `HomePage` lo neutraliza y el JSON
  sigue siendo parseable.
- **Notas**: dos decisiones que parecen detalles y no lo son. **`reviewCount` publica el
  total de la ficha (23), no las mostradas (3)** — recortarlo contradice lo que Google ya
  sabe. Y **sin reseñas no se emite `aggregateRating`**, porque un `ratingValue: 0` se lee
  como una valoración pésima, no como ausencia de valoración.
- **Pendiente**: validar en el Rich Results Test de Google. Necesita URL pública → B-04.

### 2026-09-10 — M2-IT-006 / INT-006: el contenido dice lo que el negocio decidió — DONE

- **Trabajo hecho**: reescritura de contenido en ES y EN según el §4 del plan de negocio,
  más la sección de tarifa (`Pricing`), los metadatos de las dos raíces y el JSON-LD.
- **Modelo usado / Skill cargada**: `opus`. Skill: **`ninguna`**, y es deliberado — el
  trabajo de posicionamiento ya lo hizo el comité `c-suite-*` en `INT-004`. Aquí no había
  que decidir qué decir, sino escribirlo. Cargar `copywriting` habría sido volver a abrir
  una decisión ya tomada.

**Lo que salió de la web:**

- **14 promesas de piano en vivo**, repartidas por cinco ficheros: hero, servicios, FAQ,
  «sobre mí», la marca de `site.ts` y los tres de metadatos, en los dos idiomas. El plan
  decidió viola sola en ceremonia y viola con base propia en cóctel; la web seguía
  vendiendo dos instrumentos en directo.
- **Madrid.** `site.city` era un placeholder que el JSON-LD publicaba como si fuera un dato.
  Ahora Granada y `Provincia de Granada`, que es donde están las 736 ceremonias religiosas
  del segmento núcleo.
- **Los cuatro servicios equidistantes** —bodas, corporativo, hoteles, celebraciones— que
  son exactamente los mismos que anuncian los otros 150 proveedores del mercado.

**Lo que entró:**

- El titular es la frase de posicionamiento del §4, tal cual: *«La ceremonia a viola sola,
  con vuestro arreglo hecho por mí»*, y el subtítulo remata con el precio.
- **La tarifa publicada**, seis líneas y política de desplazamiento, junto a los servicios
  y no escondida al final. Ningún competidor local lo hace: es el diferenciador más barato
  del plan y la pata que sostiene el posicionamiento ahora que no hay piano.
- Servicios reordenados por la prioridad del §4: ceremonia, cóctel, funerales
  —contraestacionales, la única fuente de ingreso fuera de temporada— y comuniones con
  hostelería.
- FAQ nueva que responde lo que el plan identificó como objeciones reales: si se puede tocar
  en iglesia, si las bases son de terceros (**no**: se producen con FL Studio, y el plan
  avisa de que usar audio de YouTube puede dejar una actuación sin poder facturarse), si el
  precio es final, y qué pasa si el músico enferma.
- JSON-LD: `areaServed` pasa de «España» a la provincia — declarar el país entero diluye
  la señal local, que es todo el activo SEO del año 1 — y gana `priceRange`.

- **Verificación (salida)**: 42 unitarios (5 nuevos de la tarifa), lint limpio, build OK.
- **Verificación (trayectoria)**: `EV-013` escrito **antes** de tocar el contenido y visto
  en rojo con las 14 promesas listadas una a una. Verde después.
- **Eval**: `EV-013` — rojo el 10 sep, verde el 10 sep.
- **Notas**:
  - **La decisión incómoda está señalada en `INT-006`**: publicar la tarifa. `INT-004` la
    había dejado como pregunta abierta 4 y fuera de su alcance, pero el §4 la pone en el
    centro del posicionamiento. Se publicó. Bajar un precio publicado es fácil; subirlo
    después de que lo hayan visto los planners, no.
  - **No se disfraza de violinista.** El informe dice que «viola» no es palabra de mercado
    y que el competidor de referencia, siendo violista, se vende como violín eléctrico. Los
    titulares llevan lo que la gente busca —música, ceremonia, boda, Granada— y la viola
    aparece como el instrumento que es. Mentir sobre el instrumento en una web que se va a
    sostener sobre reseñas es el mismo error que prometer el piano.
  - Sigue habiendo placeholders: dominio, NIF, dirección, WhatsApp, vídeos y fotos.

### 2026-09-10 — Foto, voz más humana y datos legales reales — DONE
- **Trabajo hecho**: `Hero.tsx` y el retrato de «Sobre mí» pasan a leer
  `site.media.heroPhoto` / `portraitPhoto` (con `next/image`, fallback al gradiente si
  están vacíos, partículas 3D apagadas solas cuando hay foto). Reescritura de voz a
  primera persona con el nombre de Manuel, explicando qué es una viola en cristiano
  (referencia: violatempestad.com, que resultó ser en tercera persona y formal — lo
  humano de ahí era la cara del músico y explicar el instrumento, no el tono). NIF, nombre
  completo, dirección postal y teléfono reales en `site.ts`.
- **Modelo usado / Skill cargada**: `opus` (cambio de modelo de sesión a `sonnet` llegó
  después, en el siguiente bloque). Skill: `ninguna` para la foto/voz (decisión de
  redacción, no de arquitectura).
- **Verificación (salida)**: 42 unitarios, lint limpio, build OK. Foto confirmada en el
  HTML generado (`/_next/image?url=%2Fmanuel-viola.jpg`). `node scripts/check-legal.mjs
  --strict` → **exit 0 por primera vez** en el proyecto.
- **Notas**:
  - Corregido un defecto propio de comprobación de dominios: el primer intento hacía
    `grep "Address:"` sobre la salida de `nslookup`, que siempre casa con la línea del
    propio servidor DNS — daba «ocupado» para todo. Repetido con RDAP siguiendo
    redirecciones (`curl -sL`), que sí distingue 200/404 de verdad.
  - Un e2e se commiteó en rojo por error de lectura: `home ES › responde y pinta el hero`
    exigía `/Piano/i` en el título, y `INT-006` había quitado el piano tres commits antes.
    Leí «5 passed» sin compararlo con los 6 de la corrida anterior. Arreglado atando el
    test a `site.ts` en vez de a una frase — un smoke que se rompe con cada mejora de copy
    es un smoke que acaba borrado.
  - Aviso dejado para Manuel: el teléfono (858) es un fijo de Granada; el botón de
    WhatsApp solo funciona si esa línea se da de alta en WhatsApp Business.

### 2026-09-10 — Accesibilidad del resto del sitio (INT-005, puntos 1-3) — DONE
- **Trabajo hecho**: arreglo del bug real de navegación —`bg-transparent` + `text-carbon`
  fijo, ≈1:1 medido por el crítico— sustituido por un panel propio siempre semiopaco
  (`bg-carbon/70` arriba, `bg-marfil/90` tras el scroll) con cuatro tonos de texto
  declarados como `const x = scrolled ? "..." : "..."`. `Sections.tsx` (`Events`):
  `carbon/60` → `/70`. `Footer.tsx`: separadores «·» a `aria-hidden`.
- **Modelo usado / Skill cargada**: `sonnet` (modelo de la sesión desde este bloque, el
  usuario lo cambió explícitamente con `/model sonnet`). Skill: `ninguna` — fix mecánico
  de contraste con fórmula ya establecida por `EV-012`, no una decisión de seguridad.
- **Verificación (salida)**: 44 unitarios (2 nuevos, `nav.test.tsx`), lint limpio.
- **Verificación (trayectoria) — la parte que importa aquí**:
  1. `EV-014` (navegación) se probó **en rojo contra el bug real**, no uno plantado: el
     `bg-transparent` original hizo fallar el eval con el motivo exacto antes de tocar
     nada.
  2. `EV-015` (barrido generalizado del resto de `src/components/`) tuvo **dos falsos
     positivos propios** en su primera pasada: el comentario que documentaba el arreglo
     citaba literalmente `text-marfil/20` y se detectaba a sí mismo; y el `aria-hidden` de
     las estrellas vive en el elemento padre, no en el mismo nodo que `text-carbon/20`, así
     que una comprobación «misma línea» no lo veía. Arreglado neutralizando comentarios sin
     mover posiciones de carácter, y reutilizando el rastreador de ancestros por pila que
     `EV-012` v3 ya había resuelto para el mismo problema.
  3. `EV-015` se probó después contra **las tres regresiones reales** plantadas a
     propósito (revertir `Sections.tsx` a `/60`, quitar los dos `aria-hidden` del footer):
     rojo con los tres nombrados, verde tras restaurar, `git status` limpio confirmado.
- **Eval**: `EV-014` y `EV-015`, ambos rojo→verde.
- **Notas**:
  - El cuarto punto de `intent-005` (contraste del hero sobre gradientes + canvas 3D, y
    ahora opcionalmente una foto) **queda sin resolver a propósito**. El propio crítico ya
    dijo que no se calcula con fiabilidad a mano, y forzar una estimación habría violado la
    restricción que el propio intent se puso: «medir, no estimar».
  - Este intent se ejecutó **sin un `APROBADO` explícito** de Manuel — dentro de un «sigue
    con lo que falta» general del modo de sesión. Queda escrito en `DEC-015` y en la propia
    tabla de aprobación de `intent-005.md`: se hizo porque los tres puntos son medibles sin
    ambigüedad de negocio (contraste WCAG), no porque el gate deje de aplicar.

### 2026-09-10 — Dominio y email reales — DONE
- **Trabajo hecho**: Manuel dio el dominio comprado (`violagranada.es` — coincide con la
  recomendación del 10 sep) y un email nuevo (`violagranada31@gmail.com`). Aplicados a
  `site.domain`, `site.email`, `site.legal.privacyEmail`.
- **Verificación (salida)**: build real → `sitemap.xml` con `violagranada.es/` y
  `violagranada.es/en`; JSON-LD con `url: "https://violagranada.es"` y el email nuevo.
  44 unitarios siguen en verde.
- **Notas**: `M2-IT-001` pasa a `BLOCKED (parcial)`: el dominio ya está, falta la cuenta de
  Cloudflare para la parte DNS.

### 2026-09-10 — M1-UJ-004: sincronización OAuth con Google — REVIEW
- **Trabajo hecho**: `src/lib/reviews/google.ts` (OAuth + paginación v4 + mapeo, exactamente
  según `design/api_contracts.md`) y `src/lib/reviews/sync.ts` (orquestación: valida el
  entorno antes de tocar la red, renueva el token una vez si la lectura devuelve 401,
  valida con Zod antes de devolver el resultado). `scripts/fetch-reviews.ts` es la única
  pieza que escribe `data/reviews.json`.
- **Modelo usado / Skill cargada**: `sonnet` (previsto `opus`; `DEC-017` explica por qué
  no hacía falta: el contrato entero ya estaba cerrado por `opus` desde el 3 de
  septiembre). Skill: `ninguna` cargada — `auth-implementation-patterns` seguía anotada
  pero es la misma parcial de siempre (playbook útil, recursos fantasma) y el contrato ya
  cubría el diseño de seguridad.
- **Ficheros creados**: `google.ts`, `sync.ts`, `scripts/fetch-reviews.ts`, `.env.example`,
  2 fixtures de la API v4, 2 suites de test (24 casos), `checks/reviews-cli-sin-env.mjs`.
- **Verificación (salida)**: 24 unitarios en verde; **el CLI real ejecutado como proceso
  hijo** sin credenciales → exit 1, `data/reviews.json` con el mismo hash SHA-256 antes y
  después, mensaje nombrando las 5 variables que faltan.
- **Verificación (trayectoria)**:
  - `google.ts`/`mapToSchema` rojo primero (`Failed to resolve import`).
  - `sync.ts` se escribió **antes** que su test — declarado así, sin maquillarlo: es
    orquestación fina sobre primitivas ya probadas en rojo, no lógica nueva.
  - Decisión de implementación no prevista en el diseño original: `scripts/fetch-reviews.mjs`
    pasó a `.ts` porque Node 20 no importa TypeScript de forma nativa, y duplicar el mapeo
    ya probado en JS plano habría arriesgado la misma clase de bug que el quinto falso
    verde (`EV-008` v1: lo probado y lo que corre de verdad, divergiendo). `tsx` entra como
    devDependency (`DEC-016`); cuatro documentos de diseño y `CLAUDE.md` actualizados el
    mismo día.
- **Eval**: `EV-005`, rojo→verde, con la mitad de red de seguridad (mock) y la mitad de
  proceso real (CLI sin credenciales).
- **Comprobación de seguridad**: `client_secret`/`refresh_token` nunca aparecen en un
  mensaje de error (tests explícitos); `EV-006` reejecutado tras añadir estos ficheros,
  sigue en 0 resultados; ni `google.ts` ni `sync.ts` los importa ningún componente.
- **Notas**: **queda un hueco declarado, no escondido**: «`--dry` no modifica el fichero
  en un éxito real» no se ha ejercitado de verdad — necesita credenciales de Google que
  no existen (B-01/B-02). El código lo garantiza por estructura (`return` antes de
  `writeFileSync`) y `runSync` lo prueba a nivel de resultado, pero no es lo mismo que
  verlo pasar de verdad. Marcado `[~]` en `user_journeys.md`, no `[x]`.

### 2026-09-10 — M1-UJ-005: Omnibus y RGPD en privacidad — REVIEW
- **Trabajo hecho**: apartado nuevo «Reseñas de Google» en `/privacidad` y `/en/privacy`:
  origen del dato, qué se publica (nombre y texto, nunca foto ni contacto), base legal
  —**interés legítimo, art. 6.1.f RGPD**, distinta y separada del consentimiento que
  ampara los datos del formulario de contacto, que antes compartían un único apartado
  «Legitimación»— y cómo pedir la retirada, con plazo de 30 días.
- **Modelo usado / Skill cargada**: `sonnet` (previsto `opus`, mismo motivo que `UJ-004`:
  la base legal ya estaba decidida en `design/architecture.md` desde el 3 de septiembre;
  aquí solo había que escribirla en las dos páginas). Skill: `gdpr-data-handling`, cargada.
- **Verificación (salida)**: 6 tests nuevos en verde; 68 unitarios en total.
- **Verificación (trayectoria)**: rojo primero (5/6 por ausencia del apartado). Tras
  escribir el contenido, **2 fallos que eran del test, no del contenido**: el título del
  apartado y una referencia cruzada deliberada en la sección de legitimación repiten a
  propósito «Reseñas de Google» / «interés legítimo», y `getByText` (que exige un único
  resultado) los contaba como error. Corregido a `getAllByText`.
- **Eval**: `EV-007`, rojo→verde.
- **Comprobación de seguridad**: solo se publican datos ya públicos en Google (nombre,
  texto); ni foto ni contacto del reseñador, en línea con `DEC-011`. Vía de ejercicio de
  derechos = `site.legal.privacyEmail`, ya real desde el commit de dominio/email.
- **Notas**: **la lista de exclusión automatizada no se construyó** (`DEC-018`). El
  criterio de aceptación era condicional («si se implementa…») y no hay ninguna solicitud
  real ni reseñas reales todavía. Se documentó el procedimiento manual en su lugar —
  construir la máquina para un caso hipotético es justo lo que este proyecto ha evitado
  hacer en cada decisión de alcance desde `intent-001`.
- **M1 completo**: los 5 UJs (`M1-UJ-001` a `005`) están en `REVIEW`. Falta `/review` de
  frontera de milestone sobre este bloque — no se ha lanzado en esta tanda.

### 2026-09-10 — M2-UJ-002: generador de QR — REVIEW (parcial)
- **Trabajo hecho**: `scripts/make-qr.ts` genera SVG (máster vectorial) + PNG (1800px) en
  `assets/qr/`, nunca en `public/`. Carbón sobre blanco (el dorado de la paleta no daría
  contraste suficiente, per `intent-002`), zona de silencio de 4 módulos, corrección M
  (sin monograma — Q-03 sigue sin resolver, se tomó el valor por defecto). `site.qr` en
  `site.ts` son solo metadatos (`label`, `filename`); las URLs no se duplican ahí.
- **Modelo usado / Skill cargada**: `sonnet`. Skill: `ninguna` — es un script utilitario
  sobre un contrato ya decidido en el propio intent.
- **Ficheros creados**: `scripts/make-qr.ts`, `implementation/evals/checks/qr-round-trip.mjs`.
  `qrcode`, `jsqr`, `pngjs` como devDependencies (esta última pareja solo para el eval).
- **Verificación (salida)**: `npm run qr` ejecutado de verdad → `assets/qr/web.svg` y
  `.png` generados; `resena-google.*` correctamente omitido con el motivo impreso.
- **Verificación (trayectoria) — dos pruebas en rojo, las dos contra el sistema real**:
  1. Con `site.domain` devuelto a mano al placeholder original (`https://tunombre.es`):
     `npx tsx scripts/make-qr.ts` → exit 1, **cero ficheros** generados. Restaurado,
     `git status` limpio salvo los cambios reales.
  2. `EV-016` decodifica el PNG generado con un lector de QR de software (`jsqr` +
     `pngjs`) y confirma que vuelve exactamente `site.domain` — un round-trip real, no
     una comparación de bytes contra un valor fijo.
- **Eval**: `EV-016`, rojo→verde.
- **Decisión de diseño no anticipada por el intent**: el destino "review" se lee de
  `data/reviews.json` → `profileUrl` en vez de guardarse por segunda vez en `site.ts`
  (`DEC-019`). Mismo principio que ya rige todo el proyecto —el fichero es la frontera—
  aplicado también aquí: el día que exista la ficha de Google, `npm run qr` genera el
  segundo código sin que nadie tenga que copiar una URL a mano a un sitio nuevo.
- **Notas — dos huecos declarados, no escondidos**:
  - **La prueba física real** —«un móvil escanea el PNG impreso a 2 cm de lado desde
    20 cm»— **no se puede hacer en esta máquina**: no hay impresora ni cámara. El
    round-trip de software es el proxy más cercano posible, y está dicho así en la propia
    ficha del eval: un módulo mal impreso o una tinta de bajo contraste real no los
    detecta un decodificador. Queda para Manuel con el SVG y una impresora de verdad.
  - **El mensaje de error si `qrcode` no está instalado no se ha visto fallar de verdad**:
    habría exigido desinstalar una dependencia real a mitad de sesión, con riesgo de dejar
    `node_modules` inconsistente para el resto del trabajo. El código lo contempla
    (`try/catch` en el `import`), pero eso no es lo mismo que haberlo visto romperse.
  - `intent-002` pasa a «aprobado parcialmente»: el QR de la web no dependía de ninguna
    decisión de negocio pendiente (el dominio ya estaba dado), así que se ejecutó dentro
    de «sigue con lo que falta» sin necesitar un `APROBADO` nuevo — mismo razonamiento que
    `intent-005` (`DEC-015`).
- **Cierre posterior, mismo bloque**: el hueco de «`qrcode` no instalado» se cerró de
  verdad — renombrar `node_modules/qrcode` (reversible, sin desinstalar nada) en vez de
  quitarlo con `npm uninstall`, confirmar el mensaje y el exit 1, y restaurar. Ya no queda
  declarado como no probado en `intent-002.md` ni en `EV-016`.
- **Hallazgo real de esta tanda, no un simulacro**: `scripts/make-qr.ts` rompió
  `npm run build` de verdad (`qrcode` sin tipos — Next tipa todo `.ts` del `tsconfig`, no
  solo lo que importa `app/`). Una comprobación manual anterior con
  `grep -E "Compiled|Error"` (E mayúscula) se había comido el `Type error` en minúscula y
  dado el build por bueno. Lo detectó `npm run evals` sin filtrar nada. Arreglado con
  `@types/qrcode`; nota operativa en `decision_log.md` sobre no fiarse de un grep sin
  pensar en mayúsculas/minúsculas al verificar manualmente.

### 2026-09-25 — M2-IT-010: Cloudflare Web Analytics completado (parcial)
- **Trabajo hecho**: Manuel pidió "añade las cookies también" sin más contexto — antes de
  construir nada se le preguntó directamente qué quería, porque las dos lecturas posibles
  (cookies de verdad vs. métricas) llevan a arquitecturas legales distintas. Eligió
  Cloudflare Web Analytics: métricas sin cookies, sin banner de consentimiento nuevo, todo
  ya vive en Cloudflare. `src/components/CloudflareAnalytics.tsx` renderiza el beacon solo
  si `site.analytics.cloudflareToken` tiene valor; CSP ampliada con los dos hosts reales
  que exige el beacon (verificados contra la documentación pública, no adivinados);
  `/cookies` y `/en/cookies` explican la herramienta y por qué no necesita consentimiento
  bajo el art. 22.2 LSSI-CE, condicionado también al token para no afirmar algo que no es
  cierto todavía.
- **Modelo usado / Skill cargada**: `claude` (Sonnet 5), sin skill cargada.
- **Ficheros creados / modificados**: `src/components/CloudflareAnalytics.tsx` (nuevo),
  `app/(es)/layout.tsx`, `app/(en)/layout.tsx`, `next.config.mjs`, `src/config/site.ts`,
  `app/(es)/cookies/page.tsx`, `app/(en)/en/cookies/page.tsx`,
  `implementation/task_tracker.md`, `docs/decision_log.md` (`DEC-022`).
- **Verificación (salida)**: `npm run build` limpio; `npx vitest run` → 80/80; `npm run
  evals` → 16/16, incluido `EV-011` (hosts concretos en CSP, nunca comodín) en verde con
  los dos hosts nuevos; `npm run lint` sin avisos.
- **Verificación (trayectoria)**: alcance ceñido a analítica + su documentación legal; no
  se tocó `site.cookies.analyticsEnabled` (sigue en `false` a propósito: ese flag es para
  analítica CON cookies, que esto no es).
- **Eval**: `EV-011` cubre la CSP. No hay eval dedicado a la propia integración porque no
  hay nada que verificar en build/test sin un token real — el `if (!token) return null`
  es la única rama con comportamiento, y ya la ejercitan `npm run build` y los tests
  existentes al renderizar los layouts sin token configurado.
- **Comprobación de seguridad**: CSP revisada a mano contra la documentación oficial de
  Cloudflare antes de escribir, no de memoria — un host equivocado aquí falla en silencio
  (la petición se bloquea, sin error visible para el visitante).
- **Tests**: ninguno nuevo — no hay comportamiento observable sin un token real que
  probar; los tests existentes ya cubren que los layouts siguen renderizando bien con el
  componente montado y el token vacío.
- **Notas**: **parcial** a propósito — falta que Manuel dé de alta el sitio en el
  dashboard de Cloudflare (Analytics → Web Analytics → Add a site) y pegue el token en
  `site.analytics.cloudflareToken`. Sin eso, cero cambio de comportamiento, por diseño.
  Rama `feat/cloudflare-web-analytics`, salida de `main` el mismo día que
  `feat/contenido-humano-sin-precios` — las dos añaden un `DEC-022`, colisión de
  numeración esperada y documentada en el propio `decision_log.md`.

---

## Review

### Pasada 7 — 11 sep 2026 · M1-UJ-004/005, dominio real, contenido, accesibilidad, QR

**REVISOR** (`sonnet`) — **3 intentos antes de completar.** 1º: muerte por límite de
sesión (llegó hasta lint/tests/build, sin dejar nada a medias). 2º: atasco de 600s en un
comando lento (probablemente Playwright), matado por el watchdog. Entre cada intento,
`git status --short` confirmado limpio antes de relanzar — la disciplina de las pasadas
2 y 3 de la review anterior, aplicada de nuevo. 3º intento, con instrucción explícita de
no bloquearse en comandos lentos: **completó — 80 llamadas, 17 min.**

Confirmó con comando real: lint limpio, 74/74 tests (antes de esta pasada), build leído
completo (sin el error de grep de la nota operativa anterior), 15/15 evals, `check-legal
--strict` en verde por primera vez, el CLI de reseñas sin credenciales, el QR con
round-trip. Hizo su propio experimento adversarial: plantó un filtro por rating en un
fichero **nuevo** no listado en ningún eval, confirmó que `EV-008` lo caza por
descubrimiento, revirtió. `npx playwright test` no lo pudo verificar — se atascó otra vez
y lo mató a los 95s, anotado como «no verificado» sin bloquear el resto.

**Hallazgo real, no en el radar de nadie**: `app/(es)/aviso-legal/page.tsx` y
`app/(en)/en/legal-notice/page.tsx` seguían con «piano y viola» / «piano and viola»
literal — fuera del alcance de `EV-013`, que solo miraba 5 ficheros fijos. `M2-IT-006` no
estaba cerrado de verdad.

**CRÍTICO** (`opus`) — completó a la primera, 42 llamadas, 11,5 min. Confirmó el
bloqueante del piano **contra el HTML publicado** (`grep -i "piano" .next/server/app/*.html`),
comprobó que no había un tercer fichero, y encontró **tres hallazgos propios**:

1. **`EV-013` es un falso verde por alcance enumerado** — mismo patrón que ya rompió
   `EV-008` v1. El proyecto ya conocía el arreglo (descubrimiento en vez de lista) y no se
   había aplicado aquí.
2. **Octavo falso verde, real**: plantó un componente que recibe las reseñas **por prop**,
   sin un solo `import` de `lib/reviews`, con `.filter(rating >= 4)` dentro. La condición
   de entrada de `EV-008` v2 (`TOCA_RESENAS`, exige esa referencia) lo dejó pasar — la
   suite entera siguió verde, **incluido el eval escrito específicamente para esto**.
3. **JSON-LD de `/en` publicaba la URL de la home ES**: `url: site.domain` no dependía de
   `locale`. Ningún test lo cubría — `EV-004` solo mira `aggregateRating`/`review`.
4. **El CTA principal del hero prometía la tarifa y no enlazaba a ella**: «Ver tarifa y
   reservar» iba a `#contacto`; `#tarifa` no tenía **ningún** enlace entrante en toda la
   página. Es una de las tres patas del posicionamiento (§4 del plan de negocio),
   inalcanzable salvo haciendo scroll a ciegas.

También marcó **INFUNDADO** el atasco de Playwright del revisor: con 600s de margen,
`npx playwright test` corrió limpio, 6/6 en 54,9s — artefacto del sandbox del revisor, no
del proyecto. Y matizó que la conclusión «`EV-008` funciona de verdad» del revisor era un
razonamiento débil: su experimento probaba que el descubrimiento funciona **dentro de su
condición de entrada**, no que no tuviera condición de entrada — que es justo lo que el
propio crítico tumbó un párrafo después.

**VEREDICTO del crítico**: arreglar primero, 4 bloqueantes.

**Arreglos, los 4 con rojo→verde probado contra el ataque exacto reportado**:

1. Contenido corregido en las dos páginas legales. `EV-013` reescrito (v2): sin lista
   fija, recorre `app/`+`src/` enteros (34 ficheros). Probado devolviendo la promesa a
   un fichero legal a propósito → rojo; restaurado → verde.
2. `EV-008` pierde `TOCA_RESENAS` (v3): sin condición de entrada, escanea `app/`+`src/`
   enteros, igual que `EV-013`/`EV-015`. Reproducido el plantado exacto del crítico →
   rojo; borrado → verde.
3. `HomePage.tsx`: `url` del JSON-LD depende de `locale`. Test nuevo
   `jsonld-locale.test.tsx`, rojo con `url` fijo → verde tras el arreglo, confirmado
   también contra el `.next/server/app/*.html` real.
4. `Hero.tsx` (CTA → `#tarifa`) y `Nav.tsx` (enlace nuevo, mismo orden que las secciones).
   Test nuevo `anclas-vivas.test.tsx`, generalizado a cualquier `<section id>` sin enlace
   entrante — no solo el caso de tarifa. Su primera versión contaba los `id` de los
   campos del formulario de contacto como huérfanos (falso positivo propio, corregido
   acotando a `<section id>`).

**Reverificación** (`sonnet`, paso 4 del protocolo) — completó en 1 intento, 49 llamadas,
11,5 min. Repitió los 4 experimentos con sus propias manos (nombres de fichero plantado
distintos a los del crítico, para no depender de que quedara algo suyo en el entorno) y
sostuvo los cuatro. Encontró **un hueco de cobertura real, no bloqueante**: el test 3 de
`anclas-vivas.test.tsx` comprobaba que *algún* `href="#tarifa"` existiera en la página, no
que viniera del propio botón del hero — con `Nav.tsx` ya proveyendo el enlace, un regreso
aislado del CTA del hero no se habría detectado. Corregido renderizando `Hero` en
aislamiento y comprobando su `href` directamente; probado revirtiendo solo el CTA del
hero (dejando `Nav.tsx` intacto) → antes de la corrección la suite se quedaba en verde,
después se pone roja. Confirmó además que el enlace del menú móvil también funciona
(mismo array `links`) y que la traducción inglesa de la nueva etiqueta de navegación es
coherente con el resto del diccionario EN.

**Estado final**: 80 unitarios · 6+1 e2e (confirmado por el crítico, no atascado) · 16
evals, 0 fallan. `git status` limpio confirmado por los tres subagentes, al empezar y al
terminar cada uno.

**Veredicto**: **avanzar.** `Review ✓` marcado en `M1-UJ-004`, `M1-UJ-005`, `M2-IT-006`,
`M2-IT-007` (los cuatro pasan a `DONE`) y `M2-UJ-002` (parcial — sigue sin la prueba
física en papel y sin el QR de reseñas, ambos fuera del alcance de lo que se podía
arreglar aquí).

### Pasada 1 — 5-6 sep 2026 · frontera M0 + M1-UJ-001/002/003

**REVISOR** (subagente, contexto limpio, `sonnet`) — **pasada inválida por error del
constructor.** Se lanzó con el tipo de agente `code-reviewer`, cuyo toolset es solo
Read/Grep/Glob: **sin shell**. No ejecutó ni uno de los siete comandos exigidos. Él mismo
lo declaró como bloqueante en su primera línea, que es lo correcto y lo que salva la
pasada: un revisor que hubiera firmado "todo correcto" desde análisis estático habría sido
mucho peor.

Aun sin ejecutar nada, encontró cuatro cosas ciertas:

1. **CRÍTICO — `M0-IT-008` con `Eval ✓` sin fichero de eval.** Cierto. Se marcó tras
   ejecutar los dos modos a mano y narrarlo aquí. Ejecutar algo una vez no es un eval.
2. **`EV-008` listado en el registro y sin fichero.** Cierto, y peor de lo que parecía: el
   runner recorría el directorio, así que **no podía echar en falta lo que no existe**. El
   principio 4 de la constitución (no filtrar por puntuación) llevaba días sin vigilancia.
3. `implementation/user_journeys.md` seguía describiendo un comportamiento condicional de
   los avatares que DEC-011 había eliminado. Criterio de aceptación obsoleto.
4. Ningún test fijaba que `avatarUrl` se ignora a propósito: nada impedía reintroducir la
   foto de Google sin abrir `remotePatterns` y CSP a la vez.

**CRÍTICO** (subagente distinto, `opus`) — **abortado**: límite de sesión del modelo
(HTTP 429). Alcanzó a ejecutar `npm run lint` (limpio) y `npx vitest run` (36/36) antes de
morir. **La auditoría de la review sigue pendiente**, y hasta que exista no hay veredicto
de avanzar: `Review ✓` sigue sin marcar en las cinco tareas afectadas.

**Arreglos aplicados por el constructor** (rojo primero en los dos casos):

- **`EV-010`** + `checks/check-legal-modos.mjs`: cinco casos sobre tres fixtures, y
  `scripts/check-legal.mjs` acepta ahora `--file` para poder ejercitarlo sin tocar la
  configuración real. **Nació en rojo sin necesidad de forzarlo**: el caso «todo relleno»
  falló porque la regla de `social` quitaba comentarios con `/\/\/.*$/gm` y eso se come el
  `//` de `https://`, dejando `"https:` y dando por vacía una red rellenada. Segunda vez
  que esa regla estaba mal, primera que algo automático se entera.
- **`EV-008`** + `checks/sin-filtro-por-rating.mjs`: probado en rojo metiendo
  `filter((r) => r.rating >= 4)` en `visibleReviews`; lo cazó nombrando fichero y
  expresión, y se revirtió con `git diff` limpio.
- **`run.mjs` ya no puede ignorar un eval ausente**: lee el registro del README. Si una
  fila dice PENDIENTE y no hay fichero → `FALTA`, visible y sin tumbar la suite (su UJ no
  existe todavía). Si dice PASA y no hay fichero → `FALLA` duro. Probado en las dos
  direcciones renombrando `EV-010.eval.md`: exit 1, y restaurado.
- `user_journeys.md` actualizado a DEC-011, y test nuevo que falla si aparece un `<img>` o
  la cadena `googleusercontent` en la sección.

**Estado tras los arreglos**: 37 unitarios, 7 evals PASA + 2 FALTA declarados, lint limpio.

**Veredicto**: **arreglar primero — hecho, pendiente de re-revisión.** No hay veredicto de
avanzar porque falta la pasada del crítico. `Review ✓` no se marca en ninguna tarea.
Bloqueantes vivos: (a) crítico sin ejecutar, `opus` limitado hasta las 16:30; (b) el CI
sigue sin haberse ejecutado nunca (B-03).

### Pasada 2 — 6-7 sep 2026 · re-revisión sobre los arreglos

**REVISOR** (subagente **con shell** esta vez, `sonnet`) — **abortado por límite de sesión
del modelo** (HTTP 429, se restablece a las 22:40). Murió a mitad de un experimento y
**dejó el árbol sucio**: había reintroducido a propósito el regex defectuoso
(`replace(/\/\/.*$/gm, "")`) en `scripts/check-legal.mjs` para comprobar si `EV-010` cazaba
la regresión, y no llegó a revertirlo.

El constructor terminó el experimento que dejó planteado y revirtió:

```
EV-010 con la regresión plantada  → FALLA "todo relleno", 1 de 5 casos, EXIT=1
git checkout -- scripts/check-legal.mjs  → git status limpio
EV-010 tras revertir               → 5 casos correctos, EXIT=0
```

**Respuesta a la pregunta que estaba haciendo: sí, `EV-010` tiene dientes.** Detecta la
vuelta atrás del defecto exacto que lo originó. Que la evidencia la complete el constructor
es menos limpio que si la hubiera cerrado el revisor, y por eso queda escrito aquí quién
hizo qué: el experimento lo diseñó el revisor, la ejecución final y la reversión son mías.

**Lección operativa, no del código**: un subagente que muere a media faena puede dejar
regresiones deliberadas en el árbol. Tras cualquier revisión abortada, lo primero es
`git status` y `git diff`, antes de dar por bueno nada de lo que hay en disco.

**Estado**: sin cambios respecto a la pasada 1. Sigue sin haber veredicto de avanzar.

### Pasada 3 — 7-9 sep 2026 · CRÍTICO (`opus`)

**Abortado por límite semanal del modelo** (HTTP 429, se restablecía el 9 sep a las 16:00).
Tercer subagente que muere por cuota en esta review. Y aun así **es el que ha encontrado el
hallazgo más grave del proyecto**, justo antes de caer.

Dejó, otra vez, una regresión plantada en el árbol — `git status` mostraba
`M src/components/HomePage.tsx` — y una frase: *«EV-008 is blind to HomePage.tsx.
Confirming the whole suite stays green with an illegal filter live.»*

El constructor terminó el experimento:

```
Con `cargado.reviews.filter((r) => r.rating >= 4)` vivo en HomePage.tsx:
  npm run lint   → 0 avisos
  npx vitest run → 37/37 pasan
  npm run evals  → 7 pasan · 0 fallan   ← EV-008 entre ellos
```

**SOSTENIDO, y es el quinto falso verde del proyecto.** El anterior récord eran
comprobaciones mías mirando el sitio equivocado; este es peor: **el eval escrito
específicamente para vigilar el principio 4 de la constitución no vigilaba el fichero
donde más fácil es romperlo.** `HomePage.tsx` es quien llama a `loadReviews()` y reparte el
resultado a la sección y al JSON-LD — el sitio natural para colar un filtro— y la v1 de
`EV-008` llevaba la ruta de render enumerada a mano sin incluirlo.

**Arreglo (rojo primero, con la regresión del propio crítico):** `EV-008` v2 **descubre** la
ruta de render en vez de enumerarla. Recorre `src/` y `app/` y vigila todo fichero que
mencione `lib/reviews`, `loadReviews`, `visibleReviews` o `buildRatingJsonLd`, más un núcleo
fijo. Pasa de 3 ficheros a 4, `HomePage.tsx` incluido sin nombrarlo, y un consumidor nuevo
entra solo. Verificado: rojo con la regresión, verde tras revertir, y la salida enumera qué
está vigilando para que un encogimiento de la lista se vea.

**Lección, y es la más cara de las cinco:** un eval que **enumera** lo que vigila solo
protege de lo que ya se te había ocurrido. Si puede descubrir su propio alcance, que lo
descubra.

**Veredicto**: **arreglar primero.** Bloqueantes vivos:
1. **La auditoría del crítico sigue sin completarse.** Tres intentos, tres muertes por
   cuota. Lo que hay verificado de las pasadas 2 y 3 lo completó el constructor, que es
   precisamente lo que el papel del crítico existe para no permitir.
2. El CI nunca se ha ejecutado (B-03).
3. Cuatro áreas quedan sin auditar por nadie: la trayectoria de los commits contra el plan,
   los posibles falsos verdes de `EV-001`, `EV-004` y `EV-006`, la accesibilidad de la
   sección, y la coherencia CSP / `remotePatterns`.

`Review ✓` sigue sin marcar en ninguna tarea, y así se queda.

### Pasada 4 — 9 sep 2026 · CRÍTICO (`opus`) — abortado antes de empezar

Límite de sesión otra vez, esta vez antes de ejecutar nada: su última línea fue *«Now let me
start executing»*. `git status` limpio, no dejó nada plantado — comprobado, que es la
lección de las pasadas 2 y 3.

**Cuatro intentos, cuatro muertes por cuota.** Se toma DEC-013: el crítico baja a `sonnet`,
con encargo más estrecho para compensar. Es una desviación del método, con fecha y con
vuelta atrás escrita, no un cambio de las reglas.

### Pasada 5 — 9 sep 2026 · CRÍTICO (`sonnet`, DEC-013) — **COMPLETADA**

105 llamadas a herramientas, 22 minutos. Rompió a propósito los siete objetos que se le
pidieron, revirtió cada uno y terminó con `git status` limpio, confirmado explícitamente.

**Lo que sostuvo (todo con comando y salida):**

- `EV-001`, `EV-004` y `EV-006` **tienen dientes**. Los rompió uno a uno —`if (false)` en
  el retorno temprano de `Reviews`, lo mismo en `jsonld.ts`, y un fichero con
  `client_secret` plantado en `.next/static/`— y los tres se pusieron rojos.
- `EV-008` v2 **descubre de verdad, no enumera**: plantó el filtro en un fichero **nuevo**
  (`src/lib/reviews/__critic_test__/side-consumer.ts`), ni siquiera en el `HomePage.tsx`
  que ya era el caso conocido, y lo cazó igual.
- `EV-010`, el runner que ya no ignora un eval fantasma, y el test de `avatarUrl`:
  los tres rotos a propósito, los tres rojos.
- Trayectoria de los commits limpia: `git show --stat` de los cinco últimos, sin ficheros
  ni dependencias que nadie pidiera. `zod` en `devDependencies` es deliberado y está en la
  constitución.
- Un detalle metodológico **suyo**, que vale más que el hallazgo: su primera comprobación
  del exit code usaba `| tail`, así que el `$?` era el de `tail` y no el de `npm run evals`.
  Lo detectó y lo repitió sin pipe. Eso es un crítico haciendo su trabajo consigo mismo.

**Dos hallazgos nuevos, los dos ciertos y los dos arreglados (rojo primero):**

1. **Comodín en la CSP.** `img-src 'self' https: data:` aceptaba **cualquier** host HTTPS,
   contra el principio de «hosts concretos, nunca comodín» de la propia constitución.
   `remotePatterns` sí lo respetaba; la CSP no, y llevaba así desde el primer día. Nadie lo
   había mirado en cinco pasadas de revisión porque la constitución nombraba
   `remotePatterns` explícitamente y la CSP solo de pasada — **lo que se nombra se revisa;
   lo que se da por supuesto, no.** Arreglado a los dos hosts de YouTube, verificado con
   `curl -sI` contra el servidor de producción, y protegido por `EV-011`.
2. **Contraste 4.42:1 en el aviso legal.** `text-carbon/60` sobre marfil, por debajo del
   4.5:1 de AA. Usado **exactamente una vez** en todo el componente: en
   `dict.reviews.disclosure`, el aviso que obliga el RDL 24/2021, a 14 px. De toda la
   sección, el único texto que no se leía bien era el que la ley obliga a mostrar. Es un
   fallo que ninguna revisión a ojo encuentra: 4.42 y 4.5 son indistinguibles mirando.
   Arreglado a `text-carbon/70` (6.14:1) y protegido por `EV-012`, que calcula la
   luminancia relativa con composición alfa en vez de estimarla.

**Menor, también cierto**: la cabecera de `task_tracker.md` seguía diciendo
`Milestone actual: M0` con el cuerpo ya en M1. Corregido.

**Estado tras los arreglos**: 37 unitarios · 6+1 e2e · **9 evals PASA**, 0 fallan, 2 `FALTA`
declarados (`EV-005` y `EV-007`, de UJs sin construir) · lint limpio · CSP verificada en la
cabecera servida.

**Veredicto de la pasada 5**: los dos bloqueantes están arreglados y cada uno dejó su eval.
Pendiente la confirmación de que los arreglos son reales — pasada 6.

### Pasada 6 — 10 sep 2026 · confirmación (`sonnet`) — **COMPLETADA**

111 llamadas, 29 minutos, `git status` limpio al empezar y al terminar.

**Confirmó los dos arreglos, y no de palabra:** levantó el servidor de producción y comprobó
la cabecera con `curl -sI` (no el fichero de configuración); revirtió cada arreglo para ver
el eval en rojo; **reprodujo a mano la fórmula WCAG** —luminancia relativa sRGB con
composición alfa— y obtuvo 6,136:1 y 4,420:1, que coinciden con lo que imprime `EV-012`;
y recorrió las seis rutas con Chromium capturando `console` y `requestfailed` para
descartar que la CSP acotada bloqueara algo en silencio. Cero incidencias.

**Tres hallazgos nuevos, los tres ciertos:**

1. **`a11y-exento` era una puerta trasera real.** La exención operaba sobre el **bloque de
   función entero**: bastaba un `<span aria-hidden>` decorativo con ese comentario en
   cualquier punto de `Reviews` para que el eval diera por exento el párrafo del aviso
   legal a 4,42:1. Lo demostró plantándolo. **Arreglado**: la v3 mantiene una pila de
   elementos abiertos y pregunta si **ese nodo** o alguno de sus ancestros está oculto.
   Verificado reproduciendo su ataque exacto: ahora falla. Las exenciones legítimas —las
   estrellas a 1,51:1 y 2,11:1 bajo `aria-hidden` con `sr-only`— siguen exentas.
2. **La navegación es ilegible en el estado inicial.** Header fijo con `bg-transparent`
   sobre el gradiente oscuro del hero: logo a **≈1,00:1**, enlaces entre 1,1 y 1,3:1,
   medido con captura real y muestreo de píxel. Es lo primero que ve el 100% de las
   visitas, en los dos idiomas, y no lo cubría ningún eval. **Fuera del alcance de M1**:
   es código preexistente. Recogido en `planning/intent-005.md`.
3. **`Sections.tsx` (`Events`) usa `text-carbon/60`** — el mismo 4,42:1 que se acaba de
   corregir. Latente: hoy no se ve porque la agenda está vacía. También a `INT-005`, junto
   con los separadores `text-marfil/20` del footer.

**Y un cuarto fallo, encontrado por el propio runner durante los arreglos:** al reescribir
`EV-012.eval.md` con otro final de línea, el eval pasó a `PENDIENTE`. Causa:
`extractCommand` esperaba `
` pegado al fence ```` ```bash ````, y con CRLF en medio no
encontraba el comando. **En un clon fresco de Windows, git convierte todos los ficheros a
CRLF: la suite entera habría salido «pendiente» en silencio — cero fallos y cero
ejecuciones, el peor resultado posible.** Arreglado normalizando en el runner y verificado
convirtiendo los nueve `.eval.md` a CRLF: 9 pasan igual.

**Lo que declaró NO MIRADO, honestamente**: que el aviso legal aparezca en el HTML generado
de las dos raíces no pudo confirmarlo end-to-end, porque `data/reviews.json` está vacío y el
clasificador de permisos le bloqueó sembrar datos. Lo cubren los tests con jsdom, no un
build real. Es justo lo que `EV-007` (pendiente, `M1-UJ-005`) todavía no cubre. Y el
contraste del hero sobre gradientes apilados más el canvas 3D quedó sin medir.

**Veredicto de la review, tras seis pasadas**: **avanzar en M1.** Los tres UJs y los ITs de
M0 quedan auditados con evidencia ejecutada por un revisor y un crítico distintos del
constructor. Lo que queda abierto no es de M1:

- `INT-005` (accesibilidad del resto del sitio) **bloquea la publicación**, no M1.
- B-03: el CI nunca se ha ejecutado. `M0-IT-005` conserva su `Review ✓` sin marcar.
- `EV-005` y `EV-007` siguen en `FALTA`, ligados a `M1-UJ-004` y `M1-UJ-005`, sin construir.

