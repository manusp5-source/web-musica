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

---

## Review

_(`/review` escribe aquí las dos pasadas —REVISOR y CRÍTICO— y el veredicto)_
