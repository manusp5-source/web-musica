# Task Tracker — web-musica

_Fuente de verdad del estado de todas las tareas. Se actualiza tras cada tarea completada._
_Última actualización: 2026-09-03 | Milestone actual: **M0**_

---

## Leyenda de estado

| Estado | Significado |
|--------|-------------|
| TODO | En alcance, sin empezar |
| WIP | En curso. **Máximo uno a la vez** |
| REVIEW | Código terminado, esperando `/review` |
| DONE | Aceptado, probado y commiteado |
| BLOCKED | No puede avanzar. Motivo en Notas y en el Blockers Log |
| SKIP | Fuera de alcance para este proyecto |

**Columnas obligatorias:** `Skill`, `Model`, `Security ✓`, `Eval ✓`, `Review ✓`. Una tarea
con `Skill` o `Model` vacío **no pasa a `WIP`**. `Eval ✓` solo se marca si el eval se
ejecutó y pasó.

**Enrutado de modelo:** `haiku` scaffold, docs y renombrados · `sonnet` implementación
normal · `opus` arquitectura, seguridad y autenticación. Dos fallos con el modelo asignado
= sube un tier y se escribe por qué. Tres fallos no es el modelo, es la especificación:
volver al intent.

---

## Milestones

| Milestone | Nombre | Objetivo | Estado |
|---|---|---|---|
| M0 | Fundación | Historial de git, tests, CI, evals y método en su sitio | TODO |
| M1 | Reseñas | La web muestra reseñas de Google desde `data/reviews.json`, con cumplimiento legal | TODO |
| M2 | Publicación | Dominio, datos legales reales, deploy en Cloudflare, QR impreso | **TODO** — reabierto el 3 sep 2026 por DEC-010 (`intent-003`) |

**Regla:** nunca se empieza un UJ mientras quede un IT abierto de su milestone o de uno anterior.

---

## Infrastructure Tasks (ITs)

| ID | Nombre | Milestone | Estado | Skill | Model | Security ✓ | Eval ✓ | Review ✓ | Notas |
|----|--------|-----------|--------|-------|-------|-----------|--------|---------|-------|
| M0-IT-001 | Rename a `web-musica`, rama `feat/factoria-reviews`, primer commit | M0 | **DONE** | `ninguna` | `opus` (previsto `haiku`) | — | — | [ ] | `master`→`main`; commit base del sitio en `main`, scaffold en la rama. Árbol limpio. Ejecutado con el modelo de sesión, no se pudo bajar a haiku |
| M0-IT-002 | Repo privado en GitHub + remoto | M0 | **SKIP (temporal)** | `ninguna` | `haiku` | — | — | [ ] | `gh` instalado (2.99.0) pero sin autenticar tras dos sesiones. Se aparta **conscientemente** para no bloquear M1: el remoto no es prerrequisito técnico de ningún UJ. Vuelve a `TODO` en cuanto haya `gh auth login`. Ver B-03 |
| M0-IT-003 | Vitest + Testing Library + jsdom | M0 | **DONE** | `javascript-testing-patterns` | `opus` (previsto `sonnet`) | — | — | [ ] | 6 tests en verde en 1,78 s. Supuesto S-05 confirmado: RTL 16 + React 19.0.0 exacto sin conflicto. `esbuild.jsx: automatic` obligatorio por el `jsx: preserve` de Next |
| M0-IT-004 | Playwright + smoke ES/EN | M0 | **DONE** | `e2e-testing` | `opus` (previsto `sonnet`) | — | — | [ ] | 7 casos, 6 activos + 1 guardado tras `HERO3D_E2E=on`. Riesgo R-06 mitigado. Se cazó un falso verde: el canvas no vale como marcador |
| M0-IT-005 | GitHub Actions: lint → check-legal → unit → build → e2e → evals | M0 | **DONE (dormido)** | `deployment-procedures` | `opus` (previsto `sonnet`) | — | — | [ ] | Workflow escrito y su cadena verificada **en local, paso a paso**. No se ha ejecutado nunca en GitHub: sin remoto (B-03). `deployment-procedures` es doctrina de despliegue, no plantillas de CI |
| M0-IT-006 | **Eval harness** — runner de `implementation/evals/` + `npm run evals` | M0 | **DONE** | `evaluation` (no encaja) | `opus` (previsto `sonnet`) | — | ✓ | [ ] | Runner + EV-006 y EV-009 reales. **Probado en rojo** plantando un secreto en `.next`: exit 1 con ruta exacta. Después, 2/2 en verde |
| M0-IT-007 | Estructura FactorIA + `CLAUDE.md` de proyecto | M0 | **DONE** | `plan-writing` | `opus` (previsto `haiku`) | — | — | [ ] | 24 ficheros, commiteados el 3 sep |
| M0-IT-008 | Guardia de placeholders en `check-legal.mjs` | M0 | **DONE** | `ninguna` | `opus` (previsto `haiku`) | — | ✓ | [ ] | Dos niveles: LEGAL bloquea con `--strict`, PENDIENTE solo avisa. Caza 4 placeholders. Se corrigió un defecto propio: la regla de `social` leía las URLs de los comentarios |

## User Journeys (UJs)

| ID | Nombre | Milestone | Estado | Skill | Model | Security ✓ | Eval ✓ | Review ✓ | Notas |
|----|--------|-----------|--------|-------|-------|-----------|--------|---------|-------|
| M1-UJ-001 | Visitante ve las reseñas en la home ES | M1 | **REVIEW** | `react-best-practices` | `opus` (previsto `sonnet`) | ✓ | ✓ | [ ] | 17 tests nuevos (23 en total). Probado en build real **en las dos direcciones**: con datos sale `id="opiniones"`, sin datos no. `EV-001` rojo→verde |
| M1-UJ-002 | Visitante ve las reseñas en `/en`, idioma original | M1 | **REVIEW** | `ninguna` (ver Notas) | `opus` | ✓ | ✓ | [ ] | **Sin código nuevo**: el diseño de UJ-001 (un componente con `locale`, un solo fichero) ya lo cubría. 6 tests verdes a la primera. No se cargó `nextjs-best-practices` porque no había nada que implementar |
| M1-UJ-003 | Google puede mostrar estrellas: JSON-LD | M1 | **REVIEW** | `seo-fundamentals` | `opus` (previsto `sonnet`) | ✓ | ✓ | [ ] | `jsonld.ts` + 7 tests. `EV-004` rojo→verde. Verificado en HTML real: con datos `reviewCount: 23`, sin datos ninguna clave |
| M1-UJ-004 | Manuel sincroniza con `npm run reviews:fetch` | M1 | TODO | `auth-implementation-patterns` | `opus` | [ ] | [ ] | [ ] | OAuth, paginación, reintentos, fallback. **Nunca rompe el build** |
| M1-UJ-005 | La sección cumple Omnibus y RGPD (ES/EN) | M1 | TODO | `gdpr-data-handling` | `opus` | [ ] | [ ] | [ ] | Nota de verificación + atribución + párrafo en privacidad |

## M2 — Publicación (reabierto el 3 sep 2026, `planning/intent-003.md`)

| ID | Nombre | Milestone | Estado | Skill | Model | Security ✓ | Eval ✓ | Review ✓ | Notas |
|----|--------|-----------|--------|-------|-------|-----------|--------|---------|-------|
| M2-IT-001 | Dominio registrado y DNS en Cloudflare | M2 | BLOCKED | `ninguna` | `haiku` | — | — | [ ] | **Lo compra Manuel.** Ni la IA compra dominios ni gestiona pagos |
| M2-IT-002 | Datos legales reales en `site.ts` + `check-legal --strict` en verde | M2 | BLOCKED | `gdpr-data-handling` | `opus` | [ ] | [ ] | [ ] | Faltan nombre, NIF, dirección y WhatsApp real. Ver B-05 |
| M2-IT-003 | Proyecto en Cloudflare Pages + primer deploy de vista previa | M2 | TODO | `deployment-procedures` | `sonnet` | — | [ ] | [ ] | Se puede hacer contra `*.pages.dev` antes de tener dominio |
| M2-IT-004 | Dominio propio + HTTPS + cabeceras verificadas en producción | M2 | TODO | `security-scanning-security-hardening` | `opus` | [ ] | [ ] | [ ] | `curl -I` tiene que devolver CSP, HSTS, X-Frame-Options y Referrer-Policy |
| M2-IT-005 | Deploy Hook + Cron Trigger para refrescar reseñas | M2 | TODO | `deployment-procedures` | `sonnet` | — | [ ] | [ ] | Cierra el bucle de M1: una reseña nueva aparece sola en <24 h |
| M2-UJ-001 | Un visitante llega por el dominio real y ve la web | M2 | TODO | `ninguna` | `sonnet` | [ ] | [ ] | [ ] | Smoke contra producción, ES y EN |
| M2-UJ-002 | Un asistente escanea el QR impreso y llega a la web | M2 | TODO | `ninguna` | `sonnet` | [ ] | [ ] | [ ] | `planning/intent-002.md`. Incluye `npm run qr` y **prueba de escaneo en papel**, no en pantalla |

## Blockers Log

| ID | Tarea bloqueada | Motivo | Reportado | Resuelto |
|----|-----------------|--------|-----------|----------|
| B-01 | Conexión real de `M1-UJ-004` | **No existe ficha de Google Business.** Hay que crearla y verificarla | 2026-09-03 | — |
| B-02 | Conexión real de `M1-UJ-004` | Cuota de Business Profile API sin solicitar a Google | 2026-09-03 | — |
| B-03 | `M0-IT-002` y la ejecución real de `M0-IT-005` | `gh` instalado el 3 sep (2.99.0). Sigue bloqueado en **`gh auth login`**: exige navegador | 2026-09-03 | Parcial: instalación resuelta |
| B-04 | `M2-UJ-002` (QR) | **No hay dominio ni sitio publicado.** Un QR impreso necesita una URL definitiva | 2026-09-03 | En curso: M2 reabierto |
| B-05 | `M2-IT-001` y `M2-IT-002` | **Solo Manuel tiene los datos**: dominio elegido, nombre completo, NIF, dirección postal y teléfono real | 2026-09-03 | — |

> Ninguno de los dos bloquea el código: `M1-UJ-004` se implementa y se prueba con fixtures.
> Lo bloqueado es ver reseñas reales en la página, no entregar la tarea.

## Skills rotas detectadas

| Skill | Problema | Fecha |
|---|---|---|
| `github-actions-templates` | `REFS ROTAS (todas)` según `~/.claude/skills/INDEX.md` — abrirla gasta turnos y no devuelve nada | 2026-09-03 |
| `auth-implementation-patterns` | **Parcial**: su playbook existe y es útil (618 líneas), pero la sección *Resources* cita 5 ficheros inexistentes. Sirve para `M1-UJ-004`; no esperes de ella los recursos que anuncia | 2026-09-03 |
