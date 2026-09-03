# Mantenimiento — bucle cerrado — web-musica

> La entrega no cierra el ciclo, lo reinicia. Lo ejecuta `/maintain`.

---

## Principio

**El disparador es un script determinista, nunca el agente.** El agente diagnostica y
**propone**; no repara producción por su cuenta. Su salida no es un parche: es un
`planning/intent-XXX.md`.

```
señal fuera de banda → script → agente diagnostica → intent.md → gate → /iterate
```

---

## Señales vigiladas

Solo se listan las que este proyecto puede medir **de verdad hoy**. El sitio no está
desplegado, así que no hay 5xx ni latencia que vigilar: inventar esas filas sería decorar.

| Señal | Fuente | Banda normal | Fuera de banda dispara |
|---|---|---|---|
| Fallos de CI en la rama por defecto | GitHub Actions | 0 | Diagnóstico + intent |
| Evals en rojo | `npm run evals` | 0 | **Para todo trabajo nuevo** |
| `npm run build` roto | CI o local | 0 fallos | Diagnóstico inmediato |
| Placeholders legales sin rellenar | `npm run check-legal` | 0 antes de publicar | Aviso a Manuel. **Bloquea el deploy** |
| Antigüedad de `data/reviews.json` | `fetchedAt` del fichero | < 30 días una vez conectada la API | Aviso a Manuel para sincronizar |
| Reseña nueva en Google no reflejada | Comparación `aggregate.count` vs. ficha | 0 de diferencia | Ejecutar `npm run reviews:fetch` |
| `403` persistente de la API | Salida de `reviews:fetch` | 0 | Revisar cuota y permisos de la ficha |
| Petición de retirada de una reseña | Correo a `site.legal.privacyEmail` | — | **Atención en 30 días** (RGPD art. 12) |

_Sin banda escrita, una señal no se vigila: se mira de vez en cuando, que no es lo mismo._

## Señales que se activarán cuando se publique (M2, hoy en `SKIP`)

Errores 5xx, latencia p95, Core Web Vitals de Search Console, impresiones y clics de la
ficha de Google. Escritas aquí para que el día del deploy no haya que redescubrirlas.

---

## Qué hace el agente al despertar

1. Lee la señal y su historial. **No asume la causa.**
2. Reproduce el fallo. Si no lo reproduce, lo dice y para.
3. Escribe `planning/intent-XXX.md` con `Origen: docs/maintain.md`.
4. Si el fallo tenía eval, anota **qué eval no lo cogió**. Ese hueco es un hallazgo.
5. **No toca producción.** No despliega, no hace rollback, no cambia variables de entorno.

## Puertas por entorno

| Entorno | Autonomía | Puerta |
|---|---|---|
| Local | Escribe, ejecuta, rompe | Ninguna |
| CI | Ejecuta, no publica | Registrado en el workflow |
| Producción | **No existe todavía.** Cuando exista: solo lectura por defecto | OK nominal de Manuel en cada despliegue |

## Registro de incidentes

| Fecha | Señal | Diagnóstico | Intent generado | Eval añadido | Cerrado |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

**Cada incidente deja un eval.** Si no lo deja, vuelve y nadie se entera hasta que lo
cuenta un cliente.
