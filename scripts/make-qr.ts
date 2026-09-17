#!/usr/bin/env -S npx tsx
/**
 * Generador de códigos QR para imprenta — planning/intent-002.md.
 *
 * Uso: npm run qr
 *
 * Genera un SVG (vectorial, el máster) y un PNG (para pruebas de pantalla) por destino en
 * `assets/qr/` — **nunca** en `public/`: son piezas de imprenta, no recursos de la web.
 *
 * Dos destinos:
 *   - "web": site.domain. Siempre disponible una vez hay dominio.
 *   - "review": el enlace a la ficha de Google. Se lee de `data/reviews.json` →
 *     `profileUrl`, que puebla `npm run reviews:fetch` (M1-UJ-004) el día que exista la
 *     ficha. Mientras sea `null`, este script **avisa y no lo genera** — un QR impreso es
 *     inmutable, y apuntar a un placeholder es tirar la impresión.
 *
 * `.ts` en vez de `.mjs`: mismo motivo que `scripts/fetch-reviews.ts` (DEC-016). Necesita
 * `site.domain`, y Node 20 no importa TypeScript de forma nativa.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "../src/config/site";

const DIR_SALIDA = "assets/qr";
const RUTA_REVIEWS = "data/reviews.json";

// Legibilidad física, no estética (intent-002 §Restricciones):
// contraste alto, el dorado de la paleta no vale para los módulos.
const COLOR_MODULO = "#1C1B19"; // carbon
const COLOR_FONDO = "#FFFFFF"; // blanco puro, el papel real — no el marfil de pantalla
const ZONA_SILENCIO = 4; // módulos, mínimo recomendado por la especificación QR
const NIVEL_CORRECCION = "M"; // sin monograma en el centro (Q-03 de intent-002, sin resolver → M)
const ANCHO_PNG = 1800; // px. A 300 ppp cubre hasta ~15 cm de lado; sobra para 5 cm mínimo

type Destino = { id: keyof typeof site.qr; url: string | null; motivoAusencia?: string };

function resolverDestinos(): Destino[] {
  const destinos: Destino[] = [{ id: "web", url: esUrlValida(site.domain) ? site.domain : null }];
  if (destinos[0].url === null) {
    destinos[0].motivoAusencia = `site.domain sigue siendo un placeholder ("${site.domain}")`;
  }

  let profileUrl: string | null = null;
  let motivoReview: string | undefined;
  try {
    const datos = JSON.parse(readFileSync(RUTA_REVIEWS, "utf8"));
    profileUrl = typeof datos.profileUrl === "string" ? datos.profileUrl : null;
    if (!profileUrl) motivoReview = `${RUTA_REVIEWS} no tiene profileUrl todavía (B-01/B-02)`;
  } catch {
    motivoReview = `no se pudo leer ${RUTA_REVIEWS}`;
  }
  destinos.push({ id: "review", url: profileUrl, motivoAusencia: motivoReview });

  return destinos;
}

function esUrlValida(url: string): boolean {
  if (!url) return false;
  if (url.includes("tunombre.es")) return false; // el placeholder original de site.ts
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  let QRCode: typeof import("qrcode");
  try {
    QRCode = await import("qrcode");
  } catch {
    console.error('✗ Falta la dependencia "qrcode". Ejecuta: npm install -D qrcode');
    process.exitCode = 1;
    return;
  }

  if (!existsSync(DIR_SALIDA)) mkdirSync(DIR_SALIDA, { recursive: true });

  const destinos = resolverDestinos();
  let generados = 0;

  for (const destino of destinos) {
    const meta = site.qr[destino.id];

    if (!destino.url) {
      console.warn(`○ ${meta.label}: omitido — ${destino.motivoAusencia}. No se genera un QR a un placeholder.`);
      continue;
    }

    const opciones = {
      errorCorrectionLevel: NIVEL_CORRECCION,
      margin: ZONA_SILENCIO,
      color: { dark: COLOR_MODULO, light: COLOR_FONDO },
    } as const;

    const svg = await QRCode.toString(destino.url, { ...opciones, type: "svg" });
    writeFileSync(join(DIR_SALIDA, `${meta.filename}.svg`), svg, "utf8");

    await QRCode.toFile(join(DIR_SALIDA, `${meta.filename}.png`), destino.url, {
      ...opciones,
      type: "png",
      width: ANCHO_PNG,
    });

    console.log(`✓ ${meta.label} → ${destino.url}`);
    console.log(`  ${DIR_SALIDA}/${meta.filename}.svg (máster, vectorial)`);
    console.log(`  ${DIR_SALIDA}/${meta.filename}.png (${ANCHO_PNG}px, pruebas de pantalla)`);
    generados++;
  }

  if (generados === 0) {
    console.error("\n✗ Ningún destino tenía una URL real. No se generó nada.");
    process.exitCode = 1;
    return;
  }

  console.log(`\n${generados} de ${destinos.length} código(s) generado(s) en ${DIR_SALIDA}/.`);
}

main().catch((error) => {
  console.error(`✗ Fallo inesperado: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
