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
| M2 | Publicación | Deploy, dominio, datos reales, refresco automático | **SKIP** — fuera de esta tanda, requiere intent nuevo |

**Regla:** nunca se empieza un UJ mientras quede un IT abierto de su milestone o de uno anterior.

---

## Infrastructure Tasks (ITs)

| ID | Nombre | Milestone | Estado | Skill | Model | Security ✓ | Eval ✓ | Review ✓ | Notas |
|----|--------|-----------|--------|-------|-------|-----------|--------|---------|-------|
| M0-IT-001 | Rename a `web-musica`, rama `feat/factoria-reviews`, primer commit | M0 | **DONE** | `ninguna` | `opus` (previsto `haiku`) | — | — | [ ] | `master`→`main`; commit base del sitio en `main`, scaffold en la rama. Árbol limpio. Ejecutado con el modelo de sesión, no se pudo bajar a haiku |
| M0-IT-002 | Repo privado en GitHub + remoto | M0 | **BLOCKED** | `ninguna` | `haiku` | — | — | [ ] | **`gh` no está instalado** (ni bash ni PowerShell). Ver B-03. Arrastra a M0-IT-005: el workflow se escribe pero no se ejecuta |
| M0-IT-003 | Vitest + Testing Library + jsdom | M0 | **DONE** | `javascript-testing-patterns` | `opus` (previsto `sonnet`) | — | — | [ ] | 6 tests en verde en 1,78 s. Supuesto S-05 confirmado: RTL 16 + React 19.0.0 exacto sin conflicto. `esbuild.jsx: automatic` obligatorio por el `jsx: preserve` de Next |
| M0-IT-004 | Playwright + smoke ES/EN | M0 | TODO | `e2e-testing` | `sonnet` | — | [ ] | [ ] | `NEXT_PUBLIC_HERO3D=off` en el entorno de test |
| M0-IT-005 | GitHub Actions: lint → check-legal → unit → build → e2e | M0 | TODO | `deployment-procedures` | `sonnet` | — | [ ] | [ ] | `github-actions-templates` está **rota** (todas las refs) — no cargarla |
| M0-IT-006 | **Eval harness** — runner de `implementation/evals/` + `npm run evals` | M0 | TODO | `evaluation` | `sonnet` | — | [ ] | [ ] | Sin esto ningún UJ puede marcar `Eval ✓` |
| M0-IT-007 | Estructura FactorIA + `CLAUDE.md` de proyecto | M0 | TODO | `plan-writing` | `haiku` | — | — | [ ] | Hecho en el scaffold del 3 sep; se cierra al commitear |
| M0-IT-008 | Guardia de placeholders en `check-legal.mjs` | M0 | TODO | `ninguna` | `haiku` | — | [ ] | [ ] | Avisa de dominio, WhatsApp y vídeos. **Avisa, no falla** |

## User Journeys (UJs)

| ID | Nombre | Milestone | Estado | Skill | Model | Security ✓ | Eval ✓ | Review ✓ | Notas |
|----|--------|-----------|--------|-------|-------|-----------|--------|---------|-------|
| M1-UJ-001 | Visitante ve las reseñas en la home ES | M1 | TODO | `react-best-practices` | `sonnet` | [ ] | [ ] | [ ] | Incluye schema, load, Reviews.tsx y estados vacío/corrupto |
| M1-UJ-002 | Visitante ve las reseñas en `/en`, idioma original | M1 | TODO | `nextjs-best-practices` | `sonnet` | [ ] | [ ] | [ ] | Rótulos traducidos, reseñas sin traducir |
| M1-UJ-003 | Google puede mostrar estrellas: JSON-LD | M1 | TODO | `seo-fundamentals` | `sonnet` | [ ] | [ ] | [ ] | `aggregateRating` coherente con `aggregate.count` |
| M1-UJ-004 | Manuel sincroniza con `npm run reviews:fetch` | M1 | TODO | `auth-implementation-patterns` | `opus` | [ ] | [ ] | [ ] | OAuth, paginación, reintentos, fallback. **Nunca rompe el build** |
| M1-UJ-005 | La sección cumple Omnibus y RGPD (ES/EN) | M1 | TODO | `gdpr-data-handling` | `opus` | [ ] | [ ] | [ ] | Nota de verificación + atribución + párrafo en privacidad |

## Blockers Log

| ID | Tarea bloqueada | Motivo | Reportado | Resuelto |
|----|-----------------|--------|-----------|----------|
| B-01 | Conexión real de `M1-UJ-004` | **No existe ficha de Google Business.** Hay que crearla y verificarla | 2026-09-03 | — |
| B-02 | Conexión real de `M1-UJ-004` | Cuota de Business Profile API sin solicitar a Google | 2026-09-03 | — |
| B-03 | `M0-IT-002` y la ejecución real de `M0-IT-005` | **`gh` CLI no instalado** en la máquina. Sin remoto no hay CI que se ejecute | 2026-09-03 | — |
| B-04 | `M1-IT-001` (QR) | **No hay dominio ni sitio publicado.** Un QR impreso necesita una URL estable y definitiva | 2026-09-03 | — |

> Ninguno de los dos bloquea el código: `M1-UJ-004` se implementa y se prueba con fixtures.
> Lo bloqueado es ver reseñas reales en la página, no entregar la tarea.

## Skills rotas detectadas

| Skill | Problema | Fecha |
|---|---|---|
| `github-actions-templates` | `REFS ROTAS (todas)` según `~/.claude/skills/INDEX.md` — abrirla gasta turnos y no devuelve nada | 2026-09-03 |
| `auth-implementation-patterns` | **Parcial**: su playbook existe y es útil (618 líneas), pero la sección *Resources* cita 5 ficheros inexistentes. Sirve para `M1-UJ-004`; no esperes de ella los recursos que anuncia | 2026-09-03 |
