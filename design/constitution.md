# Constitución — web-musica

Aprobada el 2026-09-03 con el planning gate de `planning/intent-001.md`.
`/iterate` la comprueba antes de implementar cualquier Enhancement o New Feature.

---

## Principios

### 1. El fichero es la frontera
`data/reviews.json` es la única fuente de datos de la sección de reseñas. La web nunca
llama a Google en runtime, y ningún componente sabe que Google existe salvo por las URLs
de atribución. Aguas arriba del fichero se puede cambiar de API, de proveedor o pasar a
edición manual sin tocar una línea aguas abajo.

### 2. El build no depende de una red
Si el fetch de reseñas falla —API caída, token caducado, cuota revocada— se usa el snapshot
anterior y el build pasa. Una integración externa no puede tumbar un despliegue. El error
se grita en consola; no se traga en silencio, pero tampoco rompe.

### 3. Cero secretos del lado del cliente
El OAuth ocurre en Node, en build o en el CLI. `client_secret` y `refresh_token` no entran
en el bundle, no entran en el repo y no entran en un log. Hay un eval que hace `grep` del
`.next` de producción para comprobarlo, porque «estoy seguro de que no está» no es
verificación.

### 4. Las reseñas se publican tal cual
Sin filtrar por estrellas, sin editar el texto, sin traducir, con atribución al autor y
enlace a la reseña original. La normativa española (RDL 24/2021) y los términos de Google
apuntan al mismo sitio, así que no hay conflicto que arbitrar: se muestra todo o no se
muestra nada.

### 5. Degradar en silencio, nunca romper
Sin datos, la sección no se renderiza y la página sigue perfecta — es el comportamiento que
ya tenía `Testimonials` y se conserva. Con un JSON corrupto, se registra el error y se
trata como si no hubiera reseñas. La home nunca devuelve un 500 por culpa de una reseña.

---

## No negociables

- **Ninguna dependencia nueva en el bundle del navegador.** Zod y las utilidades de test
  viven en `devDependencies` y en scripts de Node. La web que recibe el visitante no crece.
- **CSP e `images.remotePatterns` se amplían con hosts concretos.** Nunca un comodín `**`:
  convierte `/_next/image` en un proxy abierto (SSRF).
- **Ningún UJ llega a `DONE` sin un eval ejecutado que pase.**
- **Todo bug deja primero un eval en rojo**, después el arreglo.
- **El que escribe no aprueba.** `/review` con revisor y crítico en subagentes distintos.
- **Nunca commitear a `main` directamente.** Rama por trabajo.
- **La verificación es un comando ejecutado con salida confirmada.** Que un fichero exista
  no es verificación.

---

## Explícitamente fuera de alcance, para siempre

- Responder reseñas desde la web.
- Widgets de reseñas de terceros o cualquier script externo en la página.
- Reseñas de otras plataformas mezcladas con las de Google.
- Traducción automática del texto de un tercero atribuyéndoselo.
- Filtrado de reseñas por puntuación.
- Cualquier llamada del navegador a una API de Google que requiera clave.

---

## Proceso de enmienda

Un cambio a este documento requiere aprobación explícita de Manuel y queda registrado en
`docs/decision_log.md` con fecha, motivo y qué principio se toca. Un principio que se salta
una vez sin registrarlo deja de ser un principio.
