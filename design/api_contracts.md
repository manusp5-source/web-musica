# Contratos de API — web-musica

Este proyecto **no expone ninguna API propia**: es un sitio estático. Los contratos que
importan son dos: el de la API externa de Google que se consume desde Node, y el de los
módulos internos que consume la web.

---

## 1. Google — OAuth 2.0

### Renovar el access token

```
POST https://oauth2.googleapis.com/token
Content-Type: application/x-www-form-urlencoded

client_id={GOOGLE_CLIENT_ID}
client_secret={GOOGLE_CLIENT_SECRET}
refresh_token={GOOGLE_REFRESH_TOKEN}
grant_type=refresh_token
```

**200** → `{ "access_token": "ya29...", "expires_in": 3599, "scope": "...", "token_type": "Bearer" }`
**400 `invalid_grant`** → el refresh token está revocado o caducado. Mensaje al operador:
regenerar credenciales siguiendo `docs/google-business-setup.md`. Exit ≠ 0, fichero intacto.

Scope necesario: `https://www.googleapis.com/auth/business.manage`
El access token vive ~1 h; no se persiste en ningún sitio, se pide en cada ejecución.

## 2. Google Business Profile — reseñas

Las reseñas siguen viviendo en la **API v4 legacy**; las API v1 modernas
(`mybusinessaccountmanagement`, `mybusinessbusinessinformation`) sirven para descubrir la
cuenta y la ubicación, pero no devuelven reseñas.

### Descubrimiento (una vez, se anota en `.env`)

| Método | URL | Devuelve |
|---|---|---|
| GET | `https://mybusinessaccountmanagement.googleapis.com/v1/accounts` | `accounts[].name` = `accounts/{accountId}` |
| GET | `https://mybusinessbusinessinformation.googleapis.com/v1/{account}/locations?readMask=name,title` | `locations[].name` = `locations/{locationId}` |

### Lectura de reseñas (cada sincronización)

```
GET https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews
    ?pageSize=50&orderBy=updateTime desc
Authorization: Bearer {access_token}
```

**200**

```jsonc
{
  "reviews": [
    {
      "reviewId": "AbFvOq...",
      "reviewer": {
        "displayName": "Laura M.",
        "profilePhotoUrl": "https://lh3.googleusercontent.com/...",
        "isAnonymous": false
      },
      "starRating": "FIVE",            // ONE | TWO | THREE | FOUR | FIVE | STAR_RATING_UNSPECIFIED
      "comment": "Tocó en nuestra boda...",
      "createTime": "2026-06-14T18:22:03.123Z",
      "updateTime": "2026-06-14T18:22:03.123Z",
      "reviewReply": { "comment": "Gracias...", "updateTime": "..." },
      "name": "accounts/1/locations/2/reviews/AbFvOq..."
    }
  ],
  "averageRating": 4.9,
  "totalReviewCount": 23,
  "nextPageToken": "..."
}
```

| Código | Significado | Qué hace el CLI |
|---|---|---|
| 200 | OK | Mapea, valida, escribe |
| 401 | Token inválido | Reintenta una vez renovando el token; si vuelve a fallar, aborta |
| 403 | **Cuota de API no aprobada** o sin permiso sobre la ficha | Mensaje explícito apuntando a `docs/google-business-setup.md`. Es el fallo esperado hoy |
| 404 | `accountId`/`locationId` mal | Aborta con el valor recibido en el mensaje |
| 429 | Cuota por minuto agotada | Un reintento con espera; después aborta |
| 5xx | Google | Un reintento; después aborta conservando el snapshot |

**Paginación:** mientras haya `nextPageToken` se sigue pidiendo, con un tope duro de 20
páginas (1.000 reseñas) para que un bucle roto no se coma la cuota.

### Mapeo v4 → esquema propio

| Origen | Destino | Transformación |
|---|---|---|
| `reviewId` | `id` | directo |
| `reviewer.displayName` | `author` | `"Anónimo"` si `isAnonymous` |
| `reviewer.profilePhotoUrl` | `avatarUrl` | `null` si falta |
| `starRating` | `rating` | `{ONE:1,…,FIVE:5}`; `STAR_RATING_UNSPECIFIED` → se descarta la reseña |
| `comment` | `text` | `""` si falta. **Sin editar, sin recortar** |
| `createTime` | `createdAt` | directo |
| `reviewReply` | `reply` | `{ text, repliedAt }` o `null` |
| `averageRating` | `aggregate.rating` | redondeo a 1 decimal |
| `totalReviewCount` | `aggregate.count` | directo, **sin recortar** al número mostrado |

## 3. Contratos internos

### `src/lib/reviews/schema.ts`

```ts
export const reviewsFileSchema: z.ZodType<ReviewsFile>
export type ReviewsFile
export type Review
export const EMPTY_REVIEWS: ReviewsFile   // el snapshot vacío válido
```

### `src/lib/reviews/load.ts` — server-only

```ts
loadReviews(): ReviewsFile
```
Nunca lanza. Fichero ausente, JSON inválido o esquema incumplido → registra el motivo en el
log de build y devuelve `EMPTY_REVIEWS`.

```ts
visibleReviews(file: ReviewsFile, limit = 6): Review[]
```
Las `limit` más recientes, sin filtrar por puntuación (principio 4 de la constitución).

### `src/lib/reviews/jsonld.ts`

```ts
buildRatingJsonLd(file: ReviewsFile): { aggregateRating?, review? }
```
Devuelve `{}` si `count === 0`: un `aggregateRating` en cero es peor que ninguno.

### `src/lib/reviews/google.ts` — solo Node

```ts
fetchAccessToken(env): Promise<string>
fetchReviews(token, locationPath): Promise<RawReview[]>
mapToSchema(raw, meta): ReviewsFile
```
Sin efectos de escritura: quien escribe el fichero es el CLI, para que los tests puedan
ejercitar el mapeo sin tocar el disco.

### `scripts/fetch-reviews.mjs`

```bash
npm run reviews:fetch            # sincroniza y sobrescribe data/reviews.json
npm run reviews:fetch -- --dry   # imprime lo que escribiría, no toca el fichero
```
Exit 0 solo si escribió un fichero válido. Cualquier fallo: exit ≠ 0, `data/reviews.json`
intacto, mensaje accionable.

## Variables de entorno

| Variable | Nivel | Dónde | Uso |
|---|---|---|---|
| `GOOGLE_CLIENT_ID` | 1 | `.env` local · secreto de CI | OAuth |
| `GOOGLE_CLIENT_SECRET` | 1 | ídem | OAuth |
| `GOOGLE_REFRESH_TOKEN` | 1 | ídem | OAuth |
| `GBP_ACCOUNT_ID` | 2 | `.env` | Ruta de la ficha |
| `GBP_LOCATION_ID` | 2 | `.env` | Ruta de la ficha |
| `GBP_PROFILE_URL` | 2 | `.env` | Enlace público de atribución |
| `NEXT_PUBLIC_HERO3D` | 2 | entorno de e2e | `off` desactiva el hero 3D en los tests |

`.env` ya está en `.gitignore`. Ninguna de estas variables lleva prefijo `NEXT_PUBLIC_`
salvo la última, que es la única que puede llegar al navegador — y no es un secreto.
