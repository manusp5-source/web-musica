#!/usr/bin/env node
/**
 * EV-014 — la navegación fija es legible en cualquier estado, contra cualquier fondo.
 *
 * Nace del hallazgo de la review (pasada 6, 9-10 sep 2026): el header arrancaba con
 * `bg-transparent` sobre el gradiente oscuro del hero y texto `text-carbon` fijo —
 * medido con captura real y muestreo de píxel: logo ≈1,00:1, enlaces 1,1-1,3:1. Es lo
 * primero que ve el 100% de las visitas, en los dos idiomas, y ningún eval lo vigilaba.
 *
 * Dos comprobaciones, no una:
 *
 * 1. **Prohibido `bg-transparent` en el header.** Un fondo totalmente transparente hace
 *    que la legibilidad dependa de lo que haya detrás — hoy el gradiente del hero, mañana
 *    una foto, pasado un vídeo — y eso no se puede verificar de forma estática. Es la
 *    causa raíz del bug, no solo su síntoma.
 * 2. **Los tonos declarados pasan AA contra los dos extremos posibles**, no contra un
 *    fondo supuesto: se compone el color del panel (que puede llevar alfa, ej. `/90`)
 *    sobre marfil y sobre carbón — los dos extremos reales de la paleta — y el texto
 *    tiene que leerse en ambos casos.
 */
import { readFileSync } from "node:fs";

const COMPONENTE = "src/components/Nav.tsx";
const AA_TEXTO_NORMAL = 4.5;

const TOKENS = {
  carbon: "#1C1B19",
  carbon2: "#33312D",
  marfil: "#FAF7F2",
  marfil2: "#F2ECE2",
  dorado: "#C9A86A",
  bronce: "#7A5F2E",
};

// Los dos extremos reales de la paleta: cualquier cosa detrás del header (gradiente,
// foto, vídeo futuro) queda, en el peor caso, tan clara como marfil o tan oscura como
// carbón. Si el panel pasa contra los dos, pasa contra lo que sea que haya detrás.
const EXTREMOS = [TOKENS.marfil, TOKENS.carbon];

function aRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function componer(color, fondo, alfa) {
  return color.map((c, i) => Math.round(c * alfa + fondo[i] * (1 - alfa)));
}
function luminancia([r, g, b]) {
  const canal = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}
function ratioPlano(hexA, hexB) {
  const l1 = luminancia(aRgb(hexA));
  const l2 = luminancia(aRgb(hexB));
  const [claro, oscuro] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (claro + 0.05) / (oscuro + 0.05);
}

/** Extrae {token, alfa} del primer "color[/NN]" de tailwind reconocible en una cadena. */
function primerColor(clase, prefijo) {
  const re = new RegExp(`${prefijo}-([a-zA-Z0-9]+)(?:/(\\d{1,3}))?\\b`);
  const m = clase.match(re);
  if (!m) return null;
  const hex = TOKENS[m[1]];
  if (!hex) return null;
  return { hex, alfa: m[2] ? Number(m[2]) / 100 : 1 };
}

const codigo = readFileSync(COMPONENTE, "utf8");

const hallazgos = [];

// --- 1. bg-transparent prohibido en el header ---
const headerMatch = codigo.match(/<header[\s\S]*?>/);
if (!headerMatch) {
  hallazgos.push("no se encontró <header> en Nav.tsx");
} else if (/bg-transparent/.test(headerMatch[0])) {
  hallazgos.push(
    "el header usa bg-transparent: la legibilidad del texto queda a merced de lo que " +
      "haya detrás (hero, foto, vídeo) y eso no se puede verificar de forma estática"
  );
}

// --- 2. Los tonos declarados como `const NOMBRE = scrolled ? "A" : "B";` pasan AA ---
const declaraciones = [...codigo.matchAll(/const\s+(\w+)\s*=\s*scrolled\s*\?\s*"([^"]*)"\s*:\s*"([^"]*)"/g)];

if (declaraciones.length === 0) {
  hallazgos.push(
    "no hay ningún tono declarado como `const x = scrolled ? \"...\" : \"...\"` — " +
      "no se puede verificar que el color cambie con el estado de scroll"
  );
}

// El panel (fondo del header) se busca explícitamente porque el resto de tonos se miden
// contra él; si no está declarado con ese patrón, se asume el peor caso (sin panel propio).
const panelDecl = declaraciones.find((d) => d[1].toLowerCase().includes("panel"));

for (const [, nombre, ramaScroll, ramaTop] of declaraciones) {
  // ramaScroll = cuando scrolled===true, ramaTop = cuando scrolled===false (arriba del todo)
  for (const [estado, clase] of [["scrolled", ramaScroll], ["arriba", ramaTop]]) {
    const esPanel = panelDecl && nombre === panelDecl[1];
    const color = esPanel ? primerColor(clase, "bg") : primerColor(clase, "text");
    if (!color) continue; // sin color reconocible en esta rama (p. ej. solo "shadow-sm")

    if (esPanel) continue; // el panel se evalúa como fondo, no como texto suelto

    // Fondo con el que se compara: el panel del MISMO estado, si existe; si no, los
    // dos extremos de la paleta directamente (peor caso sin red de seguridad propia).
    const panelRama = panelDecl ? (estado === "scrolled" ? panelDecl[2] : panelDecl[3]) : null;
    const panelColor = panelRama ? primerColor(panelRama, "bg") : null;

    for (const extremo of EXTREMOS) {
      const fondoEfectivo = panelColor
        ? componer(aRgb(panelColor.hex), aRgb(extremo), panelColor.alfa)
        : aRgb(extremo);
      const fondoHexAprox = `#${fondoEfectivo.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

      const textoEfectivo = componer(aRgb(color.hex), fondoEfectivo, color.alfa);
      const l1 = luminancia(textoEfectivo);
      const l2 = luminancia(fondoEfectivo);
      const [claro, oscuro] = l1 > l2 ? [l1, l2] : [l2, l1];
      const r = (claro + 0.05) / (oscuro + 0.05);

      if (r < AA_TEXTO_NORMAL) {
        hallazgos.push(
          `${nombre} (${estado}, fondo detrás ≈ ${extremo}) → ${r.toFixed(2)}:1 ` +
            `(mínimo AA: ${AA_TEXTO_NORMAL}:1, panel efectivo ≈ ${fondoHexAprox})`
        );
      }
    }
  }
}

if (hallazgos.length > 0) {
  console.error(`CONTRASTE/LEGIBILIDAD INSUFICIENTE en ${COMPONENTE}:`);
  for (const h of new Set(hallazgos)) console.error(`  ${h}`);
  console.error("\nEs el header fijo: lo ve el 100% de las visitas, en el primer instante.");
  process.exit(1);
}

console.log(`Navegación legible en ${COMPONENTE}: sin bg-transparent, tonos verificados contra marfil y carbón.`);
