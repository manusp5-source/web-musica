# Modelo de datos — web-musica

No hay base de datos. La única entidad persistida es el fichero `data/reviews.json`, que
es **el contrato entre la integración con Google y toda la web**.

---

## Entidad `ReviewsFile` — raíz de `data/reviews.json`

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `schemaVersion` | `1` | sí | Entero. Si el esquema cambia, sube y `load.ts` sabe rechazar lo viejo |
| `source` | `"google-business-profile" \| "manual"` | sí | Se muestra al visitante en la nota de verificación (Omnibus) |
| `fetchedAt` | string ISO 8601 | sí | Fecha de la última sincronización o edición manual |
| `profileUrl` | string url \| `null` | sí | Página pública de reseñas de la ficha. **Destino de todos los enlaces de atribución** |
| `aggregate` | `Aggregate` | sí | Ver abajo |
| `reviews` | `Review[]` | sí | Puede estar vacío. Vacío = sección oculta |

## Entidad `Aggregate`

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `rating` | number 1–5, 1 decimal | sí | `averageRating` de la API. `0` si no hay reseñas |
| `count` | entero ≥ 0 | sí | `totalReviewCount`. **Es el total de la ficha**, puede ser mayor que `reviews.length` |

> **Regla de coherencia:** el JSON-LD publica `ratingValue: aggregate.rating` y
> `reviewCount: aggregate.count`. Declarar un total distinto del real es motivo de sanción
> manual de Google. `count` nunca se recorta al número de reseñas mostradas.

## Entidad `Review`

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `id` | string | sí | `reviewId` de la API. Clave de deduplicación y `key` de React |
| `author` | string | sí | `reviewer.displayName`. Si `reviewer.isAnonymous`, se guarda `"Anónimo"` |
| `avatarUrl` | string url \| `null` | sí | `reviewer.profilePhotoUrl`, siempre en `lh3.googleusercontent.com` |
| `rating` | entero 1–5 | sí | Mapeado del enum `ONE…FIVE`. `STAR_RATING_UNSPECIFIED` → la reseña se descarta |
| `text` | string | sí | `comment`, sin editar. **Cadena vacía = reseña de solo estrellas** |
| `lang` | string BCP-47 \| `null` | no | Detectado o anotado a mano. Solo informativo: no se traduce |
| `createdAt` | string ISO 8601 | sí | `createTime` |
| `url` | string url \| `null` | no | **La API v4 no devuelve enlace por reseña.** Se deja `null` y la atribución apunta a `profileUrl` |
| `reply` | `{ text, repliedAt }` \| `null` | no | Respuesta del titular. Se guarda pero **no se muestra** en esta tanda |

## Relaciones

Plano y sin relaciones: un fichero contiene un agregado y una lista. No hay identidad de
usuario, ni sesiones, ni escritura desde la web. La única escritura la hace
`scripts/fetch-reviews.mjs` desde la línea de comandos.

## Invariantes que el esquema hace cumplir

1. `reviews` sin duplicados por `id`.
2. Orden garantizado: `createdAt` descendente. Lo impone el mapper, no el consumidor.
3. `aggregate.count >= reviews.length`.
4. `aggregate.rating === 0` si y solo si `reviews` está vacío **y** `count === 0`.
5. `rating` es entero de 1 a 5; cualquier otra cosa invalida el fichero entero.
6. `text` puede ser `""`, nunca `null` — así el componente no necesita dos comprobaciones.

## Snapshot inicial

```json
{
  "schemaVersion": 1,
  "source": "manual",
  "fetchedAt": "2026-09-03T00:00:00.000Z",
  "profileUrl": null,
  "aggregate": { "rating": 0, "count": 0 },
  "reviews": []
}
```

Válido y vacío: el sitio construye, la sección no se renderiza y el JSON-LD sale sin
`aggregateRating`. Es exactamente el estado de hoy, pero ahora es explícito y está probado.

## Limitación conocida de la fuente

La API v4 **no expone un enlace público a cada reseña individual** (`name` es un
identificador interno, no una URL navegable). Por eso `url` es opcional y la atribución
apunta a la página de reseñas de la ficha. Si en el futuro se detecta un enlace estable por
reseña, se rellena `url` y el componente ya lo usa: la lógica está escrita para preferir
`review.url` y caer a `profileUrl`.
