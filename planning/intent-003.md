# Intent — Publicar la web: dominio, datos legales y despliegue

```
ID      : INT-003
Fecha   : 2026-09-03
Autor   : Manuel
Estado  : borrador
Origen  : manual — reapertura del milestone M2, decidida al plantear el QR
```

---

## Problema

La web está construida, probada y no existe para nadie. No tiene dominio, no está
desplegada, y sus datos legales son placeholders: `[NOMBRE Y APELLIDOS]`, `[NIF / DNI]`,
`[Dirección postal completa]`. `npm run check-legal` lo grita en cada build.

El disparador concreto: Manuel quiere un **QR impreso** (`planning/intent-002.md`) para que
quien le escucha en un evento llegue a la web. Un QR impreso es permanente, así que no se
puede imprimir hasta que exista una URL definitiva. El QR no está bloqueado por el QR: está
bloqueado por la publicación.

Y hay un segundo efecto en cadena: sin web publicada y sin ficha de Google, **no entran
reseñas**, y toda la maquinaria del milestone M1 se queda enseñando un fichero vacío.

## Resultado propuesto

La web está en un dominio propio, con HTTPS, cabeceras de seguridad verificadas en
producción y datos legales reales que cumplen la LSSI. A partir de ahí el QR tiene destino,
la ficha de Google tiene sitio web al que apuntar, y las reseñas tienen de dónde venir.

## Sistemas afectados

| Qué | Cómo se toca |
|---|---|
| Registrador de dominios | Alta nueva. Coste anual |
| `src/config/site.ts` | `domain`, `legal.fullName`, `legal.nif`, `legal.address`, `whatsapp` reales |
| Cloudflare Pages | Proyecto nuevo, build desde el repo, variables de entorno |
| DNS | Apuntar el dominio a Cloudflare |
| `scripts/check-legal.mjs` | Pasa a `--strict` en el CI: deja de avisar y empieza a bloquear |
| `assets/qr/` | Los códigos de `intent-002`, ya con destino real |
| Ficha de Google (`docs/google-business-setup.md`) | Gana el sitio web que hoy no puede declarar |

## Restricciones

- **Vercel Hobby está prohibido**: uso comercial. Cloudflare Pages, como dice DEC-005.
- **Sin datos legales reales no se publica.** Art. 10 LSSI-CE y art. 13 RGPD. `check-legal`
  pasa a bloquear el build en el CI, no solo a avisar.
- **El repo no puede llevar el NIF ni la dirección antes de tiempo**: si el repo es privado
  no hay problema, pero conviene decidirlo conscientemente. Con repo público, esos datos son
  igualmente obligatorios en el aviso legal público, así que no hay nada que ocultar — pero
  se decide, no se filtra por descuido.
- **El dominio lo compra Manuel.** Ni la IA compra dominios ni gestiona pagos.
- **Cabeceras verificadas en producción, no en local.** La CSP de `next.config.mjs` solo
  vale si Cloudflare la sirve de verdad.
- Presupuesto: dominio ~10-15 €/año. Cloudflare Pages, gratis.

## Qué NO entra

- Rediseño, contenido nuevo, blog o páginas por ciudad.
- Correo con dominio propio (`hola@…`). Se puede añadir después.
- Analítica. `cookies.analyticsEnabled` sigue en `false`, y por eso no hace falta banner.
- Rendimiento y accesibilidad: siguen siendo un intent aparte.
- Comprar el dominio: lo hace Manuel.

## Criterio de éxito

- [ ] El dominio resuelve por HTTPS y sirve la web.
- [ ] `npm run check-legal` (modo `--strict`) pasa: cero placeholders.
- [ ] La versión inglesa responde en `/en` y el `hreflang` apunta al dominio real.
- [ ] `sitemap.xml` y `robots.txt` publican el dominio real, no `tunombre.es`.
- [ ] `curl -I` sobre producción devuelve CSP, HSTS, `X-Frame-Options` y `Referrer-Policy`.
- [ ] El QR de `intent-002` escanea y abre la web desde papel impreso.
- [ ] La ficha de Google (cuando exista) declara ese dominio como sitio web.

## Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| Vercel Hobby | Prohíbe uso comercial y esta web lo es |
| Vercel Pro | 20 $/mes por un ISR que un sitio estático no necesita |
| Subdominio gratuito (`*.pages.dev`) | Sirve para probar, no para imprimir en una tarjeta: se ve improvisado y no es tuyo |
| Publicar sin datos legales | Incumplimiento directo de la LSSI. No es una opción |

---

## Preguntas abiertas

1. [?] **¿Qué dominio?** Sugerencia: nombre artístico + `.es` o `.com`. Conviene comprobar
   antes que el nombre está libre también como usuario en Instagram y en Google.
2. [?] **Datos legales reales**: nombre y apellidos, NIF y dirección postal. Sin esto no hay
   publicación posible.
3. [?] **WhatsApp real** — hoy es `+34 600 000 000`, un placeholder que además aparece como
   `telephone` en el JSON-LD.
4. [?] ¿Autónomo dado de alta? El aviso legal y las condiciones cambian según seas
   particular o profesional.
5. [?] ¿Cuenta de Cloudflare existente o hay que crearla?

---

## Aprobación

| Quién | Fecha | Qué aprobó |
|---|---|---|
| Manuel | — | pendiente |
