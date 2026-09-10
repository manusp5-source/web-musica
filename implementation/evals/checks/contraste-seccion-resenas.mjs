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
 * La exención se evalúa **por elemento**, no por bloque de función.
 *
 * v1 miraba si la función entera contenía `aria-hidden`, y el crítico lo rompió en dos
 * minutos: metió un `<span aria-hidden>` decorativo cualquiera en otro punto de `Reviews`
 * y el eval dio por exento el párrafo del aviso legal, que no tiene nada de decorativo.
 * Una exención con granularidad de función es una puerta trasera con buena letra.
 *
 * v2 mantiene una pila de elementos abiertos y pregunta, para cada clase de color, si
 * **ese** nodo o alguno de sus ancestros está oculto a la accesibilidad.
 */
function ancestrosOcultos(codigo) {
  // Devuelve una función: posición → { oculto, apertura } del ancestro aria-hidden.
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
  // Lo que quede abierto al final (JSX mal cerrado o fragmentos) se ignora.
  return (pos) => tramos.some(([desde, hasta]) => pos >= desde && pos <= hasta);
}

const estaOculto = ancestrosOcultos(codigo);

const bloques = codigo
  .split(/(?=^(?:export default )?function\s+\w+)/m)
  .filter((b) => b.trim().length > 0);

let desplazamiento = 0;
for (const bloque of bloques) {
  const inicioBloque = codigo.indexOf(bloque, desplazamiento);
  desplazamiento = inicioBloque + bloque.length;
  const nombre = bloque.match(/function\s+(\w+)/)?.[1] ?? "(módulo)";

  for (const match of bloque.matchAll(/text-([a-zA-Z0-9]+)(?:\/(\d{1,3}))?\b/g)) {
    const [clase, token, opacidad] = match;
    const hex = TOKENS[token];
    if (!hex) continue; // no es un token de color nuestro (text-sm, text-4xl…)

    const alfa = opacidad ? Number(opacidad) / 100 : 1;
    const r = ratio(hex, FONDO, alfa);
    const entrada = `${nombre}: ${clase} → ${r.toFixed(2)}:1`;
    const posicionAbsoluta = inicioBloque + match.index;

    // ¿Este nodo concreto, o alguno de sus ancestros, está oculto a la accesibilidad?
    const oculto = estaOculto(posicionAbsoluta);

    if (oculto) {
      // La exención se gana con alternativa textual en el mismo bloque (sr-only,
      // aria-label) o con un comentario `a11y-exento:` que la justifique por escrito
      // cuando la alternativa vive en el componente padre.
      const tieneAlternativa = /sr-only|aria-label|a11y-exento/.test(bloque);
      if (!tieneAlternativa) {
        hallazgos.push(`${nombre}: ${clase} bajo aria-hidden sin alternativa textual ni "a11y-exento:"`);
        continue;
      }
      if (!decorativos.includes(entrada)) {
        decorativos.push(`${entrada}  (exento: el nodo está bajo aria-hidden y hay alternativa)`);
      }
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
