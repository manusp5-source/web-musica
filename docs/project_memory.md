# Project Memory — web-musica
Última actualización: 2026-09-16

## Fase actual
Publicación en marcha. `gh auth login` resuelto (15 sep): remoto en
`github.com/manusp5-source/web-musica`, `main` y `docs/plan-negocio-eventos` empujados,
PR de merge armado (bloqueado por el clasificador de permisos, comando entregado a Manuel).
`M2-IT-003` reencaminado a Cloudflare Workers + `@opennextjs/cloudflare` (`DEC-020`) —
Cloudflare Pages "clásico" habría servido la web sin las cabeceras de seguridad reales.
Verificado en local con `wrangler dev`: las 6 cabeceras sobreviven. Falta solo la cuenta de
Cloudflare de Manuel. Identidad visual nueva: logo con silueta de viola, cartel A4 y tarjeta
de visita (`M2-IT-008`, `DEC-021`), verificados con capturas reales, pendientes del
Instagram real. Modelo de la sesión: **`sonnet`**.

## Versión del harness
2026.09-1 (ver `~/.claude/docs/harness.md`)

## Rama
`docs/plan-negocio-eventos` (el nombre ya no describe el contenido — arrastra M1-UJ-004/005,
QR, accesibilidad y M2-IT-006, no solo el plan de eventos; anotado, no renombrado). `main`
solo tiene el commit base del sitio importado. Árbol limpio tras cada commit.

## Último completado
- **M0 y M1 enteros.** Los 5 UJs de M1 en `DONE`, auditados por dos rondas de `/review`
  (13 pasadas de subagente en total entre las dos).
- **`M2-IT-002/006/007` en `DONE`**, auditados en esta ronda.
- **`M2-UJ-002` REVIEW (parcial)**: QR de la web generado y auditado; falta la prueba
  física en papel (Manuel) y el QR de reseñas (B-01/B-02).
- **16 evals, 0 fallan, 0 pendientes** — la suite entera en verde por primera vez.
- **80 unitarios · 6+1 e2e**, confirmados por tres subagentes distintos en esta ronda.

## Lo que encontró esta ronda de review, resumido
1. `M2-IT-006` no estaba cerrado: 2 promesas de piano en las páginas legales, fuera del
   alcance de `EV-013` (lista fija de 5 ficheros).
2. **Octavo falso verde**: `EV-008` v2 no veía un filtro por rating pasado por prop, sin
   import de `lib/reviews`. La condición de entrada era el agujero.
3. JSON-LD de `/en` publicaba la URL de la home ES (`url: site.domain` fijo).
4. El CTA del hero prometía la tarifa y no enlazaba a ella; `#tarifa` no tenía ningún
   enlace entrante en toda la página.

Los 4, arreglados con rojo→verde probado, y reverificados por un cuarto subagente.

## Siguiente paso
1. Manuel: fusionar el PR (`gh pr create` armado, comando entregado — bloqueado por
   permisos de esta sesión) y decidir si el repo se queda público o pasa a privado.
2. Cuenta de Cloudflare + `wrangler login`: desbloquea el primer `npm run cf:deploy` real
   y, tras eso, `M2-IT-001/004/005`.
3. Manuel: usuario real de Instagram (`site.social.instagram` en `site.ts` sigue vacío) —
   el cartel y la tarjeta llevan `tu_instagram` marcado en rojo a propósito hasta entonces.
4. Manuel: imprimir `assets/cartel/cartel-boda.html`, `assets/tarjeta/tarjeta.html` y
   `assets/qr/web.svg` — ninguna prueba física se pudo hacer en esta máquina.
5. Cuando exista la ficha de Google (B-01/B-02): `npm run reviews:fetch` y `npm run qr`
   generan solos el segundo código, sin tocar nada más.
6. Considerar renombrar la rama a algo que describa todo lo que ya lleva dentro.

## Bloqueadores
- **B-01 / B-02**: sin ficha de Google Business ni cuota de API. No bloquean código.
- **B-03**: resuelto el 15 sep (`gh auth login`). Queda solo la decisión de visibilidad
  del repo (público hoy, `M0-IT-002` pide privado) — de Manuel, no técnica.
- **B-04 / B-05 / B-06**: resueltos.
- **Sin registrar como B-0X formal**: `M2-IT-001/003/004/005` necesitan la cuenta de
  Cloudflare de Manuel — el código y la config ya están listos y verificados en local.

## Contexto clave para retomar en frío

Web de un músico —violista, ya no pianista— para bodas y eventos en Granada, Next.js 15,
dos raíces de idioma. Dominio real: `violagranada.es`. Reseñas alimentadas por
`data/reviews.json`, con fetcher OAuth construido y probado (fixtures — sin ficha real
todavía), y un generador de QR que ya sabe leer esa misma frontera cuando llegue.

Lo que no hay que olvidar:
- **El fichero es la frontera**, dos veces: `data/reviews.json` para las reseñas, y como
  fuente del destino del QR de reseñas (`DEC-019`) — nunca una URL duplicada en `site.ts`.
- **No se filtran reseñas por estrellas.** `EV-008` v3 escanea `app/`+`src/` enteros sin
  ninguna condición de entrada — la v2 tenía una (requería referenciar `lib/reviews`) y un
  filtro pasado por prop la esquivaba. Es el octavo falso verde documentado.
- **La tarifa está publicada, y ahora es alcanzable por enlace** desde el CTA del hero y
  desde `Nav.tsx` — antes de la review del 11 sep, no lo era.
- **Ocho falsos verdes documentados en total**, todos en aserciones negativas. El patrón
  que más se repite: una condición de entrada o una lista enumerada es una lista de
  sospechosos habituales — lo que la rompe es, por definición, lo que no estaba en la
  lista. `EV-008`, `EV-013`, `EV-015` ya no enumeran nada: escanean todo `app/`+`src/`.
- **Un subagente que muere a mitad de tarea puede dejar una regresión plantada, o puede
  no dejar nada** — las dos veces que murió el revisor en esta ronda (cuota, atasco de
  600s) el árbol quedó limpio. Comprobar siempre con `git status`, no asumir ninguno de
  los dos casos.
- **DEC-013/017**: el modelo baja de `opus` a `sonnet`, documentado las dos veces, con
  razón distinta. No es la norma, es la excepción con fecha.
- **DEC-016**: `scripts/fetch-reviews.ts` y `scripts/make-qr.ts` — Node 20 no importa
  TypeScript nativo. `tsx` como devDependency.
- **Límites físicos declarados, no escondidos**: la prueba de escaneo del QR en papel real
  no se pudo verificar en esta máquina (sin impresora, sin cámara). El mensaje de error
  sin `qrcode` instalado sí se probó (renombrando el paquete, reversible).
- Skills: `github-actions-templates` rota; `evaluation` va de agentes, no encaja aquí;
  `e2e-testing` es un router sin contenido; `deployment-procedures` es doctrina, útil en
  M2; `auth-implementation-patterns` parcial (5 recursos fantasma, playbook sí sirve).
