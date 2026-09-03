# Work Log — web-musica

Registro cronológico. Una entrada por IT o UJ, escrita al terminar la tarea, no en lotes.

## Formato de entrada

### [fecha] — M0-IT-001: [nombre] completado
- **Trabajo hecho**: [qué se implementó]
- **Modelo usado / Skill cargada**: [tiene que coincidir con el task_tracker]
- **Ficheros creados / modificados**: [lista]
- **Verificación (salida)**: [el comando ejecutado y su salida confirmada]
- **Verificación (trayectoria)**: diff contra el plan · skill realmente cargada · alcance
- **Eval**: [qué eval de `implementation/evals/` lo cubre y su resultado]
- **Comprobación de seguridad**: [pasa/falla, o no aplica]
- **Tests**: [añadidos y su resultado]
- **Notas**: [lo no obvio para una sesión futura]

---

## Log

### 2026-09-03 — Scaffold FactorIA (previo a M0)
- **Trabajo hecho**: gate de fábrica, intent `INT-001`, discovery hasta 6% de ambigüedad,
  propuesta de arquitectura, planning gate superado con `APROBADO`, y scaffold completo de
  `planning/`, `design/`, `implementation/`, `docs/` y `CLAUDE.md`.
- **Modelo usado / Skill cargada**: `opus` para arquitectura y gate; skill `init-project`.
- **Ficheros creados**: 21 (4 en `planning/`, 8 en `design/`, 4 en `implementation/`,
  6 en `docs/`, más `CLAUDE.md`).
- **Verificación (salida)**: `mv` de la carpeta confirmado con `ls`; ficheros creados y
  listados. **Pendiente**: `npm run build` después del rename — se ejecuta en `M0-IT-001`.
- **Verificación (trayectoria)**: no se ha escrito ni una línea de código de aplicación,
  que es exactamente lo que exige el planning gate. El rename se adelantó al scaffold para
  no crear 21 ficheros en una ruta condenada.
- **Eval**: ninguno todavía. El runner es `M0-IT-006`.
- **Comprobación de seguridad**: no aplica (solo documentación).
- **Notas**:
  - La carpeta pasó de `Desktop\Página web música` a `Desktop\web-musica`. **Hay que
    reabrir el proyecto en el IDE con la ruta nueva.**
  - `github-actions-templates` está marcada `REFS ROTAS (todas)` en el índice de skills. No
    volver a intentar cargarla; para el CI se usa `deployment-procedures`.
  - La API v4 de Google **no devuelve enlace por reseña individual**. Se corrigió el modelo
    de datos: `url` es opcional y la atribución apunta a la ficha.
  - Descubierto durante el scaffold: `node_modules` sobrevivió al rename sin reinstalar,
    pero no se ha ejecutado ningún build para confirmarlo.

---

## Review

_(`/review` escribe aquí las dos pasadas —REVISOR y CRÍTICO— y el veredicto)_
