# Evals — web-musica

> **El listón está en el eval, no en la demo.** Una demo prueba que funcionó una vez; un
> eval prueba que sigue funcionando. Cada UJ trae el suyo y cada bug deja el suyo al
> marcharse.

---

## Reglas duras

1. **Ningún UJ pasa a `DONE` sin al menos un eval ejecutable que pase.** La columna
   `Eval ✓` de `implementation/task_tracker.md` no se marca de otra forma.
2. **Todo bug genera primero un eval que falla, y después el arreglo.** Rojo antes que verde.
3. **Los evals corren en CI** (`M0-IT-005`). Mientras no exista, los ejecuta `/review`.
4. **Si es conversacional, hay multi-turno.** Este sistema **no conversa**: es una web
   estática. Regla no aplicable aquí, y está escrito para que nadie la eche de menos.
5. **El harness también se regresiona.** Si cambian `CLAUDE.md`, las skills o los hooks del
   proyecto, los evals se vuelven a pasar antes de dar el cambio por bueno.

## Estructura

```
implementation/evals/
  README.md            este fichero
  EVAL-TEMPLATE.md     plantilla
  EV-001…EV-009.eval.md
  checks/            comprobaciones en Node que invocan los evals
  run.mjs              recorre todos, exit ≠ 0 si falla alguno  → npm run evals
```

## Los dos tipos

**Eval de salida** — ¿el resultado es correcto? Entrada conocida, salida esperada, comando.

**Eval de trayectoria** — ¿el camino fue sano? Aquí no hay agente que llame herramientas,
así que la trayectoria se traduce en: *¿el dato llegó por donde debía?* `EV-006` (ningún
secreto en el bundle) y `EV-008` (ningún filtro por puntuación en la ruta de render) son
evals de trayectoria: comprueban el camino, no la pantalla.

---

## Registro

| Eval | Tipo | Origen | Cubre | Criterio del intent | Estado | Última ejecución |
|---|---|---|---|---|---|---|
| `EV-001.eval.md` | salida | spec | La sección pinta los datos del fichero y desaparece sin ellos | Render ES/EN | **PASA** | 2026-09-05 |
| ~~`EV-002`~~ | salida | spec | Fichero vacío o corrupto → sección ausente | Degradación limpia | **ABSORBIDO por EV-001** | 2026-09-05 |
| `EV-003.eval.md` | salida | spec | `/en` con rótulos traducidos y reseñas sin traducir | Render ES/EN | **PASA** | 2026-09-05 |
| `EV-004.eval.md` | salida | spec | JSON-LD con `aggregateRating` coherente; ausente si `count` es 0 | JSON-LD válido | **PASA** | 2026-09-05 |
| `EV-005.eval.md` | salida | spec | Mapper v4 → esquema con fixtures: enums, anónimos, paginación | Fetcher con y sin credenciales | PENDIENTE (M1-UJ-004) | — |
| `EV-006.eval.md` | **trayectoria** | spec | Recorre el `.next` de producción buscando nombres y valores de credencial | Cero secretos en cliente | **PASA** | 2026-09-04 |
| `EV-007.eval.md` | salida | spec | `reviews.disclosure` presente en `/` y `/en`; apartado de reseñas en ambas privacidades | Cumplimiento Omnibus | PENDIENTE (M1-UJ-005) | — |
| `EV-008.eval.md` | **trayectoria** | constitución + review | Ninguna comparación sobre `rating` en la ruta de render | Cumplimiento Omnibus | **PASA** | 2026-09-06 |
| `EV-010.eval.md` | salida | review (hallazgo crítico) | `check-legal` bloquea por datos legales y nunca por los pendientes | Guardia de placeholders | **PASA** | 2026-09-06 |
| `EV-009.eval.md` | salida | spec | Build sin ninguna credencial en el entorno termina en 0 | Build no depende de la red | **PASA** | 2026-09-04 |
| `EV-011.eval.md` | **trayectoria** | review, pasada 5 | CSP y `remotePatterns` sin comodines de esquema ni de host | Seguridad de cabeceras | **PASA** | 2026-09-09 |
| `EV-012.eval.md` | salida | review, pasada 5 | Contraste AA real de la seccion de resenas, con exenciones declaradas | Accesibilidad del aviso legal | **PASA** | 2026-09-09 |

**Runner:** `npm run evals` → `implementation/evals/run.mjs`. Extrae el comando del bloque
` ```bash ` que hay bajo `## Comando` en cada `*.eval.md`, lo ejecuta desde la raíz y
devuelve exit ≠ 0 si falla alguno. Un eval cuyo comando siga siendo el placeholder de la
plantilla cuenta como **PENDIENTE**, nunca como aprobado.

_Una fila por eval. `/review` actualiza la columna de estado tras cada ejecución._

## Cobertura — huecos conocidos

| Área sin cubrir | Por qué todavía no | Riesgo |
|---|---|---|
| Llamada real a la API de Google | No hay ficha ni cuota aprobada. Todo se prueba con fixtures | **Medio** — el mapeo está verificado, la autenticación real no se ha ejercitado nunca |
| Rendimiento y Core Web Vitals | Fuera del alcance de esta tanda | Bajo por ahora; sube si se publica |
| Accesibilidad más allá del contraste y las etiquetas de estrellas (axe, teclado, lector de pantalla) | Fuera del alcance. El contraste sí está cubierto por `EV-012` desde el 9 sep | Medio si se publica |
| Regresión visual de la sección | Playwright se usa solo para smoke | Bajo |
| Publicación real (deploy, dominio, datos legales) | Milestone M2, reabierto el 4 sep. Bloqueado por B-04 y B-05 | **Alto para el negocio**: sin esto la web no existe para nadie |
