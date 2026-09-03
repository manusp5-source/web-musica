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
  EV-001…EV-007.eval.md
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
| `EV-001.eval.md` | salida | spec | La home ES renderiza las reseñas del fixture | Render ES/EN | PENDIENTE | — |
| `EV-002.eval.md` | salida | spec | Fichero vacío o corrupto → sección ausente y build en verde | Degradación limpia | PENDIENTE | — |
| `EV-003.eval.md` | salida | spec | `/en` con rótulos traducidos y reseñas sin traducir | Render ES/EN | PENDIENTE | — |
| `EV-004.eval.md` | salida | spec | JSON-LD con `aggregateRating` coherente; ausente si `count` es 0 | JSON-LD válido | PENDIENTE | — |
| `EV-005.eval.md` | salida | spec | Mapper v4 → esquema con fixtures: enums, anónimos, paginación | Fetcher con y sin credenciales | PENDIENTE | — |
| `EV-006.eval.md` | **trayectoria** | spec | `grep` del `.next` de producción: ni `client_secret` ni `refresh_token` | Cero secretos en cliente | PENDIENTE | — |
| `EV-007.eval.md` | salida | spec | `reviews.disclosure` presente en `/` y `/en`; apartado de reseñas en ambas privacidades | Cumplimiento Omnibus | PENDIENTE | — |
| `EV-008.eval.md` | **trayectoria** | constitución | Ninguna comparación sobre `rating` en la ruta de render (no hay filtro por estrellas) | Cumplimiento Omnibus | PENDIENTE | — |
| `EV-009.eval.md` | salida | spec | Build sin ninguna credencial en el entorno termina en 0 | Build no depende de la red | PENDIENTE | — |

_Una fila por eval. `/review` actualiza la columna de estado tras cada ejecución._

## Cobertura — huecos conocidos

| Área sin cubrir | Por qué todavía no | Riesgo |
|---|---|---|
| Llamada real a la API de Google | No hay ficha ni cuota aprobada. Todo se prueba con fixtures | **Medio** — el mapeo está verificado, la autenticación real no se ha ejercitado nunca |
| Rendimiento y Core Web Vitals | Fuera del alcance de esta tanda | Bajo por ahora; sube si se publica |
| Accesibilidad más allá de las etiquetas de estrellas | Fuera del alcance | Medio si se publica |
| Regresión visual de la sección | Playwright se usa solo para smoke | Bajo |
| Publicación real (deploy, dominio, datos legales) | Fuera del alcance, milestone M2 en `SKIP` | **Alto para el negocio**: sin esto la web no existe para nadie |
