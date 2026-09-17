#!/usr/bin/env node
/**
 * EV-013 — la web no promete piano en vivo.
 *
 * El plan de negocio (docs/plan-negocio-viola.md §2) decidió **viola sola en ceremonia y
 * viola con base propia en cóctel**. La web prometía piano en vivo en catorce sitios
 * repartidos por cinco ficheros. No es una preferencia de estilo: el negocio se construye
 * sobre reseñas de Google, y la primera que diga «esperábamos piano» vale por diez buenas.
 * Es el mismo principio que impide filtrar reseñas — no prometer lo que no se entrega.
 *
 * HISTORIA DE ESTE FICHERO:
 *
 * v1 (10 sep) llevaba una lista fija de 5 ficheros. La review adversarial encontró dos
 * promesas más en `app/(es)/aviso-legal/page.tsx` y `app/(en)/en/legal-notice/page.tsx`
 * — confirmadas en el HTML que de verdad se publica, no solo en la fuente — que la lista
 * nunca vigiló. Es el mismo patrón que ya rompió `EV-008` v1: un eval que enumera dónde
 * mirar solo protege de lo que ya se te había ocurrido.
 *
 * v2 no enumera: recorre `app/` y `src/` enteros. Un fichero nuevo con una promesa de
 * piano entra solo, sin que nadie tenga que acordarse de añadirlo a una lista.
 *
 * Si algún día se toca el piano de verdad, este eval se retira **a conciencia**, con su
 * entrada en docs/decision_log.md. Hasta entonces vigila todo lo que haya.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, extname } from "node:path";

const RAICES = ["app", "src"];
const EXTENSIONES = new Set([".ts", ".tsx"]);

// "piano" a secas no basta: puede aparecer legítimamente en un nombre propio o en una
// explicación de por qué NO hay piano. Lo que se persigue es la promesa.
const PROMESAS = [
  { re: /piano\s+(?:y|and)\s+viola/gi, que: "el par instrumental como reclamo" },
  { re: /viola\s+(?:y|and)\s+piano/gi, que: "el par instrumental como reclamo" },
  { re: /piano\s+(?:en\s+(?:directo|vivo)|live)/gi, que: "piano en directo" },
  { re: /(?:dos|two)\s+instrumentos/gi, que: "«dos instrumentos» — hoy solo hay uno en vivo" },
  { re: /piano\s+para\s+el\s+c[oó]ctel/gi, que: "piano en el cóctel" },
  { re: /piano\s+for\s+the\s+(?:cocktail|reception)/gi, que: "piano en el cóctel (EN)" },
];

function ficheros(dir, acc = []) {
  let entradas;
  try {
    entradas = readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entrada of entradas) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      ficheros(ruta, acc);
    } else if (EXTENSIONES.has(extname(entrada.name))) {
      acc.push(ruta.replace(/\\/g, "/"));
    }
  }
  return acc;
}

// Los comentarios (de bloque y JSX) sí pueden nombrar el piano: explican por qué no está.
function sinComentarios(codigo) {
  return codigo
    .replace(/\{\/\*[\s\S]*?\*\/\}|\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|\s)\/\/.*$/gm, "$1");
}

const candidatos = RAICES.flatMap((raiz) => ficheros(raiz));
const hallazgos = [];

for (const fichero of candidatos) {
  const codigo = sinComentarios(readFileSync(fichero, "utf8"));
  for (const { re, que } of PROMESAS) {
    for (const match of codigo.matchAll(re)) {
      hallazgos.push(`${fichero}: ${que} → "${match[0]}"`);
    }
  }
}

if (hallazgos.length > 0) {
  console.error("LA WEB PROMETE PIANO EN VIVO:");
  for (const h of new Set(hallazgos)) console.error(`  ${h}`);
  console.error("\nplan-negocio-viola.md §2: viola sola en ceremonia, viola con base en cóctel.");
  console.error("Prometer lo que no se entrega es la peor forma de arrancar un negocio de reseñas.");
  process.exit(1);
}

console.log(`Sin promesas de piano en vivo en ${candidatos.length} ficheros de app/ y src/.`);
