#!/usr/bin/env node
/**
 * EV-012 — todo el texto de la sección de reseñas cumple el contraste AA de WCAG (4.5:1).
 *
 * Nace del hallazgo del crítico (9 sep 2026): `text-carbon/60` sobre `bg-marfil` da
 * **4.42:1**, por debajo del 4.5:1 exigido. Y estaba usado exactamente una vez: en el
 * párrafo de `dict.reviews.disclosure`, que es **el texto que obliga a mostrar el
 * RDL 24/2021**. El aviso legal era lo único que no se leía bien.
 *
 * Calcula el ratio de verdad —luminancia relativa sRGB, con composición alfa canal a
 * canal sobre el fondo— en lugar de estimarlo a ojo.
 */
import { readFileSync } from "node:fs";

const COMPONENTE = "src/components/Reviews.tsx";
const FONDO = "#FAF7F2"; // bg-marfil, el fondo de la sección

// Tokens de tailwind.config.ts que pueden aparecer como color de texto.
const TOKENS = {
  carbon: "#1C1B19",
  carbon2: "#33312D",
  bronce: "#7A5F2E",
  dorado: "#C9A86A",
  doradoDark: "#A6854B",
  burdeos: "#5E2A33",
  marfil: "#FAF7F2",
};

const AA_TEXTO_NORMAL = 4.5;

function aRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function componer(color, fondo, alfa) {
  // Composición alfa canal a canal: lo que el ojo ve cuando tailwind aplica /60.
  return color.map((c, i) => Math.round(c * alfa + fondo[i] * (1 - alfa)));
}

function luminancia([r, g, b]) {
  const canal = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function ratio(colorHex, fondoHex, alfa) {
  const fondo = aRgb(fondoHex);
  const efectivo = componer(aRgb(colorHex), fondo, alfa);
  const l1 = luminancia(efectivo);
  const l2 = luminancia(fondo);
  const [claro, oscuro] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (claro + 0.05) / (oscuro + 0.05);
}

const codigo = readFileSync(COMPONENTE, "utf8");
const hallazgos = [];
const comprobados = [];
const decorativos = [];

/**
 * Se analiza por bloques de función porque el contraste no aplica igual a todo.
 *
 * Un glifo decorativo con `aria-hidden` **y** su equivalente en texto (`sr-only` o
 * `aria-label`) está exento: la información no depende de verlo. Las estrellas son
 * exactamente eso. Pero la exención se gana enseñando el equivalente textual — si un
 * bloque se declara decorativo y no ofrece alternativa, es un hallazgo, no una excusa.
 */
const bloques = codigo
  .split(/(?=^(?:export default )?function\s+\w+)/m)
  .filter((b) => b.trim().length > 0);

for (const bloque of bloques) {
  const nombre = bloque.match(/function\s+(\w+)/)?.[1] ?? "(módulo)";
  const esDecorativo = /aria-hidden/.test(bloque);
  // La alternativa puede estar en el propio bloque (sr-only, aria-label) o vivir en el
  // componente padre — el caso de `Avatar`, cuyas iniciales duplican el nombre que ya se
  // muestra en texto al lado. Ese segundo caso **se declara en el código** con un
  // comentario `a11y-exento:` explicando por qué. Una exención escrita se puede discutir;
  // una asumida, no.
  const tieneAlternativa = /sr-only|aria-label|a11y-exento/.test(bloque);

  if (esDecorativo && !tieneAlternativa) {
    hallazgos.push(
      `${nombre}: usa aria-hidden sin sr-only, aria-label ni un comentario "a11y-exento:" que lo justifique`
    );
    continue;
  }

  for (const match of bloque.matchAll(/text-([a-zA-Z0-9]+)(?:\/(\d{1,3}))?\b/g)) {
    const [clase, token, opacidad] = match;
    const hex = TOKENS[token];
    if (!hex) continue; // no es un token de color nuestro (text-sm, text-4xl…)

    const alfa = opacidad ? Number(opacidad) / 100 : 1;
    const r = ratio(hex, FONDO, alfa);
    const entrada = `${nombre}: ${clase} → ${r.toFixed(2)}:1`;

    if (esDecorativo) {
      if (!decorativos.includes(entrada)) decorativos.push(`${entrada}  (exento: aria-hidden + texto alternativo)`);
      continue;
    }

    if (r < AA_TEXTO_NORMAL) {
      hallazgos.push(`${entrada}  (mínimo AA: ${AA_TEXTO_NORMAL}:1)`);
    } else if (!comprobados.includes(entrada)) {
      comprobados.push(entrada);
    }
  }
}

if (hallazgos.length > 0) {
  console.error(`CONTRASTE INSUFICIENTE en ${COMPONENTE} sobre ${FONDO}:`);
  for (const h of new Set(hallazgos)) console.error(`  ${h}`);
  console.error("\nWCAG 2.1 AA exige 4.5:1 para texto normal.");
  console.error("Ojo: el aviso de la Directiva Omnibus es texto legal obligatorio.");
  process.exit(1);
}

console.log(`Contraste AA correcto en ${COMPONENTE}:`);
for (const c of comprobados.sort()) console.log(`  ${c}`);
if (decorativos.length > 0) {
  console.log("Exentos por decorativos:");
  for (const d of decorativos.sort()) console.log(`  ${d}`);
}
