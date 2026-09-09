#!/usr/bin/env node
/**
 * EV-008 — eval de trayectoria: en la ruta de render no hay ningún filtro por puntuación.
 *
 * Mostrar solo las reseñas positivas ocultando las negativas es práctica desleal
 * tipificada (RDL 24/2021, Directiva Omnibus, Anexo I). Es el principio 4 de
 * design/constitution.md.
 *
 * HISTORIA DE ESTE FICHERO, que explica por qué está escrito así:
 *
 * v1 (6 sep) llevaba la ruta de render escrita a mano: Reviews.tsx, load.ts, jsonld.ts.
 * El crítico de /review plantó `cargado.reviews.filter((r) => r.rating >= 4)` en
 * HomePage.tsx —que no estaba en la lista— y la suite entera siguió verde: lint 0,
 * 37/37 tests, 7 evals PASA incluido este. Quinto falso verde del proyecto, y dentro
 * del eval que existía para impedirlo.
 *
 * v2 no añade HomePage.tsx a la lista: **descubre** la ruta de render. Cualquier fichero
 * de src/ o app/ que toque el módulo de reseñas entra automáticamente. Añadir un consumidor
 * nuevo no vuelve a abrir el agujero.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const RAICES = ["src", "app"];
const EXTENSIONES = new Set([".ts", ".tsx", ".mjs", ".js"]);

// Núcleo: siempre se vigila, importe lo que importe.
const NUCLEO = [
  "src/components/Reviews.tsx",
  "src/lib/reviews/load.ts",
  "src/lib/reviews/jsonld.ts",
];

// Señales de que un fichero participa en decidir qué reseñas se muestran.
const TOCA_RESENAS = /lib\/reviews|loadReviews|visibleReviews|buildRatingJsonLd/;

const PATRONES = [
  { re: /\brating\w*\s*(?:>=|<=|>|<)\s*[\w.]+/g, que: "comparación sobre rating" },
  // Permite un nivel de paréntesis anidado: `.filter((r) => r.rating >= 4)`
  { re: /\.filter\s*\((?:[^()]|\([^()]*\))*\brating\b/g, que: "filter() que menciona rating" },
  { re: /\bslice\s*\([^)]*\brating\b/g, que: "slice() condicionado por rating" },
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

function sinComentarios(codigo) {
  return codigo.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");
}

const candidatos = RAICES.flatMap((raiz) => ficheros(raiz));
const rutaDeRender = new Set(NUCLEO);

for (const fichero of candidatos) {
  const contenido = readFileSync(fichero, "utf8");
  if (TOCA_RESENAS.test(sinComentarios(contenido))) rutaDeRender.add(fichero);
}

const hallazgos = [];

for (const fichero of NUCLEO) {
  try {
    statSync(fichero);
  } catch {
    // Un fichero del núcleo que desaparece no es "no aplica": puede significar que la
    // lógica se mudó a un sitio que este eval ya no vigila.
    hallazgos.push(`${fichero}: no existe. ¿Se movió la ruta de render sin actualizar EV-008?`);
  }
}

for (const fichero of [...rutaDeRender].sort()) {
  let codigo;
  try {
    codigo = sinComentarios(readFileSync(fichero, "utf8"));
  } catch {
    continue; // ya reportado arriba si era del núcleo
  }
  for (const { re, que } of PATRONES) {
    for (const match of codigo.matchAll(re)) {
      hallazgos.push(`${fichero}: ${que} → "${match[0].trim().replace(/\s+/g, " ")}"`);
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

console.log(
  `Sin filtros por puntuación en ${rutaDeRender.size} ficheros de la ruta de render:\n  ` +
    [...rutaDeRender].sort().join("\n  ")
);
