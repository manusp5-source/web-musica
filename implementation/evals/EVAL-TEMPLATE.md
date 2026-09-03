# Eval — [ID: M1-UJ-001 | BUG-YYYY-MM-DD]

```
Tipo   : salida | trayectoria
Origen : spec | bug post-entrega | incidente de producción
Cubre  : [una línea: qué comportamiento protege esto]
Creado : [YYYY-MM-DD]
```

---

## Comando

```bash
# Un comando. Devuelve 0 si pasa, distinto de 0 si falla.
# Si hace falta levantar algo antes, va aquí también.
[comando]
```

## Caso

**Precondición**
[Estado de partida: usuario autenticado, base sembrada con X, servicio Y en marcha.]

**Entrada**
```
[petición, payload, o los turnos de la conversación]
```

**Salida esperada**
```
[respuesta exacta, o las condiciones que debe cumplir]
```

**Qué NO debe pasar**
[Fugas de datos de otro usuario, 500, respuesta sin el campo obligatorio, llamada a una
herramienta que no tocaba.]

---

## Multi-turno (obligatorio si el sistema conversa)

| Turno | Entrada del usuario | Se espera | Se comprueba |
|---|---|---|---|
| 1 | [mensaje] | [respuesta o acción] | [cómo] |
| 2 | [mensaje] | [respuesta o acción] | [cómo] |
| 3 | **[se sale del guion]** | [no se rompe, no inventa, no pierde el contexto de los turnos 1-2] | [cómo] |

El turno que se sale del guion no es opcional: es el único que evalúa de verdad.

---

## Trayectoria (si el tipo es trayectoria)

- [ ] Llamó a las herramientas esperadas: [lista]
- [ ] **No** llamó a: [lista de las que no tocaban]
- [ ] Orden correcto
- [ ] Sin pasos de más ni bucles
- [ ] No se salió del alcance declarado

---

## Historial

| Fecha | Resultado | Nota |
|---|---|---|
| [YYYY-MM-DD] | FALLA | Creado en rojo, antes del arreglo |
| [YYYY-MM-DD] | PASA | Arreglo confirmado |
