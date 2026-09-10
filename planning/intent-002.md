# Intent — Código QR impreso que lleva a la web

```
ID      : INT-002
Fecha   : 2026-09-03
Autor   : Manuel
Estado  : aprobado parcialmente (QR de la web; el de reseñas sigue bloqueado por B-01/B-02)
Origen  : manual (petición durante la ejecución de M0)
```

---

## Problema

Manuel toca en bodas y eventos donde hay gente que acaba de escucharle en directo y querría
contratarle. Ese momento —el único en que un desconocido está convencido— no tiene puente:
hay que dictar una dirección web, o buscarle a mano en el móvil, y se pierde.

Un código impreso en una tarjeta, en el atril o en un cartelito junto al piano convierte ese
momento en una visita. Hoy no existe.

**Y hay un obstáculo que hace inútil imprimir nada todavía:** no hay dominio, la web no está
publicada y `site.domain` sigue siendo `https://tunombre.es`. Un QR impreso es permanente
por definición: una vez repartido, no se puede cambiar. Apuntar a una URL que no existe, o
que va a cambiar, es tirar la impresión.

## Resultado propuesto

Un comando del proyecto (`npm run qr`) genera los códigos a partir de la configuración que
ya existe en `src/config/site.ts`, en SVG vectorial listo para imprenta y en PNG de alta
resolución para pruebas. Cambiar el destino es cambiar una línea de configuración y volver
a ejecutar; nadie edita imágenes a mano ni depende de un generador web que mete su marca de
agua o que caduca el enlace.

Se generan **dos** códigos, porque los dos momentos son distintos:

1. **QR de la web** — para tarjetas y cartelería: quien te escucha, te encuentra.
2. **QR de reseña en Google** — para entregar al cliente **después** del evento: es el que
   alimenta las reseñas que M1 se dedica a mostrar. Sin este, la sección de reseñas se queda
   vacía por muy bien construida que esté.

## Sistemas afectados

| Qué | Cómo se toca |
|---|---|
| `scripts/make-qr.ts` | Nuevo. Genera los SVG y PNG. `.ts`, no `.mjs`: mismo motivo que `fetch-reviews.ts` (`DEC-016`) |
| `src/config/site.ts` | Gana `qr: { web, review }` — solo metadatos; la URL de "web" es `site.domain` y la de "review" se lee de `data/reviews.json` → `profileUrl`, sin duplicar ninguna de las dos |
| `package.json` | Script `qr` + `qrcode`, `jsqr`, `pngjs` en `devDependencies` |
| `assets/qr/` | Salida. **Fuera de `public/`**: son piezas de imprenta, no recursos de la web |
| `.gitignore` | Los PNG generados no se versionan; los SVG sí (son el máster) |

## Restricciones

- **Cero dependencias de runtime.** `qrcode` es `devDependency` y solo corre en Node.
- **Un QR impreso es inmutable.** No se imprime nada hasta que la URL sea la definitiva.
- **Legibilidad física, no estética.** Contraste alto (carbón sobre marfil o blanco), zona
  de silencio de 4 módulos, tamaño mínimo de 2 cm de lado a 20 cm de distancia de lectura.
  El dorado de la paleta **no vale** para los módulos: no da contraste suficiente.
- **Nivel de corrección de errores H (30%)** si se pone un monograma en el centro; si no, M.
- Sin acortadores de terceros (bit.ly y compañía): caducan, cambian de dueño y añaden un
  intermediario que puede caerse o cobrar.

## Qué NO entra

- Analítica de escaneos. `cookies.analyticsEnabled` está en `false` y no hay analítica en el
  sitio; un `?utm_source=qr` no lo leería nadie. Si algún día hay analítica, se añade el
  parámetro y se regeneran los códigos.
- QR dinámicos de pago (los que permiten cambiar el destino después). Añaden cuota mensual
  y dependencia de un tercero.
- Diseño de la tarjeta, el cartel o el material impreso. Aquí solo sale el código.
- Imprimir. Eso lo hace Manuel con el SVG.

## Criterio de éxito

- [x] `npm run qr` genera un SVG y un PNG por destino, sin tocar el disco fuera de `assets/qr/`.
- [x] El SVG es vectorial de verdad (`EV-016` comprueba `<svg>`+`<path>`, no una imagen
      incrustada). No verificado a mano en Illustrator/Inkscape — Manuel puede confirmarlo.
- [x] El PNG mide 1800px de lado, muy por encima del mínimo de 600px.
- [ ] Un móvil escanea el PNG impreso a 2 cm de lado desde 20 cm. **No verificable en esta
      máquina** (sin impresora ni cámara). El proxy más cercano: `EV-016` decodifica el PNG
      con un lector de QR de software (`jsqr`) y confirma que vuelve la URL exacta — un
      round-trip real, pero no la prueba física que pide este criterio.
- [x] Si un destino sigue siendo un placeholder, el script avisa y **no genera ningún
      fichero** para él — probado en rojo devolviendo `site.domain` al placeholder original
      (`https://tunombre.es`): exit 1, cero ficheros.
- [x] Fallo claro si `qrcode` no está instalado: probado de verdad renombrando
      `node_modules/qrcode` (reversible, sin desinstalar nada) →
      `✗ Falta la dependencia "qrcode". Ejecuta: npm install -D qrcode`, exit 1.
      Restaurado y confirmado que `npm run qr` vuelve a funcionar con normalidad.

## Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| Generador web (qr-code-generator.com y similares) | Marca de agua, límites de uso, y el código deja de ser reproducible: dentro de un año nadie sabe con qué se hizo |
| QR dinámico de pago | Cuota mensual y un intermediario que puede caerse, justo en el material que ya está impreso |
| Acortador (bit.ly) | Mismo problema, más el riesgo de que el enlace corto caduque |
| Componente QR en la propia web | Un QR se escanea desde el papel, no desde la pantalla que ya lo tiene abierto |

---

## Preguntas abiertas

1. [x] **¿A qué URL apunta el QR de la web?** **Resuelta 10 sep**: `https://violagranada.es`.
2. [?] **¿Y el de reseñas?** Sigue sin resolver: necesita la ficha de Google (B-01/B-02).
3. [?] ¿Monograma en el centro del código? Sin resolver — se generó sin monograma (nivel
   de corrección M, no H) por ser la opción por defecto, no por una decisión explícita de
   Manuel. Si se quiere añadir, hay que subir a H y repetir la prueba de escaneo física.

---

## Aprobación

| Quién | Fecha | Qué aprobó |
|---|---|---|
| Manuel | 2026-09-10 | Implícita, dentro de «sigue con lo que falta» — igual que `intent-005`.
El QR de la web ya no dependía de ninguna decisión de negocio pendiente: el dominio ya
estaba dado por Manuel en el mismo mensaje que desbloqueó esta tarea. El de reseñas sigue
bloqueado por algo que **nadie puede decidir todavía** (B-01/B-02), así que no había
ambigüedad de negocio que esperar. |
