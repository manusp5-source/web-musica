#!/usr/bin/env node
/**
 * EV-016 — el QR generado escanea de vuelta a la URL correcta, y el destino sin URL real
 * se omite de verdad, no solo en el mensaje.
 *
 * No hay impresora ni cámara en esta máquina para la "prueba de escaneo en papel" que
 * pide `planning/intent-002.md`. El proxy más cercano y honesto: generar de verdad con
 * el script real, decodificar el PNG resultante con un lector de QR de software
 * (`jsqr` + `pngjs`, devDependencies solo para esta comprobación) y confirmar que
 * devuelve exactamente la URL que se pidió — no una aproximación, un round-trip real.
 *
 * **Esto NO sustituye la prueba física.** Un módulo mal impreso, un contraste insuficiente
 * de tinta real o una distancia de lectura distinta a la simulada no los detecta un
 * decodificador de software. Queda declarado como límite, no escondido.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { PNG } from "pngjs";
import jsQR from "jsqr";

const DIR_SALIDA = "assets/qr";
const hallazgos = [];

// 1. Ejecutar el generador real, como proceso hijo — no se simula su salida.
const [bin, args] =
  process.platform === "win32"
    ? ["cmd.exe", ["/d", "/s", "/c", "npx tsx scripts/make-qr.ts"]]
    : ["npx", ["tsx", "scripts/make-qr.ts"]];

let salida = "";
try {
  salida = execFileSync(bin, args, { encoding: "utf8", timeout: 30_000 });
} catch (error) {
  hallazgos.push(`el generador falló: ${(error.stdout ?? "") + (error.stderr ?? "")}`);
}

// 2. El dominio real se lee de site.ts por regex, igual que hace check-legal.mjs — sin
// importar el módulo TypeScript desde un script que no pasa por tsx.
const siteSrc = readFileSync("src/config/site.ts", "utf8");
const dominioMatch = siteSrc.match(/domain:\s*"([^"]+)"/);
const dominioEsperado = dominioMatch?.[1];
if (!dominioEsperado) hallazgos.push("no se pudo extraer site.domain de site.ts");

// 3. El SVG máster existe y es vectorial de verdad (no una imagen incrustada).
const svgPath = `${DIR_SALIDA}/web.svg`;
if (!existsSync(svgPath)) {
  hallazgos.push(`falta ${svgPath}`);
} else {
  const svg = readFileSync(svgPath, "utf8");
  if (!svg.includes("<svg") || !svg.includes("<path")) {
    hallazgos.push(`${svgPath} no parece un SVG vectorial válido`);
  }
}

// 4. El PNG decodifica exactamente a la URL esperada, y tiene resolución suficiente.
const pngPath = `${DIR_SALIDA}/web.png`;
if (!existsSync(pngPath)) {
  hallazgos.push(`falta ${pngPath}`);
} else {
  const png = PNG.sync.read(readFileSync(pngPath));
  if (png.width < 600) {
    hallazgos.push(`${pngPath} mide ${png.width}px — por debajo del mínimo de 600px (≈5cm a 300ppp)`);
  }
  const resultado = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  if (!resultado) {
    hallazgos.push(`${pngPath} no decodifica — ¿contraste o zona de silencio insuficientes?`);
  } else if (dominioEsperado && resultado.data !== dominioEsperado) {
    hallazgos.push(`${pngPath} decodifica a "${resultado.data}", se esperaba "${dominioEsperado}"`);
  }
}

// 5. El destino sin URL real (hoy, "review") NO generó ficheros — la omisión es real,
// no solo un mensaje por consola.
for (const ext of ["svg", "png"]) {
  const ruta = `${DIR_SALIDA}/resena-google.${ext}`;
  if (existsSync(ruta)) {
    hallazgos.push(`${ruta} existe, pero data/reviews.json no tiene profileUrl — no debería haberse generado`);
  }
}

// 6. Nada se escribió fuera de assets/qr/ (comprobación superficial: public/ no tiene
// ficheros de QR, que sería el descuido más probable).
if (existsSync("public")) {
  const enPublic = readdirSync("public").filter((f) => /^(web|resena-google)\.(svg|png)$/.test(f));
  if (enPublic.length > 0) hallazgos.push(`ficheros de QR encontrados en public/: ${enPublic.join(", ")}`);
}

if (hallazgos.length > 0) {
  console.error("QR — ALGO NO CUADRA:");
  for (const h of hallazgos) console.error(`  ${h}`);
  console.error("\nRecordatorio: esto decodifica en software. No sustituye escanear el papel impreso de verdad.");
  process.exit(1);
}

console.log(`QR "web" → decodifica a "${dominioEsperado}", ${statSync(pngPath).size}B, resolución suficiente.`);
console.log('QR "review" correctamente omitido: no hay profileUrl todavía.');
console.log("Límite declarado: esta comprobación es un decodificador de software, no una prueba de escaneo en papel real.");
