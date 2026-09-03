# Intent — Reseñas de Google automáticas y método FactorIA sobre la web del músico

```
ID      : INT-001
Fecha   : 2026-09-03
Autor   : Manuel
Estado  : aprobado
Origen  : manual
```

> **Este fichero va antes que el diseño y antes del gate `APROBADO`.** Implementar dejó de
> ser el cuello de botella; especificar es el nuevo.

---

## Problema

La web (Next.js 15, ES/EN, hero 3D) está construida y no publicada. Hoy duelen tres cosas
observables:

1. **La prueba social no existe.** `Testimonials` en `src/components/Sections.tsx:155` se
   oculta sola porque `dict.testimonials.items` está vacío en los dos idiomas. Un músico
   de eventos se contrata por confianza, y la página no enseña ninguna. Las reseñas reales
   viven en Google y nadie las copia a mano — ni las copiaría cada vez que entra una nueva.
2. **El proyecto no tiene método ni red de seguridad.** Git existía **sin un solo commit**:
   todo el trabajo estaba untracked y un `git clean` se lo llevaba. Sin tests, sin evals,
   sin CI, sin `design/` ni `task_tracker`. Cualquier cambio se verificaba mirando la pantalla.
3. **No se puede publicar tal cual.** `site.legal` sigue con `[NOMBRE Y APELLIDOS]`,
   `[NIF / DNI]` y `[Dirección postal completa]`; el dominio es `https://tunombre.es`, el
   WhatsApp `+34 600 000 000` y los tres `youtubeIds` están vacíos.

## Resultado propuesto

La web muestra las reseñas reales de Google del perfil del músico, actualizadas solas sin
que nadie toque código: un script de build autenticado contra Google Business Profile API
escribe `data/reviews.json`, la sección de reseñas lo pinta con la atribución que exige
Google, y el JSON-LD publica `AggregateRating` para que las estrellas puedan salir en el
buscador.

Y el proyecto pasa a estar bajo el método FactorIA: intent, `design/`, `planning/`,
`implementation/task_tracker.md` con Skill y Model por tarea, evals que se ejecutan, CI en
verde y un historial de git que empieza a existir.

## Sistemas afectados

| Qué | Cómo se toca |
|---|---|
| `Desktop/web-musica/` (antes `Página web música/`) | Renombrado, estructura FactorIA, primer commit, rama |
| `src/components/Sections.tsx` → `Testimonials` | Sustituido por `src/components/Reviews.tsx`, que lee `data/reviews.json` |
| `src/i18n/dictionaries.ts` | `testimonials.items` deja de ser la fuente de datos; quedan solo los rótulos |
| `src/components/HomePage.tsx` | JSON-LD gana `aggregateRating` + `review` |
| `next.config.mjs` | `remotePatterns` para avatares de `lh3.googleusercontent.com` |
| **Google Business Profile API (v4)** | Integración externa nueva, OAuth de propietario |
| GitHub | Repo privado nuevo + Actions |

## Restricciones

- **Coste cero o casi.** Cloudflare Pages gratis (fuera de esta tanda); Vercel Hobby
  prohibido por uso comercial.
- **La API no puede ser el camino crítico.** El contrato es `data/reviews.json`; el
  fetcher es intercambiable. Sin ficha ni cuota aprobada, el fichero se rellena a mano.
- **Ningún secreto en el repo.** `client_id`, `client_secret` y `refresh_token` son
  nivel 1 (`.env`, ignorado) en local y nivel 2 (secretos de CI) en GitHub. Jamás llegan al
  cliente: el fetch ocurre en build.
- **Normativa española de reseñas (Directiva Omnibus, RDL 24/2021).** Hay que indicar si se
  verifica que provienen de clientes reales; mostrar solo las positivas ocultando las
  negativas es práctica desleal tipificada. **Decidido: se muestran todas, sin filtro.**
- **RGPD.** Nombre y foto del reseñador son datos personales ya públicos en Google; se
  publican con atribución y enlace al original, y la política de privacidad lo menciona.
- **Términos de Google.** Atribución obligatoria, enlace a la reseña, texto sin alterar, sin
  mezclar con reseñas de otras fuentes.
- La web es estática: nada de servidor en runtime, nada de ISR. Todo se resuelve en build.
- CSP estricta ya existente: cualquier origen nuevo se añade explícitamente.

## Qué NO entra

- **Responder reseñas desde la web.** La API lo permite; aquí es solo lectura.
- **Widget de terceros** (Elfsight, Trustindex, EmbedSocial). De pago y rompe la CSP.
- **Recolección de reseñas propias** (formulario post-evento, invitaciones por email).
- **Reseñas de otras fuentes** (Bodas.net, Facebook, Trustpilot).
- **Traducción automática de las reseñas al inglés.** Se muestran en su idioma original.
- Rediseño visual, CMS, blog, reserva online, pasarela de pago.
- **Fuera de esta tanda** (decidido en discovery, 3 sep 2026): deploy real en Cloudflare
  Pages, Deploy Hook + Cron Trigger, rellenar datos legales y de contacto reales,
  auditoría de rendimiento y accesibilidad, SEO local por ciudades.

## Criterio de éxito

- [ ] `git log` devuelve al menos un commit y el árbol de trabajo está limpio.
- [ ] `npm run build` pasa en limpio con la sección de reseñas activa.
- [ ] Con `data/reviews.json` sin reseñas, la sección no se renderiza y la página no rompe.
- [ ] Con datos, la home ES y `/en` muestran nombre del autor, estrellas, fecha y enlace.
- [ ] El JSON-LD valida con `aggregateRating` coherente con lo mostrado.
- [ ] El script de fetch escribe un JSON que cumple el esquema; sin credenciales falla con
      mensaje claro **y no rompe el build** (se conserva el snapshot anterior).
- [ ] Ningún secreto en el bundle cliente: `grep` del `.next` de producción no encuentra
      `client_secret` ni `refresh_token`.
- [ ] El runner de evals (`M0-IT-006`) ejecuta y pasa toda la suite con un comando.
- [ ] La sección declara cómo se verifican las reseñas (Omnibus) en ES y EN.

## Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| **Places API (New)** | Máximo 5 reseñas elegidas por Google, sin filtrar ni ordenar, y prohibido cachear el contenido más de 30 días. |
| **Widget de terceros** | Coste mensual, script externo que obliga a abrir la CSP, dependencia de un proveedor para 150 líneas. |
| **Fetch desde el navegador** | Expondría credenciales y añadiría latencia a un sitio estático por diseño. |
| **Vercel Pro con ISR** | 20 $/mes por un refresco que no se necesita. Hobby prohíbe uso comercial. |
| **Copiar reseñas a mano al diccionario** | Es lo que hay hoy y por eso está vacío. Se conserva solo como respaldo. |
| **Paquete `googleapis`** | ~50 MB de dependencia para 60 líneas de OAuth + un GET. |

## Preguntas resueltas en discovery (3 sep 2026)

| Pregunta | Respuesta |
|---|---|
| ¿Existe ficha de Google verificada? | **No existe.** Hay que crearla y verificarla. Bloqueante externo, no bloquea el plan. |
| ¿De quién es la web? | De Manuel. Él autoriza el OAuth y sus datos van en `site.legal`. |
| ¿Se filtran las reseñas? | **No.** Todas, sin criba por estrellas. |
| ¿Qué más entra en «mejorar el sistema»? | Solo la base FactorIA + tests + CI. |
| ¿Qué se entrega sin ficha? | Tubería completa probada con fixtures + snapshot manual. |
| ¿Con qué se prueba? | Vitest + Playwright smoke. |
| ¿Git? | Repo privado en GitHub + Actions. |
| ¿La ruta con acentos? | Renombrada a `Desktop\web-musica`. |

---

## Aprobación

| Quién | Fecha | Qué aprobó |
|---|---|---|
| Manuel | 2026-09-03 | El plan completo tal cual (`APROBADO` tras el planning gate) |
