# Scope — web-musica

Congelado el 2026-09-03 tras el planning gate. Cambiarlo exige un intent nuevo.

---

## Dentro

### M0 — Fundación del método
- Renombrado de la carpeta a `Desktop\web-musica` (hecho durante el scaffold).
- Rama `feat/factoria-reviews` y primer commit del proyecto entero.
- Repo privado en GitHub y remoto configurado.
- Vitest + Testing Library + jsdom, con al menos un test real en verde.
- Playwright con smoke de la home ES y EN.
- GitHub Actions: install → lint → check-legal → unit → build → e2e.
- Runner de evals (`npm run evals`) que recorre `implementation/evals/`.
- Estructura FactorIA completa y `CLAUDE.md` de proyecto.
- Guardia de placeholders: `check-legal.mjs` también avisa de dominio, WhatsApp y vídeos
  sin rellenar (avisa, no falla — rellenarlos está fuera de alcance).

### M1 — Reseñas
- Esquema Zod de `data/reviews.json` y tipos derivados.
- `src/lib/reviews/load.ts`: lectura y validación en build, tolerante a fichero ausente o
  corrupto.
- `src/lib/reviews/google.ts`: OAuth por refresh token + GET de reseñas v4 + mapper al
  esquema propio.
- `scripts/fetch-reviews.mjs`: CLI `npm run reviews:fetch`.
- `src/components/Reviews.tsx`: sustituye a `Testimonials`, con estados lleno y vacío.
- JSON-LD con `aggregateRating` y `review`.
- Textos de cumplimiento Omnibus y mención en la política de privacidad, ES y EN.
- Snapshot inicial `data/reviews.json` sin reseñas (`reviews: []`).
- Documentación: `docs/google-business-setup.md` con los pasos para crear la ficha,
  solicitar la cuota y generar el refresh token.

## Fuera

| Fuera de alcance | Por qué |
|---|---|
| Deploy en Cloudflare Pages, dominio, Deploy Hook | No se marcó en discovery. La tubería queda lista para ello |
| Cron Trigger de refresco automático | Depende del deploy |
| Rellenar NIF, dirección, dominio, WhatsApp, vídeos | No se marcó. Sin ello **la web no es publicable** |
| Rendimiento, Core Web Vitals, accesibilidad | No se marcó |
| SEO local por ciudades, blog, contenido nuevo | No se marcó |
| Responder reseñas, recolectarlas, agregarlas de otras fuentes | Excluido en el intent |
| Traducción automática de reseñas | Excluido en el intent |
| Filtrado por estrellas | Excluido por decisión de cumplimiento (Omnibus) |
| Rediseño visual | No se pidió |

## Fronteras e interfaces

```
Google Business Profile API  ──(OAuth, solo en build/CLI)──▶  scripts/fetch-reviews.mjs
                                                                      │ escribe
                                                                      ▼
                                                            data/reviews.json   ← FRONTERA
                                                                      │ lee en build
                                                                      ▼
                                              src/lib/reviews/load.ts ─▶ Reviews.tsx + JSON-LD
```

**La frontera es el fichero.** Aguas arriba se puede cambiar de API, de proveedor o pasar a
edición manual sin tocar nada aguas abajo. Aguas abajo no existe ningún conocimiento de
Google más allá de las URLs de atribución.

Lo que el navegador recibe: HTML ya renderizado con las reseñas dentro. Ninguna petición
del cliente a Google salvo, si se muestran, las imágenes de avatar.

## Preguntas abiertas

| # | Pregunta | Bloquea | Cuándo se responde |
|---|---|---|---|
| 1 | ¿Se crea la ficha de Google como «área de servicio» (sin dirección pública) o con dirección? | Nada del plan; sí la conexión real | Cuando Manuel cree la ficha |
| 2 | ¿Se muestran los avatares de Google o iniciales en círculo? | `remotePatterns` y CSP | En `M1-UJ-001`, decisión de diseño |
| 3 | ¿Cuántas reseñas se muestran de golpe y con qué orden? Propuesta: 6 más recientes, con enlace a Google para el resto | `M1-UJ-001` | En `M1-UJ-001` |
| 4 | ¿Qué pasa con `dict.testimonials.items`? Propuesta: se elimina el array y quedan solo los rótulos | `M1-UJ-001` | En `M1-UJ-001` |
