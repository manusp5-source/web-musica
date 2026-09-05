# Project Memory — web-musica
Última actualización: 2026-09-04

## Fase actual
Ejecución de M0 terminada salvo un bloqueo. **Frontera de milestone**: toca `/review`
antes de empezar los UJs de M1.

## Versión del harness
2026.09-1 (ver `~/.claude/docs/harness.md`)

## Rama
`feat/factoria-reviews`, 6 commits. `main` tiene solo el commit base del sitio importado.
Árbol limpio.

## Último completado
**M0 entero** salvo `M0-IT-002`, apartado a `SKIP` temporal (DEC-012).
**M1-UJ-001, UJ-002 y UJ-003 en `REVIEW`**: la sección de reseñas existe, lee
`data/reviews.json`, funciona en los dos idiomas y publica `aggregateRating` coherente.
36 tests unitarios, 6+1 e2e, 5 evals, lint limpio, build 13/13.

## Siguiente paso
`/review` — está pendiente desde la frontera de M0 y ahora hay tres UJs esperándolo.
Después, `M1-UJ-004` (el fetcher OAuth, modelo `opus`) y `M1-UJ-005` (Omnibus y RGPD).

## Bloqueadores
- **B-01 / B-02**: no hay ficha de Google Business ni cuota de la API. No bloquean código.
- **B-03**: `gh` instalado pero sin autenticar. `gh auth login` lo hace Manuel. **Mantiene
  `M0-IT-002` en BLOCKED, y la regla dice que ningún UJ empieza con un IT abierto de su
  milestone o anterior.** O se autentica, o `M0-IT-002` pasa a `SKIP` conscientemente.
- **B-04 / B-05**: el QR y la publicación esperan dominio y datos legales reales.

## Contexto clave para retomar en frío

Web de un músico (piano y viola) para bodas y eventos en España, Next.js 15, dos raíces de
idioma, **sin publicar y con placeholders**. En marcha: método FactorIA + sección de reseñas
alimentada por `data/reviews.json`, que un CLI regenerará desde Google Business Profile.

Lo que no hay que olvidar:
- **El fichero es la frontera.** La web no llama a Google en runtime, nunca.
- **No se filtran reseñas por estrellas** — Directiva Omnibus, RDL 24/2021.
- **Dos falsos verdes cazados en M0**, y los dos por el mismo patrón: una comprobación que
  mira el sitio equivocado y siempre dice que sí. El test del hero 3D miraba el canvas
  (que nunca existe en headless) y la regla de `social` leía las URLs de los comentarios.
  **Toda aserción negativa se prueba en rojo antes de creérsela.** Aplica directamente al
  «sin reseñas, sección ausente» de `M1-UJ-001`.
- El CI está escrito pero **nunca se ha ejecutado**: `DONE (dormido)`.
- Skills: `github-actions-templates` rota; `evaluation` va de agentes y no encaja aquí;
  `e2e-testing` es un router sin contenido; `deployment-procedures` es doctrina, útil en M2.
