# Guía de estilo — web-musica

Ya existía y no se cambia. Se documenta para que la sección de reseñas encaje sin inventar
nada. Fuente de verdad: `tailwind.config.ts` y `app/globals.css`.

---

## Paleta

| Token | Valor | Se usa para |
|---|---|---|
| `marfil` | `#FAF7F2` | Fondo base del sitio |
| `marfil2` | `#F2ECE2` | Fondo de secciones alternas |
| `carbon` | `#1C1B19` | Texto principal, botón primario |
| `carbon2` | `#33312D` | Hover del botón primario |
| `dorado` | `#C9A86A` | Acento: comillas, botón dorado, **estrellas llenas** |
| `doradoDark` | `#A6854B` | Hover del botón dorado |
| `bronce` | `#7A5F2E` | Dorado oscuro para texto sobre claro — **cumple AA** |
| `burdeos` | `#5E2A33` | Acento secundario |
| `oliva` | `#5A5A3C` | Acento terciario |

**Regla de contraste:** el dorado claro nunca se usa para texto sobre marfil. Para texto
acentuado va `bronce`. Las estrellas sí van en `dorado` porque son gráficas y llevan su
etiqueta textual accesible al lado.

## Tipografía

| Rol | Familia | Uso |
|---|---|---|
| Títulos | Cormorant Garamond (`var(--font-serif)`) | `h1`–`h3`, cita de reseña |
| Texto | Inter (`var(--font-sans)`) | Todo lo demás |

## Clases de composición ya definidas

| Clase | Qué hace |
|---|---|
| `.section` | `max-w-6xl`, `px-6`, `py-20 md:py-28` |
| `.eyebrow` | Rótulo pequeño, versalita, `tracking-widest2`, color `bronce` |
| `.h-section` | Título de sección serif responsivo |
| `.btn` `.btn-primary` `.btn-gold` `.btn-outline` | Botones de píldora |

## Patrón de tarjeta (el que sigue `ReviewCard`)

Copiado del `figure` que hoy usa `Testimonials`, para que la sección nueva no desentone:

```
rounded-2xl border border-carbon/10 bg-white/50 p-7
```

Cita en `text-carbon/80`, autor en `font-medium text-carbon`, metadatos secundarios en
`text-carbon/70`. Comilla decorativa serif en `text-dorado`.

## Movimiento

`animate-fadeUp` existe y respeta `prefers-reduced-motion` a través de las reglas de
`globals.css`. La sección de reseñas no añade animación propia.

## Modo claro / oscuro

**No hay modo oscuro.** El sitio es de un solo tema, deliberadamente: paleta cálida de
marfil y carbón. La sección de reseñas no introduce tokens ni variantes nuevas.
