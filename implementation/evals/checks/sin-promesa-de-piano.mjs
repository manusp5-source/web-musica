#!/usr/bin/env node
/**
 * EV-013 — la web no promete piano en vivo.
 *
 * El plan de negocio (docs/plan-negocio-viola.md §2) decidió **viola sola en ceremonia y
 * viola con base propia en cóctel**. La web prometía piano en vivo en tres sitios y sus
 * gemelos en inglés.
 *
 * No es una preferencia de estilo: el negocio se construye sobre reseñas de Google, y la
 * primera que diga «esperábamos piano» vale por diez buenas. Es el mismo principio que
 * impide filtrar reseñas — no prometer lo que no se entrega.
 *
 * Si algún día se toca el piano de verdad, este eval se retira **a conciencia**, con su
 * entrada en docs/decision_log.md. Hasta entonces vigila.
 */
import { readFileSync } from "node:fs";

const FICHEROS = [
  "src/i18n/dictionaries.ts",
  "src/config/site.ts",
  "app/(es)/layout.tsx",
  "app/(en)/layout.tsx",
  "app/(en)/en/page.tsx",
];

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

const hallazgos = [];

for (const fichero of FICHEROS) {
  let contenido;
  try {
    contenido = readFileSync(fichero, "utf8");
  } catch {
    continue; // un fichero que no existe no es una promesa
  }

  // Los comentarios del código sí pueden nombrar el piano: explican por qué no está.
  const codigo = contenido.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");

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

console.log(`Sin promesas de piano en vivo en ${FICHEROS.length} ficheros de contenido.`);
