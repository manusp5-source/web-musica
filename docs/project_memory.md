# Project Memory — web-musica
Última actualización: 2026-09-10 (noche)

## Fase actual
**M0 y M1 completos.** M2 en marcha: dominio, email, datos legales, contenido de negocio,
accesibilidad del resto del sitio y el generador de QR de la web, todos resueltos. Falta
`/review` de frontera sobre M1 (no lanzado en esta tanda) y todo lo que exige una cuenta
de Cloudflare. Modelo de la sesión: **`sonnet`**.

## Versión del harness
2026.09-1 (ver `~/.claude/docs/harness.md`)

## Rama
`feat/factoria-reviews`. `main` solo tiene el commit base del sitio importado. Árbol
limpio tras cada commit — `git status --short` antes de dar nada por bueno.

## Último completado
- **M0 entero** salvo `M0-IT-002` (`SKIP` temporal, DEC-012).
- **M1 entero**: los 5 UJs en `REVIEW`. Reseñas ES/EN + JSON-LD, fetcher OAuth de Google
  (con `tsx` como devDependency nueva, `DEC-016`), Omnibus/RGPD en las dos privacidades.
- **Dominio y email reales**: `violagranada.es`, `violagranada31@gmail.com`.
- **`M2-IT-006`** (`INT-006`): contenido según el plan de negocio, sin piano, tarifa
  publicada.
- **`M2-IT-007`** (`INT-005`, puntos 1-3): navegación legible, CSP sin comodines.
- **`M2-UJ-002` parcial** (`intent-002`): QR de la web generado y con round-trip de
  software verificado (`EV-016`). Falta la prueba física en papel — sin impresora ni
  cámara en esta máquina. QR de reseñas sigue bloqueado (B-01/B-02), pero el generador ya
  sabe leerlo de `data/reviews.json` en cuanto exista, sin tocar configuración (`DEC-019`).
- **80 unitarios · 6+1 e2e · 15 evals**, todos verificados en verde en esta tanda.

## Siguiente paso
1. `/review` de frontera de M1 (revisor + crítico, subagentes distintos) — no lanzado.
2. Cuenta de Cloudflare, que nadie ha dado todavía: desbloquea `M2-IT-003/004/005`.
3. Manuel: imprimir `assets/qr/web.svg` y hacer la prueba de escaneo física real.
4. Cuando exista la ficha de Google (B-01/B-02): `npm run reviews:fetch` y después
   `npm run qr` generan solos el segundo código, sin tocar nada más.

## Bloqueadores
- **B-01 / B-02**: sin ficha de Google Business ni cuota de API. No bloquean código.
- **B-03**: `gh` instalado, sin autenticar. `M0-IT-002` en `SKIP`.
- **B-04**: QR de la web YA NO bloqueado. QR de reseñas sigue esperando.
- **B-05 / B-06**: resueltos.
- **Sin registrar como B-0X formal**: `M2-IT-003/004/005` necesitan una cuenta de
  Cloudflare que nadie ha dado todavía.

## Contexto clave para retomar en frío

Web de un músico —**violista, ya no pianista**— para bodas y eventos en Granada,
Next.js 15, dos raíces de idioma. Dominio real: `violagranada.es`. FactorIA + sección de
reseñas alimentada por `data/reviews.json`, con un fetcher OAuth ya construido y probado
(con fixtures — sin ficha de Google real todavía), y un generador de QR que ya sabe leer
esa misma frontera cuando llegue el momento.

**El 9-10 sep 2026 cambió el negocio, no solo el código**: un comité `c-suite-*` decidió
**viola sola en ceremonia, viola con base propia en cóctel** — nada de piano. `INT-006`
reescribió toda la web para reflejarlo, con tarifa publicada.

Lo que no hay que olvidar:
- **El fichero es la frontera**, y ahora aplica dos veces: `data/reviews.json` para las
  reseñas, y también como fuente del destino del QR de reseñas (`DEC-019`) — nunca una
  URL duplicada en `site.ts`.
- **No se filtran reseñas por estrellas** — Directiva Omnibus, RDL 24/2021. `EV-008`
  descubre la ruta de render en vez de enumerarla (v2, tras el quinto falso verde).
- **La tarifa está publicada.** `EV-013` vigila que no reaparezca ninguna promesa de piano.
- **Seis falsos verdes documentados**, todos en aserciones negativas. **Toda aserción
  negativa se prueba en rojo antes de creérsela** — contra el bug real cuando se puede
  (`EV-014` contra el nav real; el QR contra el placeholder real de `site.domain`), y dos
  evals (`EV-005`, `EV-007`) se cazaron a sí mismos con falsos positivos y se corrigieron.
- **Un subagente que muere a mitad de `/review` puede dejar una regresión plantada.**
  Pasó dos veces. Tras cualquier revisión abortada: `git status` y `git diff` primero.
- **DEC-013/017**: el modelo baja de `opus` a `sonnet`, documentado las dos veces, con
  razón distinta cada vez. No es la norma, es la excepción con fecha.
- **DEC-016**: `scripts/fetch-reviews.ts` y `scripts/make-qr.ts`, no `.mjs` — Node 20 no
  importa TypeScript nativo. `tsx` como devDependency, aplicado dos veces con el mismo
  razonamiento.
- **Límites físicos declarados, no escondidos**: la prueba de escaneo del QR en papel real
  y el mensaje de error sin `qrcode` instalado no se pudieron verificar en esta máquina
  (sin impresora, sin cámara, riesgo de romper `node_modules` a mitad de sesión). Escrito
  así en `EV-016` y en `intent-002.md`, no maquillado como hecho.
- Skills: `github-actions-templates` rota; `evaluation` va de agentes, no encaja aquí;
  `e2e-testing` es un router sin contenido; `deployment-procedures` es doctrina, útil en
  M2; `auth-implementation-patterns` parcial (5 recursos fantasma, playbook sí sirve).
