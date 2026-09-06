#!/usr/bin/env node
/**
 * EV-008 — eval de trayectoria: en la ruta de render no hay ningún filtro por puntuación.
 *
 * Mostrar solo las reseñas positivas ocultando las negativas es práctica desleal
 * tipificada (RDL 24/2021, Directiva Omnibus, Anexo I). Es el principio 4 de
 * design/constitution.md, y hasta hoy no lo vigilaba nadie: el fichero no existía y el
 * runner no puede echar en falta un eval que no está.
 *
 * Comprueba el camino, no la pantalla: busca construcciones de filtrado sobre `rating`
 * en los ficheros que deciden qué se muestra.
 */
import { readFileSync } from "node:fs";

const RUTA_DE_RENDER = [
  "src/components/Reviews.tsx",
  "src/lib/reviews/load.ts",
  "src/lib/reviews/jsonld.ts",
];

// Comparaciones sobre rating (rating > 3, rating >= 4, ratingValue < 5…) y filtrados
// que mencionen rating. `Math.round(...rating)` o `ratingValue: r.rating` no son filtros
// y no deben saltar: por eso se busca el operador, no la palabra.
const PATRONES = [
  { re: /\brating\w*\s*(?:>=|<=|>|<)\s*\d/g, que: "comparación numérica sobre rating" },
  { re: /\.filter\s*\([^)]*\brating\b/gs, que: "filter() que menciona rating" },
  { re: /\brating\w*\s*(?:>=|<=|>|<)\s*\w+/g, que: "comparación sobre rating" },
];

const hallazgos = [];

for (const fichero of RUTA_DE_RENDER) {
  let contenido;
  try {
    contenido = readFileSync(fichero, "utf8");
  } catch {
    // Un fichero de la ruta de render que desaparece es un hallazgo, no un "no aplica":
    // puede significar que la lógica se movió a un sitio que este eval ya no vigila.
    hallazgos.push(`${fichero}: no existe. ¿Se movió la ruta de render sin actualizar EV-008?`);
    continue;
  }

  // Fuera comentarios: un `// nunca filtres por rating < 4` no es un filtro.
  const codigo = contenido.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");

  for (const { re, que } of PATRONES) {
    for (const match of codigo.matchAll(re)) {
      hallazgos.push(`${fichero}: ${que} → "${match[0].trim()}"`);
    }
  }
}

if (hallazgos.length > 0) {
  console.error("FILTRO POR PUNTUACIÓN EN LA RUTA DE RENDER:");
  for (const h of new Set(hallazgos)) console.error(`  ${h}`);
  console.error("\nRDL 24/2021: ocultar las reseñas negativas es práctica desleal.");
  console.error("Si el filtro es legítimo (p. ej. retirada pedida por el interesado),");
  console.error("documéntalo en docs/decision_log.md y actualiza este eval a conciencia.");
  process.exit(1);
}

console.log(`Sin filtros por puntuación en ${RUTA_DE_RENDER.length} ficheros de la ruta de render.`);
