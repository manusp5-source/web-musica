# Project Memory — web-musica
Última actualización: 2026-09-10

## Fase actual
`/review` completada (6 pasadas) con veredicto de avanzar en M1-UJ-001/002/003. Además,
fuera del ciclo de review: contenido reescrito según el plan de negocio (`INT-006`), foto y
voz humana puestas, datos legales reales aplicados, y accesibilidad del resto del sitio
arreglada (`INT-005`, puntos 1-3). Modelo de la sesión: **`sonnet`** desde el bloque de
accesibilidad (el usuario lo cambió con `/model sonnet`; antes era `opus`).

## Versión del harness
2026.09-1 (ver `~/.claude/docs/harness.md`)

## Rama
`feat/factoria-reviews`. `main` tiene solo el commit base del sitio importado. Árbol
limpio tras cada commit — verificar con `git status --short` antes de dar nada por bueno,
sobre todo tras una revisión que muriera a mitad (ha pasado tres veces con subagentes).

## Último completado
- **M0 entero** salvo `M0-IT-002` (`SKIP` temporal, DEC-012) — repo remoto pendiente de
  `gh auth login`.
- **M1-UJ-001/002/003**: reseñas desde `data/reviews.json`, ES/EN, JSON-LD coherente.
  Auditadas por `/review` (6 pasadas, ver abajo). Faltan `M1-UJ-004` (fetcher OAuth) y
  `M1-UJ-005` (Omnibus/RGPD en privacidad).
- **`M2-IT-002`**: datos legales reales aplicados. `check-legal --strict` → exit 0 por
  primera vez.
- **`M2-IT-006`** (`INT-006`): contenido según el §4 del plan de negocio — sin promesas de
  piano en vivo, tarifa publicada, Granada en vez de Madrid, foto en el hero, voz en
  primera persona.
- **`M2-IT-007`** (`INT-005`, puntos 1-3): navegación legible en cualquier estado, sin
  `bg-transparent`; `carbon/60` latente arreglado en `Sections.tsx`; separadores del
  footer a `aria-hidden`.
- **44 unitarios · 6+1 e2e · 15 evals** (`EV-001` a `EV-015`, salvo `EV-002` absorbido),
  **13 pasan · 0 fallan · 2 pendientes** (`EV-005`/`EV-007`, ligados a UJs sin construir).

## Siguiente paso
`M1-UJ-004` (fetcher OAuth con fixtures, modelo previsto `opus` — pendiente de decidir si
se baja a `sonnet` como el resto de la sesión) y `M1-UJ-005` (Omnibus/RGPD en privacidad,
`EV-007`). Ninguno depende de Manuel.

Después, todo lo que sí depende de Manuel: dominio (`M2-IT-001`), `gh auth login`
(`M0-IT-002`/B-03), WhatsApp Business en el 858, y el punto 4 de `intent-005` (contraste
del hero, declarado como hueco, no calculable a mano con fiabilidad).

## Bloqueadores
- **B-01 / B-02**: no hay ficha de Google Business ni cuota de la API. No bloquean código.
- **B-03**: `gh` instalado pero sin autenticar. Mantiene `M0-IT-002` en `SKIP`.
- **B-04**: QR — espera dominio.
- **B-05**: solo falta el dominio (nombre, NIF, dirección y teléfono ya resueltos el 10 sep).
- **B-06**: resuelto el 10 sep (`M2-IT-007`).

## Contexto clave para retomar en frío

Web de un músico (piano y viola → **ahora solo viola**, ver abajo) para bodas y eventos en
Granada, Next.js 15, dos raíces de idioma, **sin publicar**. FactorIA + sección de reseñas
alimentada por `data/reviews.json`, que un CLI regenerará desde Google Business Profile.

**El 9-10 sep 2026 cambió el negocio, no solo el código**: un comité `c-suite-*` (CEO,
COO, CMO, CFO, CHRO, CDO, construidos sobre el MBA de EAE) produjo un plan de negocio
(`docs/plan-negocio-viola.md`) que decidió **viola sola en ceremonia, viola con base
propia en cóctel** — nada de piano en vivo. `INT-006` reescribió toda la web para
reflejarlo: 14 promesas de piano fuera, tarifa publicada, Granada como ciudad real.

Lo que no hay que olvidar:
- **El fichero es la frontera.** La web no llama a Google en runtime, nunca.
- **No se filtran reseñas por estrellas** — Directiva Omnibus, RDL 24/2021.
- **La tarifa está publicada** (`Pricing` en `Sections.tsx`). Es la decisión más difícil de
  deshacer de todo el proyecto: bajar un precio publicado es fácil, subirlo después de que
  lo hayan visto los planners, no. `EV-013` vigila que no reaparezca una promesa de piano.
- **Seis falsos verdes documentados**, todos en aserciones negativas (comprobar que algo NO
  aparece): el canvas del hero 3D en headless, un `grep` sobre chunks JS con el diccionario
  serializado, un regex de comentarios que se comía las barras de `https://`, un eval de
  contraste con exención por función entera (puerta trasera real, encontrada por el
  crítico), un filtro de rating colado en un fichero fuera de la lista enumerada del eval, y
  la navegación con texto fijo sobre fondo transparente. **Toda aserción negativa se prueba
  en rojo antes de creérsela — mejor contra el bug real que contra uno plantado.**
- **Un subagente que muere a mitad de `/review` puede dejar una regresión plantada en el
  árbol.** Pasó dos veces. Tras cualquier revisión abortada: `git status` y `git diff`
  antes de construir sobre lo que hay.
- **DEC-013**: el crítico de `/review` bajó a `sonnet` tras cuatro muertes por cuota de
  `opus`. Excepción con fecha, vuelve a `opus` en la siguiente frontera de milestone.
- Skills: `github-actions-templates` rota; `evaluation` va de agentes y no encaja aquí;
  `e2e-testing` es un router sin contenido; `deployment-procedures` es doctrina, útil en M2;
  `auth-implementation-patterns` parcial (5 recursos fantasma, playbook sí sirve).
