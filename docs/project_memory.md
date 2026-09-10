# Project Memory — web-musica
Última actualización: 2026-09-10 (tarde)

## Fase actual
**M0 y M1 completos.** Los 5 UJs de M1 están en `REVIEW`, pendientes de `/review` de
frontera de milestone (no lanzado en esta tanda). Modelo de la sesión: **`sonnet`**.
Además del ciclo M1, se cerró contenido de negocio (`INT-006`), accesibilidad del resto
del sitio (`INT-005`, puntos 1-3), datos legales reales, y dominio/email reales.

## Versión del harness
2026.09-1 (ver `~/.claude/docs/harness.md`)

## Rama
`feat/factoria-reviews`. `main` tiene solo el commit base del sitio importado. Árbol
limpio tras cada commit — verificar con `git status --short` antes de dar nada por bueno.

## Último completado
- **M0 entero** salvo `M0-IT-002` (`SKIP` temporal, DEC-012).
- **M1-UJ-001 a 005, los cinco en `REVIEW`.** Reseñas ES/EN + JSON-LD (`UJ-001/002/003`,
  auditadas por 6 pasadas de `/review`); fetcher OAuth de Google (`UJ-004`, `google.ts` +
  `sync.ts` + CLI real, `tsx` como devDependency nueva — `DEC-016`); Omnibus/RGPD en las
  dos privacidades (`UJ-005`, base legal de interés legítimo separada de la del
  formulario).
- **`M2-IT-002`**: datos legales reales. **Dominio y email reales**: `violagranada.es`,
  `violagranada31@gmail.com` — coincide con mi recomendación del 10 sep.
- **`M2-IT-006`** (`INT-006`): contenido según el plan de negocio, sin piano.
- **`M2-IT-007`** (`INT-005`, puntos 1-3): navegación legible, sin comodines en la CSP.
- **74 unitarios · 6+1 e2e · 14 evals** (`EV-001` a `EV-015`, salvo `EV-002` absorbido),
  la suite completa en verde en la última pasada.

## Siguiente paso
`/review` de frontera de M1 completo (revisor + crítico, subagentes distintos — no
lanzado todavía en esta tanda). Después, M2: `M2-IT-003` (Cloudflare Pages, necesita
cuenta), `M2-IT-004` (HTTPS + cabeceras en producción), `M2-IT-005` (Deploy Hook + Cron),
`M2-UJ-001`/`002` (smoke en producción, QR). El generador de QR (`intent-002`) ya no está
bloqueado por falta de dominio — sí sigue bloqueado el QR de reseñas de Google (B-01/B-02).

## Bloqueadores
- **B-01 / B-02**: sin ficha de Google Business ni cuota de API. No bloquean código.
- **B-03**: `gh` instalado, sin autenticar. `M0-IT-002` en `SKIP`.
- **B-04**: QR de la web YA NO bloqueado (hay dominio); QR de reseñas sigue esperando.
- **B-05 / B-06**: resueltos.
- **Nuevo, sin registrar como B-0X formal**: `M2-IT-003/004/005` necesitan una cuenta de
  Cloudflare que nadie ha dado todavía.

## Contexto clave para retomar en frío

Web de un músico —**violista, ya no pianista**— para bodas y eventos en Granada,
Next.js 15, dos raíces de idioma. Dominio real: `violagranada.es`. FactorIA + sección de
reseñas alimentada por `data/reviews.json`, con un fetcher OAuth ya construido y probado
(con fixtures — sin ficha de Google real todavía).

**El 9-10 sep 2026 cambió el negocio, no solo el código**: un comité `c-suite-*` decidió
**viola sola en ceremonia, viola con base propia en cóctel** — nada de piano. `INT-006`
reescribió toda la web para reflejarlo, con tarifa publicada.

Lo que no hay que olvidar:
- **El fichero es la frontera.** La web no llama a Google en runtime, nunca — ni siquiera
  ahora que existe el fetcher: solo lo ejecuta Manuel a mano, o algún día un cron.
- **No se filtran reseñas por estrellas** — Directiva Omnibus, RDL 24/2021. `EV-008`
  descubre la ruta de render en vez de enumerarla (v2, tras el quinto falso verde).
- **La tarifa está publicada.** Decisión difícil de deshacer; `EV-013` vigila que no
  reaparezca ninguna promesa de piano.
- **Seis falsos verdes documentados**, todos en aserciones negativas. **Toda aserción
  negativa se prueba en rojo antes de creérsela** — mejor contra el bug real que contra
  uno plantado, como hicieron `EV-014` (contra el bug real de nav) y `EV-005`/`EV-007`
  (dos veces cada uno se cazó a sí mismo con falsos positivos y se corrigió).
- **Un subagente que muere a mitad de `/review` puede dejar una regresión plantada.**
  Pasó dos veces. Tras cualquier revisión abortada: `git status` y `git diff` primero.
- **DEC-013/017**: el modelo baja de `opus` a `sonnet` dos veces en este proyecto, las dos
  veces documentado y con razón distinta (cuota de crítico vs. implementar un contrato ya
  cerrado). No es la norma, es la excepción con fecha.
- **DEC-016**: `scripts/fetch-reviews.ts`, no `.mjs` como decían los documentos
  originales — Node 20 no importa TypeScript nativo. `tsx` como devDependency.
- Skills: `github-actions-templates` rota; `evaluation` va de agentes, no encaja aquí;
  `e2e-testing` es un router sin contenido; `deployment-procedures` es doctrina, útil en
  M2; `auth-implementation-patterns` parcial (5 recursos fantasma, playbook sí sirve).
