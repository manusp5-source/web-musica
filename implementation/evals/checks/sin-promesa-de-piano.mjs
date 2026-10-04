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
 * v3 (25 sep) — el crítico de la review de `M2-IT-009`/`M2-IT-010` no se conformó con que
 * el eval pasara: ejecutó los 6 patrones contra 8 frases-promesa realistas y encontró que
 * 4 escapaban. La generalización de v2 fue por FICHERO (dónde mirar); la lista de FRASES
 * seguía enumerada — el mismo antipatrón, una dimensión más abajo. Tres agujeros reales,
 * los tres arreglados aquí:
 *   - Un artículo entre la conjunción y "viola" rompía el emparejamiento: "piano y LA
 *     viola", "piano and THE viola" no enganchaban. Ahora toleran un artículo opcional.
 *   - «two instruments» no podía enganchar nunca: el patrón mezclaba el "two" inglés con
 *     el sustantivo *español* "instrumentos". Separado en dos frases bilingües correctas.
 *   - Una lista con coma, «piano, viola y guitarra», no encajaba en ningún patrón — el
 *     par solo se buscaba unido por «y»/«and», nunca por coma. Añadido en las dos
 *     direcciones.
 * Importa más ahora que antes: este mismo lote es el que devuelve la palabra "piano" al
 * copy (biografía, `INT-006`) después de purgarla de 16 sitios — el margen de seguridad
 * del eval que la deja pasar sin querer se ha vuelto más fino, no menos.
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
  // Artículo opcional entre la conjunción y "viola"/"piano": "piano y LA viola",
  // "piano and THE viola" enganchaban en falso antes de este arreglo (v3, 25 sep).
  { re: /piano\s+(?:y|and)\s+(?:la\s+|el\s+|the\s+)?viola/gi, que: "el par instrumental como reclamo" },
  { re: /viola\s+(?:y|and)\s+(?:la\s+|el\s+|the\s+)?piano/gi, que: "el par instrumental como reclamo" },
  // Mismo par, unido por coma en vez de conjunción: "piano, viola y guitarra".
  { re: /piano\s*,\s*viola\b/gi, que: "el par instrumental en una lista" },
  { re: /viola\s*,\s*piano\b/gi, que: "el par instrumental en una lista" },
  { re: /piano\s+(?:en\s+(?:directo|vivo)|live)/gi, que: "piano en directo" },
  // Bilingüe correcto: "dos instrumentos" / "two instruments", nunca mezclado entre
  // idiomas — la v2 emparejaba "two" con el sustantivo español y no podía enganchar
  // "two instruments" jamás (hallazgo del crítico, v3).
  { re: /(?:dos\s+instrumentos|two\s+instruments)/gi, que: "«dos instrumentos» — hoy solo hay uno en vivo" },
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
