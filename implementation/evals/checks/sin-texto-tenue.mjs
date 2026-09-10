#!/usr/bin/env node
/**
 * EV-015 — nadie reintroduce un tono de texto ya medido como insuficiente.
 *
 * `EV-012` mide el contraste real (luminancia + composición alfa) pero solo dentro de
 * `Reviews.tsx`. Este proyecto ya se ha comido el mismo fallo **tres veces** en sitios
 * distintos: el aviso de reseñas (`text-carbon/60`, 4.42:1), el lugar de un evento en
 * `Sections.tsx` (idéntico `text-carbon/60`) y los separadores del footer
 * (`text-marfil/20`, ≈1,3:1). Ampliar `EV-012` a todo el árbol exigiría resolver el fondo
 * real de cada elemento en cada fichero — trabajo mayor, declarado como hueco en
 * `implementation/evals/README.md`.
 *
 * Mientras tanto, esto es la red mínima honesta: los dos tonos que **ya se han medido y
 * fallan** (`text-carbon/≤60` sobre fondos claros, `text-marfil/≤40` sobre fondos
 * oscuros) quedan prohibidos en todo `src/components/`, salvo que el elemento —o un
 * ancestro suyo, como el `aria-hidden` que ya envuelve las estrellas— esté marcado
 * `aria-hidden` (decorativo, sin obligación de contraste).
 *
 * Es un heurístico por umbral, no un cálculo de contraste por elemento. Si aparece un
 * tono nuevo no cubierto aquí, este eval no lo detecta: lo hace `EV-012` allí donde se
 * ha extendido, y a ojo en el resto hasta que se generalice.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = "src/components";

// Umbrales medidos: carbon/60 = 4.42:1 (falla), carbon/70 = 6.14:1 (pasa) → se prohíbe
// ≤60. marfil/20 ≈1.3:1 (falla), marfil/50 = 4.94:1 (pasa) → se prohíbe ≤40 por margen.
const PROHIBIDOS = [
  { re: /text-carbon\/([0-9]|[1-5][0-9]|60)\b/g, que: "text-carbon a ≤60% — medido en 4.42:1 sobre marfil, por debajo de AA" },
  { re: /text-marfil\/([0-9]|[1-3][0-9]|40)\b/g, que: "text-marfil a ≤40% — medido en ≈1.3:1 sobre carbón, muy por debajo de AA" },
];

function ficherosTsx(dir, acc = []) {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === "hero3d") continue; // sin texto informativo, solo WebGL
      ficherosTsx(ruta, acc);
    } else if (entrada.name.endsWith(".tsx")) {
      acc.push(ruta.replace(/\\/g, "/"));
    }
  }
  return acc;
}

/**
 * Quita el contenido de los comentarios JSX (`{/* ... *\/}`) y de bloque (`/* ... *\/`)
 * **sin mover ninguna posición de carácter**: cada carácter interior se sustituye por un
 * espacio, así los números de línea y los offsets absolutos siguen siendo válidos. Sin
 * esto, un comentario que cita literalmente "text-carbon/60" —como este mismo fichero de
 * más arriba— se detecta a sí mismo como una violación.
 */
function sinComentarios(codigo) {
  return codigo.replace(/\{\/\*[\s\S]*?\*\/\}|\/\*[\s\S]*?\*\//g, (m) =>
    m.replace(/[^\n]/g, " ")
  );
}

/**
 * Igual que el helper de EV-012: devuelve una función posición → ¿hay un ancestro
 * `aria-hidden` abierto ahí? Duplicado a propósito en vez de importado — cada check de
 * esta carpeta es un script suelto, autocontenido, y así se lee de un tirón.
 */
function ancestrosOcultos(codigo) {
  const etiquetas = [...codigo.matchAll(/<\/?([A-Za-z][\w.]*)([^>]*?)(\/?)>/g)];
  const tramos = [];
  const pila = [];
  for (const et of etiquetas) {
    const [completa, , atributos, autocierre] = et;
    const esCierre = completa.startsWith("</");
    const ocultaAqui = /aria-hidden/.test(atributos ?? "");
    if (esCierre) {
      const abierta = pila.pop();
      if (abierta?.oculta) tramos.push([abierta.desde, et.index + completa.length]);
      continue;
    }
    if (autocierre) {
      if (ocultaAqui) tramos.push([et.index, et.index + completa.length]);
      continue;
    }
    pila.push({ oculta: ocultaAqui, desde: et.index });
  }
  return (pos) => tramos.some(([desde, hasta]) => pos >= desde && pos <= hasta);
}

const hallazgos = [];

for (const fichero of ficherosTsx(RAIZ)) {
  const original = readFileSync(fichero, "utf8");
  const codigo = sinComentarios(original);
  const estaOculto = ancestrosOcultos(codigo);
  const lineaDe = (pos) => codigo.slice(0, pos).split("\n").length;

  for (const { re, que } of PROHIBIDOS) {
    re.lastIndex = 0;
    for (const match of codigo.matchAll(re)) {
      if (estaOculto(match.index)) continue; // decorativo, exento
      hallazgos.push(`${fichero}:${lineaDe(match.index)}: ${que} → "${match[0]}"`);
    }
  }
}

if (hallazgos.length > 0) {
  console.error("TONO DE TEXTO YA MEDIDO COMO INSUFICIENTE:");
  for (const h of hallazgos) console.error(`  ${h}`);
  console.error("\nSi es decorativo, márcalo (o su ancestro) aria-hidden. Si es informativo, sube el tono.");
  process.exit(1);
}

console.log(`Sin tonos prohibidos en ${ficherosTsx(RAIZ).length} ficheros de src/components/.`);
