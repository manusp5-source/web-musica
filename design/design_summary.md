# Design Summary — web-musica
(referencia compacta para contexto de IA — leer al empezar cada sesión)

Proyecto: web-musica (piano y viola para eventos, ES/EN) | Stack: Next.js 15 + React 19 +
Tailwind 3.4 + TS 5.7 | Fase: planning-complete, ejecución no empezada

## Entidades (compacto)
- `ReviewsFile`: schemaVersion, source, fetchedAt, profileUrl, aggregate, reviews[] — es
  `data/reviews.json`, la única fuente de datos de reseñas
- `Aggregate`: rating (1 decimal), count (total de la ficha, ≥ reviews.length)
- `Review`: id, author, avatarUrl, rating 1-5, text (puede ser ""), lang, createdAt, url
  (casi siempre null: la v4 no da enlace por reseña), reply (se guarda, no se muestra)

## Mapa de módulos (compacto)
- `app/(es)` `app/(en)/en` — dos raíces de idioma, App Router
- `src/components/Reviews.tsx` — sección nueva, Server Component, sustituye a Testimonials
- `src/lib/reviews/schema.ts` — Zod + tipos
- `src/lib/reviews/load.ts` — lee y valida en build, nunca lanza, devuelve vacío si falla
- `src/lib/reviews/google.ts` — OAuth + v4 + mapper, solo Node
- `src/lib/reviews/jsonld.ts` — aggregateRating + review para el JSON-LD
- `scripts/fetch-reviews.mjs` — CLI `npm run reviews:fetch`
- `data/reviews.json` — el contrato, versionado
- `tests/unit` `tests/e2e` `tests/fixtures` — Vitest + Playwright
- `implementation/evals/` — runner + un eval por criterio de éxito

## Decisiones clave
- El fichero es la frontera: la web nunca llama a Google en runtime
- El build no depende de la red: fetch fallido = se conserva el snapshot
- Cero secretos en cliente: OAuth solo en Node, verificado con grep del bundle
- Sin filtrar por estrellas: Omnibus (RDL 24/2021) + ToS de Google apuntan igual
- Sin datos, la sección no se renderiza (no hay estado vacío visible)
- `fetch` nativo en vez de `googleapis`: dos peticiones no justifican 50 MB
- Zod y test tooling solo en devDependencies: el bundle no crece
- Sin modo oscuro, sin dependencias de runtime nuevas

## Secuencia de ITs (M0)
- M0-IT-001: rename + rama + primer commit
- M0-IT-002: repo privado GitHub + remoto
- M0-IT-003: Vitest + Testing Library + jsdom
- M0-IT-004: Playwright + smoke ES/EN con hero3d off
- M0-IT-005: GitHub Actions (lint, check-legal, unit, build, e2e)
- M0-IT-006: eval harness — `npm run evals`
- M0-IT-007: estructura FactorIA + CLAUDE.md de proyecto
- M0-IT-008: guardia de placeholders en check-legal

## Secuencia de UJs (M1)
- M1-UJ-001: reseñas en la home ES (esquema + load + componente + estados)
- M1-UJ-002: reseñas en `/en`, idioma original
- M1-UJ-003: JSON-LD con aggregateRating coherente
- M1-UJ-004: `npm run reviews:fetch` — OAuth, paginación, fallback, sin secretos
- M1-UJ-005: cumplimiento Omnibus + RGPD, textos ES/EN

## Dependencias externas
- Google Business Profile API v4 — reseñas. **Bloqueada**: ficha sin crear, cuota sin pedir
- Google OAuth 2.0 — refresh token de propietario
- lh3.googleusercontent.com — avatares (opcional; alternativa: iniciales)
- GitHub — repo privado + Actions
- Formspree, YouTube nocookie — ya integrados

## Comandos de verificación
```
npm run lint          # ESLint sobre app y src
npm run test          # Vitest unitarios
npm run test:e2e      # Playwright, con NEXT_PUBLIC_HERO3D=off
npm run build         # build de producción de Next
npm run check-legal   # placeholders legales (--strict falla)
npm run evals         # runner de implementation/evals — devuelve ≠0 si falla alguno
npm run reviews:fetch # sincroniza reseñas desde Google (requiere .env)
```
`/review` ejecuta estos comandos. Sin ellos no puede verificar nada y acaba diciendo «el
fichero existe», que no es verificación.
