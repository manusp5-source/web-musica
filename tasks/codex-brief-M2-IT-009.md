# Encargo Codex — M2-IT-009: contenido humano, sin precios, Instagram real, QR más grande

## Contexto del proyecto (no tienes esta conversación — todo lo que necesitas va aquí)

Proyecto Next.js 15 (App Router) en `C:\Users\Manuel\Desktop\web-musica`. Sitio de Manuel,
violista profesional en Granada (España), para bodas y eventos. Dos raíces de idioma:
`app/(es)/` y `app/(en)/en/`. Config central en `src/config/site.ts`. Copy en dos idiomas
en `src/i18n/dictionaries.ts` (objeto con bloques `es`/`en`). Componentes de contenido en
`src/components/`: `Hero.tsx`, `Sections.tsx` (contiene `Pricing`, `Services`, `About`,
`Events`), `Nav.tsx`, `Footer.tsx`.

Reglas del proyecto, sin excepción:
- "El fichero es la frontera": nunca inventes datos de contacto o legales que no estén ya
  en `site.ts`.
- Nunca hardcodees secretos.
- Sigue el estilo ya existente: TypeScript estricto, Tailwind, Server Components salvo que
  el fichero ya diga `"use client"` arriba.
- No toques nada de `app/(es)/aviso-legal`, `app/(en)/en/legal-notice`, `/privacidad`,
  `/privacy`, `/cookies` — esas páginas son legales, no de marketing, y quedan fuera de
  este encargo salvo que se indique lo contrario más abajo.

## Qué pide el dueño del proyecto, textualmente

1. Su Instagram real es `viola.granada` (handle, sin `@` ni URL completa — sigue el
   formato que ya usan los otros campos de `site.social`, ej. `youtube`/`spotify`, en
   `src/config/site.ts`).
2. El QR debe verse más grande, tanto en el cartel (`assets/cartel/cartel-boda.html`) como
   en la tarjeta (`assets/tarjeta/tarjeta.html`).
3. Quitar TODOS los precios de TODOS los sitios: de la web (sección `Pricing` en
   `Sections.tsx`, el enlace `#tarifa` en `Nav.tsx`, y cualquier texto de precio en
   `dictionaries.ts`) y de los materiales impresos si mencionan alguno.
4. Todo el texto de marketing de la web debe sonar más humano y cercano, no corporativo, y
   debe referirse a Granada específicamente en vez de a España en general — salvo en las
   páginas legales excluidas arriba, donde España puede seguir apareciendo si es
   legalmente necesario (NIF, domicilio fiscal, etc.).
5. Reescribir la biografía / sección "Sobre mí" (`About` en `Sections.tsx` +
   `dictionaries.ts`) para contar: es músico de Granada, tiene más de 20 años de
   experiencia, formación desde el conservatorio, ha tocado en orquestas, ha tocado en
   eventos diversos incluidas bodas. Puedes añadir cualquier otro detalle que quede bien y
   suene bonito, en tono cálido y cercano, sin inventar datos verificables (nombres de
   orquestas concretas, fechas, premios) que no estén ya en el proyecto.

## Restricción crítica — leer antes de tocar nada del punto 5

Este proyecto tiene un eval automático,
`implementation/evals/checks/sin-promesa-de-piano.mjs` (`EV-013`), que bloquea cualquier
promesa de piano en el sitio. Existe porque el negocio pivotó de "pianista y violista" a
violista pura para eventos: el dueño solo toca viola EN DIRECTO en bodas/eventos, y
prometer piano generaba expectativas falsas en clientes. **Esa decisión de negocio no
cambia hoy.**

Pero el dueño sí quiere ahora que su biografía mencione que **también sabe tocar piano y
guitarra**, como parte de su trayectoria musical — no como servicio reservable. Es una
distinción real:

- **Permitido**: piano/guitarra mencionados como parte de la FORMACIÓN o TRAYECTORIA (ej.
  "formado en piano y guitarra además de viola", "su recorrido empezó con el piano y la
  guitarra antes de especializarse en viola"). El texto tiene que dejar claro, por
  contexto, que lo que se ofrece/reserva para eventos es la viola.
- **Prohibido**: cualquier frase que sugiera que el piano o la guitarra están disponibles
  para contratar en un evento (ej. "toca piano en bodas", "disponible en piano y guitarra
  para tu evento", listarlos en la sección de Servicios como opción).

Pasos obligatorios antes de escribir la biografía nueva:

1. Lee `implementation/evals/checks/sin-promesa-de-piano.mjs` completo para entender
   exactamente qué patrón bloquea hoy (mira también su fichero `.eval.md` hermano en
   `implementation/evals/` si existe, para el historial de por qué está así).
2. Si su lógica actual es un bloqueo ciego de "piano"/"guitarra" en cualquier contexto
   (probable — el proyecto tiene el hábito documentado de eliminar condiciones de entrada
   en sus evals tras encontrar falsos verdes), actualízala para que distinga: bloquea si
   "piano" o "guitarra" aparece en contexto de oferta/reserva de servicio (cerca de
   palabras como "reserva", "disponible", "contrata", dentro de la sección
   Services/Servicios, o listado junto al instrumento principal como opción de evento),
   pero permite su aparición en contexto claramente biográfico/formativo (sección
   About/Sobre mí, cerca de palabras como "formación", "estudió", "empezó",
   "trayectoria", "conservatorio").
3. Documenta la regla nueva dentro del propio fichero de eval con un comentario breve
   explicando el porqué — sigue el estilo de comentarios que ya usan los demás ficheros
   `.mjs` de esa misma carpeta (`implementation/evals/checks/`).
4. Si tras leer el eval no puedes distinguir ambos casos con confianza razonable sin
   arriesgar otro falso verde (este proyecto ya lleva 8 documentados en su historial, casi
   todos por reglas demasiado permisivas o por listas enumeradas en vez de reglas
   generales — hay contexto en `docs/decision_log.md` si hace falta), **para y repórtalo
   en vez de adivinar**. Es preferible que quede bloqueando de más y yo lo resuelva a
   mano, que dejar un agujero silencioso en un eval que existe justo para evitar ese
   agujero.

## Alcance de ficheros (tócalos solo si aplica a lo de arriba, nada más)

- `src/config/site.ts` — `social.instagram`
- `src/i18n/dictionaries.ts` — retirar strings de precio/tarifa (es + en), reescribir tono
  humano + referencias a Granada en los bloques de marketing (hero, about, services,
  events — nunca en legal/privacidad/cookies), reescribir la biografía en `About` (es +
  en) con la restricción de piano/guitarra de arriba
- `src/components/Sections.tsx` — quitar el componente/bloque `Pricing` entero, incluido
  `id="tarifa"` si vive ahí
- `src/components/Nav.tsx` — quitar la entrada `{ href: "#tarifa", ... }` del array
  `links`
- `src/components/Hero.tsx` — si el CTA principal enlaza a `#tarifa` (comprobar; en la
  última revisión de este proyecto lo hacía), cambia el destino a `#contacto` — con la
  tarifa fuera, ese enlace no puede quedar roto apuntando a una sección inexistente
- `assets/cartel/cartel-boda.html` — QR más grande (aumenta `width`/`height` del elemento
  que lo pinta o de su contenedor), quita cualquier mención de precio si la hay
- `assets/tarjeta/tarjeta.html` — mismo cambio de tamaño de QR, quita precio si lo hay
- `implementation/evals/checks/sin-promesa-de-piano.mjs` — solo si hace falta ajustar la
  regla, como se explica arriba
- `tests/unit/*` — cualquier test existente que dependa de `#tarifa`, del componente
  `Pricing`, o de textos de precio que se eliminan, tiene que actualizarse para reflejar
  el estado nuevo. No dejes tests rotos ni tests que ya no comprueban nada real.

No toques ningún otro fichero fuera de esta lista salvo que sea estrictamente necesario
para que el build compile — y si lo haces, dilo explícitamente en el resumen final.

## Criterio de aceptación

Ejecuta esto y todo tiene que salir verde antes de dar el encargo por terminado:

```bash
npm run build
npx vitest run
npm run evals
```

Específicamente:

- `EV-013` (sin promesa de piano) sigue en verde, incluso con la biografía nueva
  mencionando piano/guitarra como formación
- Ningún test menciona `#tarifa` ni el componente `Pricing` salvo que se haya actualizado
  a propósito para reflejar que ya no existe
- `grep -rniE "€|precio|tarifa|price" app/ src/` no devuelve nada que sea contenido de
  marketing — si algo queda, revisa antes de asumir que hay que borrarlo (podría ser un
  sentido distinto de la palabra)
- El QR de `cartel-boda.html` y `tarjeta.html` se ve claramente más grande que antes en
  una captura real de Playwright (antes/después, no "el fichero cambió" — este proyecto
  ya verifica su diseño así en el resto de `M2-IT-008`)
- `site.social.instagram` vale `"viola.granada"` en `src/config/site.ts`

## Qué reportar al terminar

Un resumen con: qué ficheros se tocaron y por qué, el resultado de los tres comandos de
arriba (build/vitest/evals — pega la salida relevante, no solo "pasó"), y si tocaste
`sin-promesa-de-piano.mjs`, una explicación clara de la regla nueva y por qué no
reintroduce un falso verde. Si algo del alcance no se pudo completar del todo, dilo
explícitamente en el resumen — no lo des por hecho si no lo verificaste de verdad.
