# User Journeys — web-musica

---

## M1-UJ-001: Visitante ve las reseñas en la home ES

**Milestone:** M1 · **Actor:** visitante · **Trigger:** abre `/`
**Precondiciones:** `data/reviews.json` existe y es válido; el sitio se construyó con él

### Camino feliz
1. El visitante llega a la home y baja hasta después de «Proceso».
2. Ve la cabecera de agregado: estrellas, media (`4,9`) y total (`23 reseñas en Google`).
3. Ve hasta 6 tarjetas, las más recientes primero, cada una con avatar o iniciales, nombre,
   estrellas, fecha y texto.
4. Lee la nota: «Reseñas publicadas en Google por clientes reales. Se muestran todas, sin
   filtrar ni editar.»
5. Pulsa «Ver todas en Google» y aterriza en la ficha.

### Caminos de error
- `data/reviews.json` **no existe** → la sección no se renderiza; el resto de la home
  intacto; aviso en el log de build.
- JSON **corrupto o fuera de esquema** → igual que el anterior, con el motivo en el log.
- `reviews: []` pero `count > 0` → se muestra solo la cabecera de agregado con el enlace.
- Reseña **sin texto** → tarjeta con estrellas, autor y fecha, sin cita. No se descarta.
- `avatarUrl` **nunca se pinta**, esté roto, ausente o perfectamente válido: siempre van
  iniciales sobre círculo dorado (DEC-011, 5 sep 2026). El campo se sigue guardando en el
  fichero por si algún día se decide lo contrario.
- Texto muy largo → recorte **visual** con `line-clamp`; el dato no se toca.

### Criterios de aceptación
- [ ] Con el fixture de 3 reseñas, la home ES renderiza 3 tarjetas con autor, estrellas,
      fecha y texto.
- [ ] Con `reviews: []` y `count: 0`, en el HTML generado no aparece ningún rastro de la
      sección (ni el rótulo «Opiniones»).
- [ ] Con un JSON corrupto, `npm run build` **termina en verde** y la sección no aparece.
- [ ] Las tarjetas salen ordenadas por `createdAt` descendente.
- [ ] Una reseña con `text: ""` se renderiza sin `<blockquote>` vacío.
- [ ] Cero JavaScript de cliente añadido por esta sección (es Server Component).

### Checklist de seguridad
- [ ] El texto de la reseña se renderiza como texto, nunca con `dangerouslySetInnerHTML`.
- [ ] **No se muestran avatares** (DEC-011), así que `lh3.googleusercontent.com` NO está
      en `remotePatterns` y no debe estarlo. Si alguien reintroduce la foto, tiene que
      abrir `remotePatterns` **sin comodines** y la CSP a la vez — hay un test que se pone
      rojo si se pinta un `<img>` en la sección.
- [ ] `load.ts` es server-only: no puede importarse desde un componente de cliente.
- [ ] Ningún dato del fichero llega al cliente más allá de lo renderizado.

---

## M1-UJ-002: Visitante ve las reseñas en `/en`

**Milestone:** M1 · **Actor:** visitante internacional · **Trigger:** abre `/en`
**Precondiciones:** las de `M1-UJ-001`

### Camino feliz
1. Igual que en ES, con rótulos, nota de verificación y CTA en inglés.
2. **El texto de cada reseña aparece en su idioma original.** Una reseña en español sigue
   en español dentro de la versión inglesa.
3. La fecha se formatea con la convención inglesa (`Jun 2026`).

### Caminos de error
- Los mismos que `M1-UJ-001`, con los mismos resultados.

### Criterios de aceptación
- [ ] `/en` muestra `Reviews` / `What my clients say` / `See all on Google`.
- [ ] Una reseña en español aparece **sin traducir** en `/en`.
- [ ] El formato de fecha cambia entre `/` y `/en`.
- [ ] Ambas rutas leen el mismo `data/reviews.json` — no hay dos fuentes.

### Checklist de seguridad
- [ ] Las mismas comprobaciones de `M1-UJ-001` aplican a la raíz inglesa.

---

## M1-UJ-003: Google puede mostrar estrellas (JSON-LD)

**Milestone:** M1 · **Actor:** Googlebot · **Trigger:** rastrea la home
**Precondiciones:** `aggregate.count > 0`

### Camino feliz
1. El bot lee el `<script type="application/ld+json">` de la home.
2. Encuentra `MusicGroup` + `LocalBusiness` con `aggregateRating` (`ratingValue`,
   `reviewCount`) y hasta 6 objetos `review` con `author`, `reviewRating` y `datePublished`.
3. Los valores coinciden con lo que se ve en la página.

### Caminos de error
- `count === 0` → **no se emite `aggregateRating`**. Un rating a cero es peor que ninguno.
- Reseña con texto que contiene `</script>` → el escape defensivo de `<` ya existente en
  `HomePage.tsx` lo neutraliza.

### Criterios de aceptación
- [ ] Con datos, el JSON-LD contiene `aggregateRating.ratingValue` y `.reviewCount`
      idénticos a `aggregate`.
- [ ] Sin datos, la clave `aggregateRating` no existe en el JSON-LD.
- [ ] Un fixture con `</script>` en el texto no rompe el HTML generado.
- [ ] El JSON-LD sigue siendo `JSON.parse`-able tras el escape.

### Checklist de seguridad
- [ ] Inyección de HTML por el texto de una reseña: cubierta por test con carga maliciosa.
- [ ] No se publica en el JSON-LD ningún dato que no esté ya visible en la página.

---

## M1-UJ-004: Manuel sincroniza las reseñas

**Milestone:** M1 · **Actor:** Manuel (operador) · **Trigger:** `npm run reviews:fetch`
**Precondiciones:** `.env` con credenciales OAuth y los IDs de la ficha

### Camino feliz
1. Ejecuta `npm run reviews:fetch`.
2. El CLI canjea el refresh token por un access token.
3. Pide las reseñas paginando hasta agotar `nextPageToken` (tope duro de 20 páginas).
4. Mapea al esquema propio, valida con Zod.
5. Sobrescribe `data/reviews.json` e imprime: `23 reseñas · media 4,9 · escrito`.
6. Manuel revisa el diff y commitea.

### Caminos de error
- **Sin `.env`** → mensaje que nombra las variables que faltan; exit ≠ 0; fichero intacto.
- **`invalid_grant`** (401/400) → «el refresh token está revocado, regenéralo con
  `docs/google-business-setup.md`»; exit ≠ 0.
- **403 cuota no aprobada** → mensaje que apunta al documento de setup. Es el fallo
  esperado hoy.
- **429 / 5xx** → un reintento y, si persiste, aborta conservando el snapshot.
- **La respuesta no valida** → no se escribe nada. Nunca un fichero a medias.
- `--dry` → imprime lo que escribiría y no toca el disco.

### Criterios de aceptación
- [ ] Con fixtures, el mapper produce un `ReviewsFile` que valida contra el esquema.
- [ ] `STAR_RATING_UNSPECIFIED` se descarta y no cuenta en la lista.
- [ ] `isAnonymous: true` produce `author: "Anónimo"`.
- [ ] Un fixture de dos páginas produce las reseñas de ambas, sin duplicados.
- [ ] Sin variables de entorno, exit ≠ 0 y `data/reviews.json` no cambia (comprobado por
      hash antes y después).
- [ ] `--dry` no modifica el fichero.
- [ ] `npm run build` funciona **sin ninguna credencial presente**.

### Checklist de seguridad
- [ ] `client_secret` y `refresh_token` no aparecen en ninguna salida por consola, ni
      siquiera en los mensajes de error.
- [ ] `grep -r "refresh_token\|client_secret" .next/` tras un build de producción: 0
      resultados (eval `EV-006`).
- [ ] `google.ts` no se importa desde ningún componente ni desde `app/`.
- [ ] `.env` sigue en `.gitignore`; se añade `.env.example` sin valores.

---

## M1-UJ-005: La sección cumple Omnibus y RGPD

**Milestone:** M1 · **Actor:** visitante / autoridad de consumo · **Trigger:** abre la home
o la política de privacidad

### Camino feliz
1. Junto a las reseñas lee de dónde salen y que se muestran todas, sin filtrar ni editar.
2. Cada reseña lleva el nombre de su autor y enlaza a Google.
3. En la política de privacidad encuentra un apartado que explica que se publican nombre,
   foto y texto de reseñas ya públicas en Google, con qué base jurídica y cómo pedir la
   retirada.
4. Lo mismo, en inglés, en `/en/privacy`.

### Caminos de error
- Alguien pide retirar su reseña de la web → se documenta el procedimiento: se elimina del
  snapshot y, si vuelve a entrar por sincronización, se añade a una lista de exclusión
  **por petición del interesado**, que es motivo legítimo y no un filtro comercial.

### Criterios de aceptación
- [ ] `reviews.disclosure` aparece en el HTML de `/` y de `/en`.
- [ ] Existe un apartado de reseñas en `/privacidad` y en `/en/privacy`.
- [ ] Ninguna reseña se muestra sin nombre de autor y sin enlace a la fuente.
- [ ] No existe en el código ningún filtro por puntuación (comprobado por test que busca
      comparaciones sobre `rating` en la ruta de render).
- [ ] La lista de exclusión, si se implementa, solo se alimenta de peticiones de
      interesados y queda documentada en `docs/decision_log.md`.

### Checklist de seguridad
- [ ] Datos personales publicados: solo los ya públicos en Google (nombre, foto, texto).
- [ ] Vía de contacto para ejercer derechos: la que ya existe en `site.legal.privacyEmail`.
- [ ] Nada de correos electrónicos, teléfonos ni identificadores internos de reseñador en
      el fichero ni en el HTML.
