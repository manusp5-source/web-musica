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

**El reloj del Paso 4 empieza aquí, no antes.** Google exige la ficha verificada y activa
**60 días o más** antes de aceptar la solicitud de acceso a la API — confirmado contra la
documentación oficial (`developers.google.com/my-business/content/prereqs`, 17 sep 2026).
No es tiempo de revisión, es una espera obligatoria previa. Verifica la ficha cuanto antes,
aunque el resto de esta guía (Pasos 3, 5 y 6) se pueda avanzar en paralelo mientras corren
los 60 días.

## Paso 3 — Proyecto en Google Cloud y APIs

1. **console.cloud.google.com** → proyecto nuevo (por ejemplo `web-musica-reviews`).
2. Anota el **número de proyecto**: hace falta en el paso 4.
3. Habilita estas API en la biblioteca:
   - *My Business Account Management API* — descubrir la cuenta
   - *My Business Business Information API* — descubrir la ubicación
   - *Google My Business API* (la v4 legacy) — **la única que devuelve reseñas**

## Paso 4 — Solicitar la cuota (esto es lo que tarda)

Las API de Business Profile llegan con **cuota cero**. Requisito previo, aparte del Paso 2:
ficha verificada y activa 60+ días, con la información completa y la web ya enlazada en
la ficha.

1. **Número de proyecto** (no el Project ID): Google Cloud Console → el proyecto → tarjeta
   *Dashboard*.
2. **Formulario real**: `support.google.com/business/contact/api_default` — en el
   desplegable, **"Application for Basic API Access"**. Pide número de proyecto, sitio web
   y el uso concreto (ej. "sincronizar reseñas verificadas al sitio web del negocio").
3. **Cuenta correcta**: el email de la solicitud tiene que ser el que figura como
   propietario/gestor de la ficha — con otra cuenta, riesgo de rechazo sin explicación.
4. Respuesta por email: **de varios días a varias semanas**, aparte de los 60 días del
   Paso 2.
5. **Comprobar el estado sin esperar el email**: Cloud Console → el proyecto → *Cuotas* →
   las cuotas de las Business Profile APIs. `0 QPM` = todavía no aprobado. `300 QPM` =
   aprobado, seguir al Paso 5.

Mientras no esté aprobada, cualquier llamada devuelve **403**. Es el fallo esperado y el
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
