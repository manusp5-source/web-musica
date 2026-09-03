# Requisitos no funcionales — web-musica

---

## Rendimiento

Sitio estático: el coste está en el peso, no en el servidor.

| Métrica | Objetivo | Estado |
|---|---|---|
| Peso de JS añadido por la sección de reseñas | **0 KB** — es Server Component | Exigible desde `M1-UJ-001` |
| Tamaño de `data/reviews.json` | < 100 KB (≈ 300 reseñas) | Con más, se recorta a las 100 últimas en el mapper |
| Tiempo de `npm run build` | < 90 s en local | Medir en `M0-IT-005` |
| LCP / CLS / INP | **No auditados en esta tanda** | Fuera de alcance. El hero 3D es el sospechoso obvio |

`three` + `@react-three/fiber` son con diferencia lo más pesado del sitio. Ya se desactivan
solos en móvil y con `prefers-reduced-motion`. Auditarlo es trabajo de un intent posterior.

## Seguridad

| Aspecto | Regla |
|---|---|
| Autenticación | La web no tiene usuarios ni sesiones. El único secreto es el OAuth del CLI |
| Cifrado en tránsito | HTTPS con HSTS `max-age=63072000; includeSubDomains; preload` |
| Cabeceras | CSP estricta, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` con cámara, micrófono y geolocalización a cero |
| CSP | Se amplía **solo** con hosts concretos. Cada origen nuevo, justificado en el diff |
| Imágenes remotas | `remotePatterns` sin comodines: un `**` convierte `/_next/image` en proxy abierto (SSRF) |
| Inyección | El texto de las reseñas se renderiza como texto; en el JSON-LD, con el escape de `<` que ya existe. Test con carga maliciosa obligatorio |
| Rate limiting | No aplica en el sitio. En el CLI, tope de 20 páginas por sincronización |
| Cumplimiento | LSSI art. 10, RGPD art. 13, RDL 24/2021 (Omnibus), términos de Google sobre reseñas |

**Niveles de credencial:** nivel 1 `.env` (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
`GOOGLE_REFRESH_TOKEN`) · nivel 2 secretos del CI y variables de entorno del build ·
nivel 3 no aplica (no hay panel de administración).

## Accesibilidad

| Aspecto | Objetivo en esta tanda |
|---|---|
| Estrellas | Decorativas con `aria-hidden`, más texto alternativo «4 de 5 estrellas» |
| Semántica | `<blockquote>` + `<cite>` + `<time dateTime>` en cada reseña |
| Contraste | Texto acentuado en `bronce` (`#7A5F2E`), nunca en `dorado` claro |
| Foco e imágenes | `alt` significativo o vacío en avatares según sean informativos o decorativos |
| WCAG completo | **No auditado.** Fuera de alcance, anotado como hueco en los evals |

## Observabilidad

| Qué | Dónde |
|---|---|
| Fallos de validación de `reviews.json` | Salida de `next build`, con el campo que falla |
| Resultado de la sincronización | `stdout` del CLI: número de reseñas, media, fichero escrito |
| Fallos de la API | `stderr` con código HTTP y acción sugerida |
| **Lo que nunca se registra** | `client_secret`, `refresh_token`, `access_token`, ni completos ni truncados |
| Analítica de visitantes | No hay. `cookies.analyticsEnabled` está en `false` y por eso el banner no aparece |

## Escalabilidad

No aplica en el sentido habitual: HTML estático servido por CDN. El único límite real es el
tamaño del JSON de reseñas, acotado arriba, y la cuota de la API de Google, que con una
sincronización diaria queda a varios órdenes de magnitud de distancia.

## Copias de seguridad y recuperación

| Activo | Copia | RPO / RTO |
|---|---|---|
| Código | Repo privado en GitHub (`M0-IT-002`) | Cada push |
| `data/reviews.json` | Versionado en git — cada sincronización deja un diff | Cualquier estado anterior recuperable |
| Credenciales OAuth | **No hay copia.** Se regeneran desde Google Cloud Console | Regenerables, no recuperables |

**Nada es irrecuperable en este proyecto** — a diferencia de `eskailet-crm` y compañía, aquí
no hay `ENCRYPTION_KEY` ni datos cifrados. El peor caso es regenerar el refresh token.
