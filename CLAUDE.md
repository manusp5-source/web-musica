# web-musica — gobernanza del proyecto

## Contexto

Web pública de un músico (piano y viola) que toca en bodas, eventos corporativos y
celebraciones en España. Next.js 15 con App Router y dos raíces de idioma (ES en `/`, EN en
`/en`), hero con partículas 3D audio-reactivas, y páginas legales conforme a LSSI y RGPD.
**Construida pero sin publicar.** La tanda actual añade una sección de reseñas alimentada
por Google Business Profile y mete el proyecto bajo el método FactorIA.

## Stack

Next.js 15.5 · React 19.0.0 (exacta) · Tailwind 3.4 · TypeScript 5.7 · three 0.184 +
@react-three/fiber 9.6. En `devDependencies`: Zod, Vitest, Testing Library, jsdom,
Playwright. **Cero dependencias nuevas en runtime.**

## Versión del harness

2026.09-1 — reglas transversales en `~/.claude/docs/harness.md`

## Mapa de directorios

- `planning/` — intent, requisitos, alcance, preguntas abiertas, riesgos
- `design/` — constitución, arquitectura, modelo de datos, contratos, stack, wireframes, estilo
- `implementation/` — task tracker, user journeys, `evals/`
- `docs/` — memoria, decisiones, NFR, work log, mantenimiento, guía de Google Business
- `data/reviews.json` — **el contrato**: única fuente de datos de las reseñas
- `src/lib/reviews/` — esquema, carga, integración con Google, JSON-LD
- `scripts/` — `check-legal.mjs`, `fetch-reviews.ts`, `make-demo-audio.mjs`

## Reglas de este proyecto

1. Lee `design/constitution.md` antes de planificar o implementar. No es negociable.
2. Lee `design/design_summary.md` al empezar cada sesión.
3. Lee `docs/project_memory.md` para retomar desde el último estado.
4. Actualiza `implementation/task_tracker.md` al terminar cada tarea.
5. Actualiza `docs/work_log.md` tras cada tarea, no en lotes.
6. Actualiza `docs/project_memory.md` antes de cerrar sesión.
7. Añade a `docs/decision_log.md` cualquier decisión arquitectónica.
8. Nunca empieces un UJ mientras quede un IT abierto de su milestone o de uno anterior.
9. Nunca commitees a la rama por defecto directamente.
10. Verificar es ejecutar un comando y confirmar su salida. Que un fichero exista no es
    verificación.
11. **Todo cambio empieza por un intent** en `planning/intent-XXX.md`.
12. **Ningún UJ llega a `DONE` sin un eval que pase.** Todo bug deja primero un eval en rojo.
13. **`Skill` y `Model` se eligen y se anotan.** Columna vacía = la tarea no pasa a `WIP`.
14. La salida correcta es media verificación; la otra media es la trayectoria: diff contra
    el plan, skill realmente cargada, alcance respetado.
15. **El que escribe no aprueba.** `/review` con revisor y crítico en subagentes distintos.

## Reglas específicas del dominio

16. **La web nunca llama a Google en runtime.** Solo lee `data/reviews.json`.
17. **No se filtran reseñas por puntuación.** RDL 24/2021 (Omnibus): ocultar las negativas
    es práctica desleal. Si aparece un `rating >= 4` en la ruta de render, es un bug.
18. **El texto de una reseña no se edita ni se traduce.** Recorte visual con CSS, nunca en
    los datos.
19. **Un fetch fallido no rompe el build.** Se conserva el snapshot anterior.
20. **CSP y `images.remotePatterns` se amplían con hosts concretos.** Un comodín `**`
    convierte `/_next/image` en un proxy abierto.
21. **Ningún secreto sale de Node.** `client_secret` y `refresh_token` no aparecen en el
    bundle, ni en el repo, ni en un log — tampoco truncados en un mensaje de error.

## Enrutado de modelo

`haiku` scaffold, documentación y renombrados · `sonnet` implementación normal de IT y UJ ·
`opus` arquitectura, modelo de datos, contratos, seguridad, OAuth y el crítico de `/review`.
Dos fallos con el modelo asignado = sube un tier y escribe por qué. Un tercero no es el
modelo, es la especificación: vuelve al intent.

## Orden de ejecución

```
M0-ITs → M1-ITs → M1-UJs → M2-ITs → M2-UJs
```

Los IDs llevan el milestone dentro (`M0-IT-001`, `M1-UJ-001`) y la numeración reinicia en
`001` en cada uno. Estados: `TODO` · `WIP` · `REVIEW` · `DONE` · `BLOCKED` · `SKIP`.

**M2 (publicación) está en `SKIP`.** Deploy, dominio, datos legales reales, rendimiento y
SEO local quedaron fuera del alcance del 3 sep 2026. Reabrirlo exige un intent nuevo.

## Comandos de verificación

```bash
npm run lint            # ESLint sobre app y src
npm run test            # Vitest
npm run test:e2e        # Playwright con NEXT_PUBLIC_HERO3D=off
npm run build           # build de producción
npm run check-legal     # placeholders legales (--strict falla)
npm run evals           # runner de implementation/evals — exit ≠0 si falla alguno
npm run reviews:fetch   # sincroniza reseñas desde Google (requiere .env)
```

## Comandos de método

`/session-start` al abrir · `/start-execution` para arrancar los ITs · `/review` en cada
frontera de milestone · `/iterate` tras la entrega · `/maintain` post-entrega · `/verify`
antes de dar algo por completo · `/handoff` al dejar una sesión a medias.

Los comandos viven en `~/.claude/commands/`. **Este proyecto no tiene `.claude/commands/`
propio** y no debe tenerlo: taparía al global y divergiría en silencio.

## Estado de los bloqueantes

- **B-01**: no existe ficha de Google Business. Ver `docs/google-business-setup.md`.
- **B-02**: cuota de Business Profile API sin solicitar.

Ninguno bloquea el código; bloquean ver reseñas reales en la página.
