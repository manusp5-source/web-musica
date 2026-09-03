# Project Memory — web-musica
Última actualización: 2026-09-03

## Fase actual
`planning-complete` / ejecución no empezada. El scaffold está escrito; no se ha tocado
código de la aplicación.

## Versión del harness
2026.09-1 (ver `~/.claude/docs/harness.md`)

## Rama
Ninguna todavía. **El repo no tiene ni un commit.** `M0-IT-001` crea
`feat/factoria-reviews` y hace el primer commit del proyecto entero.

## Último completado
Intent aprobado (`planning/intent-001.md`), planning gate superado con `APROBADO` el 3 sep
2026, y scaffold de FactorIA escrito. Carpeta renombrada de `Página web música` a
`web-musica` (los subagentes juez de `/review` no leen rutas no-ASCII).

## Siguiente paso
`/start-execution` → `M0-IT-001`: rama, `.gitignore` revisado y primer commit. Nada de UJs
hasta cerrar los ocho ITs de M0.

## Bloqueadores
- **B-01**: no existe ficha de Google Business. Hay que crearla y verificarla.
- **B-02**: cuota de Business Profile API sin solicitar.

Ninguno bloquea el código: `M1-UJ-004` se implementa y se prueba con fixtures. Lo que está
bloqueado es ver reseñas reales en la página.

## Contexto clave para retomar en frío

Web de un músico (piano y viola) para bodas y eventos en España, Next.js 15 con dos raíces
de idioma, ya construida pero **sin publicar y con placeholders legales**. Esta tanda hace
dos cosas: mete el proyecto bajo el método FactorIA (git, tests, CI, evals) y añade una
sección de reseñas cuya única fuente es `data/reviews.json`, que un CLI regenera desde
Google Business Profile API.

Lo que no hay que olvidar:
- **El fichero es la frontera.** La web no llama a Google en runtime, nunca.
- **No se filtran reseñas por estrellas** — Directiva Omnibus, RDL 24/2021.
- **Publicar sigue fuera de alcance**: faltan NIF, dirección, dominio y vídeos reales, y el
  deploy en Cloudflare Pages es milestone M2, hoy en `SKIP`.
- La skill `github-actions-templates` está rota; para el CI se usa `deployment-procedures`.
