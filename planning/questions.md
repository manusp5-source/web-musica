# Preguntas abiertas y supuestos — web-musica

Actualizado: 2026-09-03

---

## Preguntas abiertas

| # | Pregunta | Impacto si se responde tarde | Responde |
|---|---|---|---|
| Q-01 | ¿Ficha de Google de tipo «área de servicio» (sin dirección pública, lo normal en un músico que se desplaza) o con dirección física? | Ninguno sobre el código. Afecta a la verificación y a la coherencia con `LocalBusiness` del JSON-LD | Manuel |
| ~~Q-02~~ | ~~¿Avatares de Google o iniciales?~~ | **RESUELTA 5 sep**: iniciales. DEC-011 | — |
| ~~Q-03~~ | ~~¿Cuántas reseñas visibles y en qué orden?~~ | **RESUELTA 5 sep**: 6 más recientes, `visibleReviews(file, 6)`, con enlace a la ficha | — |
| ~~Q-04~~ | ~~¿Se borra `testimonials.items`?~~ | **RESUELTA 5 sep**: `Testimonials` deja de usarse en `HomePage` y `Reviews` ocupa su sitio. El componente y el bloque del diccionario **siguen en el código**: los usa un test de M0-IT-003 y no molestan. Se retiran cuando `/review` lo confirme | — |
| Q-05 | Cuando llegue la cuota de la API, ¿el fetch va en el CI o se ejecuta a mano y se commitea el JSON? Propuesta: a mano al principio, automático cuando exista deploy | Ninguno ahora | Post-entrega |
| Q-06 | ¿La web se publica finalmente? Hoy no es publicable: faltan datos legales obligatorios | Todo el valor del proyecto está en publicarla | Manuel |

## Supuestos asumidos

| # | Supuesto | Si resulta falso |
|---|---|---|
| S-01 | Manuel es el titular de la web y el propietario de la futura ficha de Google | El OAuth lo tiene que autorizar otra persona; `M1-UJ-004` gana una dependencia externa |
| S-02 | Las reseñas de la ficha llegarán en español mayoritariamente | Si hay muchas en otros idiomas, la home EN se ve mezclada. Aceptado: se muestra el original |
| S-03 | El volumen de reseñas será bajo (decenas, no miles) — no hace falta paginar la API | Con cientos, `google.ts` necesita seguir `nextPageToken`. El mapper ya se escribe preparado |
| S-04 | Google Business Profile API v4 sigue sirviendo reseñas mientras dure el proyecto | Es API legacy. Está aislada en un módulo; migrar es cambiar un fichero |
| S-05 | Testing Library 16 funciona con React 19.0.0 exacto | Si hay conflicto de peer deps, se prueban los componentes solo por render de servidor y Playwright cubre el resto |
| S-06 | `gh` CLI está autenticado en esta máquina | `M0-IT-002` se queda en local y el CI no se ejecuta hasta que haya remoto |
| S-07 | El hero 3D se puede desactivar por variable de entorno para los e2e | Si no, los tests de Playwright serán más lentos y potencialmente inestables |

## Decisiones aplazadas

| Decisión | Aplazada a | Motivo |
|---|---|---|
| Cloudflare Pages: proyecto, dominio, Deploy Hook | Intent posterior | Fuera del alcance marcado en discovery |
| Cron Trigger de refresco diario | Intent posterior | Depende del deploy |
| Rellenar `site.legal`, dominio, WhatsApp, vídeos | Intent posterior | Fuera del alcance. **Bloquea la publicación** |
| Auditoría de rendimiento del hero 3D (three.js pesa) | Intent posterior | Fuera del alcance |
| Páginas por ciudad para SEO local | Intent posterior | Fuera del alcance |
