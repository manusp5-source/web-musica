# Project Memory — web-musica
Última actualización: 2026-09-25

## Fase actual
**La web está publicada y en producción de verdad**: `web-musica.manuelgpw.workers.dev`,
Cloudflare Workers + `@opennextjs/cloudflare` (`DEC-020`), desplegada varias veces a mano
con `npm run cf:deploy` (Wrangler autenticado). Dominio propio (`violagranada.es`) y
conexión automática GitHub→Cloudflare (Workers Builds) siguen sin confirmarse — el deploy
sigue siendo manual mientras tanto. `/review` de frontera completada el 25 sep sobre el
lote de 4 PRs del día. Veredicto: **avanzar**, tras revisor→crítico→arreglo, con 2
hallazgos reales cerrados y 2 decisiones nuevas documentadas. Modelo de la sesión:
**`sonnet`**.

## Versión del harness
2026.09-1 (ver `~/.claude/docs/harness.md`)

## Ramas — 4 PR abiertos + 1 rama de integración para la review
`main` en GitHub tiene ya el trabajo del PR #1 (M1 entero + M2-IT-002/006/007/008 +
adaptador Cloudflare). Desde ahí, el mismo día (25 sep) salieron 4 ramas en paralelo:
- `feat/logo-en-sitio` (PR #2): logo cableado en `Nav.tsx`/`Footer.tsx`/favicon — antes
  solo vivía en los impresos.
- `docs/gbp-60-day-prereq` (PR #3): corrige la guía de Google Business Profile.
- `feat/contenido-humano-sin-precios` (PR #4): retira la tarifa publicada, tono más
  humano, biografía nueva, Instagram real, QR más grande.
- `feat/cloudflare-web-analytics` (PR #5): Cloudflare Web Analytics sin cookies.

**Ninguno de los 4 está fusionado todavía.** Se integraron en una rama local,
`review/integracion-25sep`, solo para poder auditar el estado combinado con `/review` —
esa rama no es un PR nuevo, es un espejo temporal. `main` sigue exactamente como quedó tras
el PR #1. Cuando Manuel fusione los 4, la numeración de `DEC-022` colisiona entre PR #4 y
PR #5 a propósito (documentado en la propia entrada `DEC-023`); ya está resuelta en la
rama de integración, pero si se fusionan los PR originales sin pasar por ahí, hay que
resolverla a mano otra vez en ese merge.

## Último completado (25 sep, en `review/integracion-25sep`)
- **Logo cableado en el sitio real** (antes solo en cartel/tarjeta): `Nav.tsx` cambia de
  variante según el `scroll` (mismo mecanismo que ya usaba para el contraste), `Footer.tsx`
  siempre la oscura, favicon nuevo (`app/icon.svg`).
- **Guía de Google Business Profile corregida**: la ficha necesita **60 días verificada y
  activa** antes de poder pedir cuota (no estaba documentado); tipo de cliente OAuth
  correcto es "Aplicación web", no "de escritorio" (el que había escrito no habría dejado
  usar el Playground nunca).
- **Tarifa publicada retirada por completo** (decisión de negocio de Manuel, `DEC-022`, no
  un bug): componente `Pricing`, `priceRange` del JSON-LD, menciones en los dos idiomas y
  en los dos impresos. Instagram real (`viola.granada`) relleno, cerrando el hueco que
  dejó `M2-IT-008`. Biografía nueva con formación en piano/guitarra antes de la viola —
  **sin tocar `EV-013`** en el primer intento, aunque la review sí lo tocó después (ver
  abajo). QR ampliado en cartel (42→58mm) y tarjeta (18→24mm).
- **Cloudflare Web Analytics sin cookies** (`DEC-023`): Manuel pidió "añade las cookies
  también" sin más detalle; se le preguntó directamente antes de construir porque cookies
  de verdad y métricas sin cookies son dos arquitecturas legales distintas. Eligió sin
  cookies. `site.analytics.cloudflareToken` vacío — el beacon no renderiza nada hasta que
  Manuel dé de alta el sitio y pegue el token.
- **`docs/google-business-setup.md`** y las páginas `/cookies` en los dos idiomas,
  actualizadas.
- **16 evals, 0 fallan · 77 unitarios (fueron 75, +2 de la review) · build y lint limpios.**

## Lo que encontró la review del 25 sep, resumido

**Revisor** (`sonnet`, contexto limpio): todo lo anterior verificado con salida real
(servidor levantado, `curl` contra HTML servido, JSON-LD extraído sin `priceRange`, CSP
servida coincide con `next.config.mjs`). Un hallazgo cierto: `M2-IT-010` afirmaba "80/80
tests" en el tracker cuando la suite daba 75/75 — cifra copiada sin re-ejecutar — y
`CloudflareAnalytics.tsx` no tenía ningún test.

**Crítico** (`opus`, sin el contexto del revisor): sostuvo ese hallazgo y añadió cuatro
más, dos de ellos más pesados que el del revisor:
1. **Noveno falso verde, evitado antes de publicarse**: el crítico ejecutó los 6 regex de
   `EV-013` contra 8 frases-promesa adversarias construidas a mano y encontró que 4
   escapaban — un artículo entre la conjunción y "viola" ("piano y LA viola"), "two
   instruments" que nunca podía enganchar por mezclar idioma (`dos|two` contra el
   sustantivo *español* únicamente), y una lista con coma ("piano, viola y guitarra"). El
   eval pasaba con la biografía real por razón correcta, pero seguía enumerando *frases*
   aunque ya no enumerara *ficheros* — mismo antipatrón, un nivel más abajo. Arreglado en
   `EV-013` v3, verificado con las 8 frases + la biografía real antes y después de tocar
   nada.
2. **Manifiesto C2PA embebido en los tres SVG del logo**: 7.774 B por fichero (68-70% del
   peso total), una credencial de procedencia de IA de Anthropic publicada en la web
   comercial de un músico — justo en el lote que la hacía sonar más humana. Retirado
   (`DEC-024`); el dibujo no cambia, verificado con capturas antes/después.
3. **Riesgo de doble conteo en Cloudflare Analytics**: si Manuel elige "Automatic setup"
   al dar de alta el sitio, Cloudflare inyectaría un segundo beacon en el borde (todo
   Worker es zona proxiada) además del que ya renderiza el componente — doble conteo de
   cada visita. Documentado en `site.ts` y en `DEC-023`, con instrucción explícita de
   elegir "Manual setup".
4. Trazabilidad del tracker: `M2-IT-009` estaba en `DONE` con `Review ✓` vacío (arreglado
   ahora que existe el veredicto), y `Model` decía `claude`, que no es ningún tier de la
   convención (`haiku`/`sonnet`/`opus`/`codex`) — corregido a `sonnet`.

Todo arreglado, reverificado (16 evals, 77 tests, build y lint limpios), documentado en
`DEC-022` a `DEC-024` y en las notas de `M2-IT-009`/`M2-IT-010` del tracker.

## Siguiente paso
1. **Manuel**: fusionar los 4 PR (#2 a #5) — el orden no importa técnicamente, pero
   `feat/contenido-humano-sin-precios` y `feat/cloudflare-web-analytics` van a chocar en
   `DEC-022` al fusionarse entre sí; resolverlo igual que en `review/integracion-25sep`
   (uno se queda `DEC-022`, el otro pasa a `DEC-023`, `DEC-024` no se toca).
2. **Manuel**: cuando fusione, volver a desplegar (`npm run cf:deploy`) — el deploy actual
   en producción es de antes de esta ronda de `/review`.
3. **Manuel**: dar de alta el sitio en Cloudflare Web Analytics — **"Manual setup"**, no
   "Automatic" — y pegar el token en `site.analytics.cloudflareToken`.
4. **Manuel**: crear/verificar la ficha de Google Business Profile — el reloj de 60 días
   no corre hasta que esté verificada (B-01/B-02).
5. **Manuel**: imprimir `assets/cartel/cartel-boda.html`, `assets/tarjeta/tarjeta.html` —
   ninguna prueba física se ha podido hacer en esta máquina.
6. Confirmar o desechar la conexión GitHub→Cloudflare (Workers Builds): nunca se confirmó
   que disparara un deploy solo; mientras tanto, cada cambio se sube a mano.

## Bloqueadores
- **B-01 / B-02**: sin ficha de Google Business ni cuota de API — ahora con el requisito
  de 60 días documentado. No bloquean código.
- **B-03**: resuelto (`gh auth login`, repo público).
- **B-04 / B-05 / B-06**: resueltos.
- **Sin registrar como B-0X formal**: token de Cloudflare Web Analytics pendiente (Manuel);
  4 PR sin fusionar; conexión Workers Builds sin confirmar.

## Contexto clave para retomar en frío

Web de un músico —violista, ya no pianista para eventos, aunque su biografía sí cuenta que
empezó con piano y guitarra— para bodas y eventos en Granada, Next.js 15, dos raíces de
idioma. Dominio real: `violagranada.es`, desplegada en Cloudflare Workers. **Sin tarifa
publicada** desde el 25 sep (antes sí la tenía — decisión de negocio, no reversión de un
error). Reseñas alimentadas por `data/reviews.json`, con fetcher OAuth construido y
probado (fixtures — sin ficha real todavía).

Lo que no hay que olvidar:
- **El fichero es la frontera**, dos veces: `data/reviews.json` para las reseñas, y como
  fuente del destino del QR de reseñas (`DEC-019`) — nunca una URL duplicada en `site.ts`.
- **No se filtran reseñas por estrellas.** `EV-008` v3 escanea `app/`+`src/` enteros sin
  condición de entrada.
- **Nueve falsos verdes documentados en total, no ocho.** El noveno (25 sep) fue en
  `EV-013`: una lista de *frases* enumeradas, no de ficheros — mismo patrón de fondo que
  los ocho anteriores («una lista enumerada es una lista de sospechosos habituales»), una
  capa de abstracción más abajo. Ningún eval de este proyecto que diga "sin promesa de X"
  se puede dar por bueno solo porque pase contra el contenido de hoy — hay que probarlo
  contra frases adversarias inventadas, no solo contra lo que ya existe.
- **Un revisor que dice "correcto" sin ejecutar es tan hueco como uno que no revisa** —
  el crítico del 25 sep marcó `INFUNDADO` una afirmación del revisor ("verificado contra
  la documentación oficial") porque el revisor no tenía acceso web para comprobarlo él
  mismo, aunque la verificación sí había ocurrido en otra parte de la sesión. La lección:
  toda afirmación de "verificado" necesita la fuente citada al lado, no solo la palabra.
- **DEC-013/017**: el modelo baja de `opus` a `sonnet`, documentado las dos veces, con
  razón distinta. No es la norma, es la excepción con fecha.
- **DEC-016**: `scripts/fetch-reviews.ts` y `scripts/make-qr.ts` — Node 20 no importa
  TypeScript nativo. `tsx` como devDependency.
- **Límites físicos declarados, no escondidos**: la prueba de escaneo del QR en papel real
  no se pudo verificar en esta máquina (sin impresora, sin cámara).
- **El interruptor Codex** (activo desde el 20 sep, `~/.claude/docs/harness.md` §1) se
  probó una vez en este proyecto (`M2-IT-009`): se lanzó en segundo plano, pero Manuel
  pidió seguir con Claude antes de que devolviera nada — nunca llegó a producir diff. No
  hay todavía un caso real de construcción terminada por Codex en este proyecto.
- Skills: `github-actions-templates` rota; `evaluation` va de agentes, no encaja aquí;
  `e2e-testing` es un router sin contenido; `deployment-procedures` es doctrina, útil en
  M2; `auth-implementation-patterns` parcial (5 recursos fantasma, playbook sí sirve).
