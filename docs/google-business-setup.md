# Conectar Google Business Profile — guía de puesta en marcha

Esto es lo que hay que hacer **fuera del código** para que `npm run reviews:fetch` traiga
reseñas de verdad. Hoy nada de esto existe (bloqueantes B-01 y B-02 del `task_tracker`).

El proyecto funciona sin completar esta guía: `data/reviews.json` se rellena a mano y la
web se comporta igual. Esto solo automatiza el relleno.

---

## Paso 1 — Crear la ficha de empresa

1. Entra en **business.google.com** con la cuenta de Google que vaya a ser la propietaria.
   Esa cuenta es la que después autoriza el OAuth: elígela pensando en quién quieres que
   tenga el control dentro de tres años.
2. Categoría principal sugerida: **«Músico»**. Secundarias: «Servicio de música para
   eventos», «Servicios para bodas».
3. **Tipo «área de servicio», sin dirección pública.** Un músico se desplaza; no hay local
   que visitar. Google pide una dirección para verificar, pero permite ocultarla y mostrar
   solo la zona de cobertura.
4. Zona de servicio: la que corresponda (por ejemplo, Comunidad de Madrid + provincias
   limítrofes). Tiene que ser coherente con `site.city` y `site.region` en
   `src/config/site.ts`, porque el JSON-LD ya publica esos valores.

## Paso 2 — Verificar la ficha

Google elige el método: correo postal con código (5–14 días), vídeo grabado, teléfono o
correo electrónico. **Hasta que la ficha no esté verificada, la API no devuelve nada.**

Al terminar, anota la URL pública de reseñas de la ficha — es el `GBP_PROFILE_URL` al que
apuntarán todos los enlaces de atribución de la web.

## Paso 3 — Proyecto en Google Cloud y APIs

1. **console.cloud.google.com** → proyecto nuevo (por ejemplo `web-musica-reviews`).
2. Anota el **número de proyecto**: hace falta en el paso 4.
3. Habilita estas API en la biblioteca:
   - *My Business Account Management API* — descubrir la cuenta
   - *My Business Business Information API* — descubrir la ubicación
   - *Google My Business API* (la v4 legacy) — **la única que devuelve reseñas**

## Paso 4 — Solicitar la cuota (esto es lo que tarda)

Las API de Business Profile llegan con **cuota cero**. Hay que rellenar el formulario de
solicitud de acceso de Google indicando el número de proyecto, el sitio web y para qué se
van a usar los datos.

- Se encuentra desde la documentación oficial de Business Profile APIs, en el apartado de
  requisitos previos («Request API access» / «Basic setup»).
- Respuesta habitual: **de varios días a varias semanas**.
- Mientras no esté aprobada, cualquier llamada devuelve **403**. Es el fallo esperado y el
  CLI lo dice con esas palabras, apuntando a este documento.

## Paso 5 — Credenciales OAuth

1. *Pantalla de consentimiento de OAuth*: tipo **Externo**; añade el scope
   `https://www.googleapis.com/auth/business.manage`; añade tu propia cuenta como **usuario
   de prueba** (así no hace falta pasar la verificación de Google para uso propio).
2. *Credenciales* → **ID de cliente de OAuth** → tipo **Aplicación de escritorio**.
3. Guarda `client_id` y `client_secret`.

## Paso 6 — Obtener el refresh token

El token que hay que conseguir es el de **refresco**, no el de acceso: el de acceso caduca
en una hora, el de refresco dura hasta que se revoque.

Con OAuth 2.0 Playground (`developers.google.com/oauthplayground`):

1. Rueda dentada → *Use your own OAuth credentials* → pega `client_id` y `client_secret`.
2. En el paso 1, escribe el scope a mano: `https://www.googleapis.com/auth/business.manage`.
3. Autoriza con la cuenta propietaria de la ficha.
4. *Exchange authorization code for tokens* → copia el **refresh token**.

> Añade `https://developers.google.com/oauthplayground` como URI de redirección autorizada
> en tu cliente OAuth, o el intercambio fallará con `redirect_uri_mismatch`.

## Paso 7 — Descubrir los identificadores de la ficha

Con un access token válido:

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  https://mybusinessaccountmanagement.googleapis.com/v1/accounts
# → accounts[].name = "accounts/123456789"

curl -s -H "Authorization: Bearer $TOKEN" \
  "https://mybusinessbusinessinformation.googleapis.com/v1/accounts/123456789/locations?readMask=name,title"
# → locations[].name = "locations/987654321"
```

## Paso 8 — Rellenar `.env`

```bash
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=1//...
GBP_ACCOUNT_ID=123456789
GBP_LOCATION_ID=987654321
GBP_PROFILE_URL=https://...
```

`.env` está en `.gitignore` y ahí se queda. En el CI van como secretos del repositorio.

## Paso 9 — Sincronizar

```bash
npm run reviews:fetch -- --dry   # enseña lo que traería, no escribe
npm run reviews:fetch            # escribe data/reviews.json
git diff data/reviews.json       # revisa antes de commitear
```

---

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| `403` en la llamada de reseñas | Cuota no aprobada (paso 4) o la cuenta no es propietaria de la ficha | Esperar la aprobación; comprobar el rol en la ficha |
| `400 invalid_grant` | Refresh token revocado, o la app sigue en modo prueba y caducó a los 7 días | Regenerar el token (paso 6). Para uso propio, mantente como usuario de prueba y regenera cuando haga falta |
| `redirect_uri_mismatch` | Falta la URI del Playground en el cliente OAuth | Añadirla en Credenciales |
| `404` en `/v4/...` | `accountId` o `locationId` mal | Repetir el paso 7 |
| Reseñas vacías con ficha verificada | La ficha aún no tiene reseñas | No es un fallo: la sección se queda oculta |

## Cuando esto esté hecho

Se cierran B-01 y B-02 en `implementation/task_tracker.md`, y `M1-UJ-004` pasa de «probado
con fixtures» a «ejercitado contra la API real». Anótalo en `docs/work_log.md`: es la
diferencia entre código que debería funcionar y código que ha funcionado.
