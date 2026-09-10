# Task Tracker — web-musica

_Fuente de verdad del estado de todas las tareas. Se actualiza tras cada tarea completada._
_Última actualización: 2026-09-09 | Milestone actual: **M1**_

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
| M0 | Fundación | Historial de git, tests, CI, evals y método en su sitio | **DONE** (7 de 8; `M0-IT-002` en `SKIP` temporal) |
| M1 | Reseñas | La web muestra reseñas de Google desde `data/reviews.json`, con cumplimiento legal | **WIP** — UJ-001/002/003 auditados y cerrados; faltan UJ-004 y UJ-005 |
| M2 | Publicación | Dominio, datos legales reales, deploy en Cloudflare, QR impreso | **TODO** — reabierto el 3 sep 2026 por DEC-010 (`intent-003`) |

**Regla:** nunca se empieza un UJ mientras quede un IT abierto de su milestone o de uno anterior.

---

## Infrastructure Tasks (ITs)

| ID | Nombre | Milestone | Estado | Skill | Model | Security ✓ | Eval ✓ | Review ✓ | Notas |
|----|--------|-----------|--------|-------|-------|-----------|--------|---------|-------|
| M0-IT-001 | Rename a `web-musica`, rama `feat/factoria-reviews`, primer commit | M0 | **DONE** | `ninguna` | `opus` (previsto `haiku`) | — | — | ✓ | `master`→`main`; commit base del sitio en `main`, scaffold en la rama. Árbol limpio. Ejecutado con el modelo de sesión, no se pudo bajar a haiku |
| M0-IT-002 | Repo privado en GitHub + remoto | M0 | **SKIP (temporal)** | `ninguna` | `haiku` | — | — | [ ] | `gh` instalado (2.99.0) pero sin autenticar tras dos sesiones. Se aparta **conscientemente** para no bloquear M1: el remoto no es prerrequisito técnico de ningún UJ. Vuelve a `TODO` en cuanto haya `gh auth login`. Ver B-03 |
| M0-IT-003 | Vitest + Testing Library + jsdom | M0 | **DONE** | `javascript-testing-patterns` | `opus` (previsto `sonnet`) | — | — | ✓ | 6 tests en verde en 1,78 s. Supuesto S-05 confirmado: RTL 16 + React 19.0.0 exacto sin conflicto. `esbuild.jsx: automatic` obligatorio por el `jsx: preserve` de Next |
| M0-IT-004 | Playwright + smoke ES/EN | M0 | **DONE** | `e2e-testing` | `opus` (previsto `sonnet`) | — | — | ✓ | 7 casos, 6 activos + 1 guardado tras `HERO3D_E2E=on`. Riesgo R-06 mitigado. Se cazó un falso verde: el canvas no vale como marcador |
| M0-IT-005 | GitHub Actions: lint → check-legal → unit → build → e2e → evals | M0 | **DONE (dormido)** | `deployment-procedures` | `opus` (previsto `sonnet`) | — | — | [ ] | Workflow escrito y su cadena verificada **en local, paso a paso**. No se ha ejecutado nunca en GitHub: sin remoto (B-03). `deployment-procedures` es doctrina de despliegue, no plantillas de CI |
| M0-IT-006 | **Eval harness** — runner de `implementation/evals/` + `npm run evals` | M0 | **DONE** | `evaluation` (no encaja) | `opus` (previsto `sonnet`) | — | ✓ | ✓ | Runner + EV-006 y EV-009 reales. **Probado en rojo** plantando un secreto en `.next`: exit 1 con ruta exacta. Después, 2/2 en verde |
| M0-IT-007 | Estructura FactorIA + `CLAUDE.md` de proyecto | M0 | **DONE** | `plan-writing` | `opus` (previsto `haiku`) | — | — | ✓ | 24 ficheros, commiteados el 3 sep |
| M0-IT-008 | Guardia de placeholders en `check-legal.mjs` | M0 | **DONE** | `ninguna` | `opus` (previsto `haiku`) | — | ✓ `EV-010` | ✓ | Dos niveles: LEGAL bloquea con `--strict`, PENDIENTE solo avisa. **La review tumbó el `Eval ✓` anterior**: estaba marcado con una frase del work_log por toda prueba. Ahora lo respalda `EV-010`, que además cazó un segundo defecto en la regla de `social` |

## User Journeys (UJs)

| ID | Nombre | Milestone | Estado | Skill | Model | Security ✓ | Eval ✓ | Review ✓ | Notas |
|----|--------|-----------|--------|-------|-------|-----------|--------|---------|-------|
| M1-UJ-001 | Visitante ve las reseñas en la home ES | M1 | **REVIEW** | `react-best-practices` | `opus` (previsto `sonnet`) | ✓ | ✓ | ✓ | 17 tests nuevos (23 en total). Probado en build real **en las dos direcciones**: con datos sale `id="opiniones"`, sin datos no. `EV-001` rojo→verde |
| M1-UJ-002 | Visitante ve las reseñas en `/en`, idioma original | M1 | **REVIEW** | `ninguna` (ver Notas) | `opus` | ✓ | ✓ | ✓ | **Sin código nuevo**: el diseño de UJ-001 (un componente con `locale`, un solo fichero) ya lo cubría. 6 tests verdes a la primera. No se cargó `nextjs-best-practices` porque no había nada que implementar |
| M1-UJ-003 | Google puede mostrar estrellas: JSON-LD | M1 | **REVIEW** | `seo-fundamentals` | `opus` (previsto `sonnet`) | ✓ | ✓ | ✓ | `jsonld.ts` + 7 tests. `EV-004` rojo→verde. Verificado en HTML real: con datos `reviewCount: 23`, sin datos ninguna clave |
| M1-UJ-004 | Manuel sincroniza con `npm run reviews:fetch` | M1 | **REVIEW** | `auth-implementation-patterns` | `sonnet` (previsto `opus`; sesión en `sonnet`, ver Notas) | ✓ | ✓ `EV-005` | [ ] | `google.ts` (17 tests) + `sync.ts` (7 tests) + CLI real ejecutado sin credenciales. Añadido `tsx` como devDependency (`DEC-016`, Node 20 no importa `.ts`). Probado **contra la API real: imposible hoy** (B-01/B-02) |
| M1-UJ-005 | La sección cumple Omnibus y RGPD (ES/EN) | M1 | TODO | `gdpr-data-handling` | `opus` | [ ] | [ ] | [ ] | Nota de verificación + atribución + párrafo en privacidad |

## M2 — Publicación (reabierto el 3 sep 2026, `planning/intent-003.md`)

| ID | Nombre | Milestone | Estado | Skill | Model | Security ✓ | Eval ✓ | Review ✓ | Notas |
|----|--------|-----------|--------|-------|-------|-----------|--------|---------|-------|
| M2-IT-001 | Dominio registrado y DNS en Cloudflare | M2 | **BLOCKED (parcial)** | `ninguna` | `haiku` | — | — | [ ] | **Dominio ya comprado: `violagranada.es`** (10 sep, Manuel). Aplicado en `site.ts`, verificado en `sitemap.xml`, JSON-LD y build real. **Falta la parte DNS**: sin cuenta de Cloudflare no hay dónde apuntarlo |
| M2-IT-002 | Datos legales reales en `site.ts` + `check-legal --strict` en verde | M2 | **DONE** | `gdpr-data-handling` | `sonnet` (previsto `opus`; sesión en `sonnet`) | — | OK `check-legal --strict` | [ ] | Manuel dio los datos reales el 10 sep. `node scripts/check-legal.mjs --strict` → exit 0 por primera vez. Quedan 3 pendientes no bloqueantes: dominio, vídeos, redes |
| M2-IT-003 | Proyecto en Cloudflare Pages + primer deploy de vista previa | M2 | TODO | `deployment-procedures` | `sonnet` | — | [ ] | [ ] | Se puede hacer contra `*.pages.dev` antes de tener dominio |
| M2-IT-004 | Dominio propio + HTTPS + cabeceras verificadas en producción | M2 | TODO | `security-scanning-security-hardening` | `opus` | [ ] | [ ] | [ ] | `curl -I` tiene que devolver CSP, HSTS, X-Frame-Options y Referrer-Policy |
| M2-IT-005 | Deploy Hook + Cron Trigger para refrescar reseñas | M2 | TODO | `deployment-procedures` | `sonnet` | — | [ ] | [ ] | Cierra el bucle de M1: una reseña nueva aparece sola en <24 h |
| M2-UJ-001 | Un visitante llega por el dominio real y ve la web | M2 | TODO | `ninguna` | `sonnet` | [ ] | [ ] | [ ] | Smoke contra producción, ES y EN |
| M2-IT-006 | Contenido segun el posicionamiento del CMO + quitar el piano en vivo | M2 | **DONE** | `copywriting` (no cargada: la decision ya estaba tomada en el plan) | `opus` | - | OK `EV-013` | [ ] | `INT-006`. 14 promesas de piano fuera, Granada en lugar de Madrid, tarifa publicada, servicios reordenados por el segmento del §4. 42 tests |
| M2-IT-007 | Accesibilidad: navegación legible + tonos ya medidos como insuficientes, generalizado | M2 | **DONE** | `frontend-security-coder` (no cargada: fix mecánico de contraste, no de seguridad) | `sonnet` | — | OK `EV-014` `EV-015` | [ ] | `INT-005` puntos 1-3: header (bug real: `bg-transparent`+`text-carbon` fijo ≈ 1:1), `Sections.tsx` (`Events`, mismo `carbon/60`), footer (separadores `marfil/20` → `aria-hidden`). Punto 4 (contraste del hero) queda declarado como hueco, no calculable a mano con fiabilidad |
| M2-UJ-002 | Un asistente escanea el QR impreso y llega a la web | M2 | TODO | `ninguna` | `sonnet` | [ ] | [ ] | [ ] | `planning/intent-002.md`. Incluye `npm run qr` y **prueba de escaneo en papel**, no en pantalla |

## Blockers Log

| ID | Tarea bloqueada | Motivo | Reportado | Resuelto |
|----|-----------------|--------|-----------|----------|
| B-01 | Conexión real de `M1-UJ-004` | **No existe ficha de Google Business.** Hay que crearla y verificarla | 2026-09-03 | — |
| B-02 | Conexión real de `M1-UJ-004` | Cuota de Business Profile API sin solicitar a Google | 2026-09-03 | — |
| B-03 | `M0-IT-002` y la ejecución real de `M0-IT-005` | `gh` instalado el 3 sep (2.99.0). Sigue bloqueado en **`gh auth login`**: exige navegador | 2026-09-03 | Parcial: instalación resuelta |
| B-04 | `M2-UJ-002` (QR) | **No hay dominio ni sitio publicado.** Un QR impreso necesita una URL definitiva | 2026-09-03 | En curso: M2 reabierto |
| B-06 | Publicación (M2) | ~~La navegación es ilegible sin scroll~~ | 2026-09-10 | **10 sep 2026** — `M2-IT-007`, `EV-014`/`EV-015` |
| B-05 | — | ~~Solo Manuel tiene los datos~~ | 2026-09-03 | **10 sep 2026** — dominio, nombre, NIF, dirección y teléfono, todos dados |

> Ninguno de los dos bloquea el código: `M1-UJ-004` se implementa y se prueba con fixtures.
> Lo bloqueado es ver reseñas reales en la página, no entregar la tarea.

## Skills rotas detectadas

| Skill | Problema | Fecha |
|---|---|---|
| `github-actions-templates` | `REFS ROTAS (todas)` según `~/.claude/skills/INDEX.md` — abrirla gasta turnos y no devuelve nada | 2026-09-03 |
| `auth-implementation-patterns` | **Parcial**: su playbook existe y es útil (618 líneas), pero la sección *Resources* cita 5 ficheros inexistentes. Sirve para `M1-UJ-004`; no esperes de ella los recursos que anuncia | 2026-09-03 |
