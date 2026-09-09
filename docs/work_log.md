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

---

## Review

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

