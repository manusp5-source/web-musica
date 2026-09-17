#!/usr/bin/env node
/**
 * EV-011 — la CSP y `images.remotePatterns` se amplían con hosts concretos, nunca con
 * comodines. Principio no negociable de design/constitution.md.
 *
 * Nace del hallazgo del crítico (9 sep 2026): `img-src 'self' https: data:` llevaba desde
 * el principio del proyecto permitiendo **cualquier** host HTTPS. `remotePatterns` sí
 * respetaba la regla; la CSP no. Nadie lo había mirado porque la constitución nombraba
 * `remotePatterns` de forma explícita y la CSP solo de pasada.
 */
import { readFileSync } from "node:fs";

const CONFIG = "next.config.mjs";
const src = readFileSync(CONFIG, "utf8");

const hallazgos = [];

// 1. Directivas de CSP con comodín de esquema (`https:` a secas) o de host (`*`).
const csp = src.match(/"Content-Security-Policy"[\s\S]*?\]\.join\("; "\)/);
if (!csp) {
  hallazgos.push("no se encontró la Content-Security-Policy en next.config.mjs");
} else {
  // Directivas donde un comodín es una puerta abierta. `'self'`, `'none'`, `data:` y
  // `blob:` no son comodines: acotan a origen propio o a datos embebidos.
  const lineas = csp[0].match(/"[a-z-]+ [^"]*"/g) ?? [];
  for (const linea of lineas) {
    const [directiva, ...valores] = linea.replace(/"/g, "").split(/\s+/);
    for (const valor of valores) {
      // `https:` o `http:` a secas = cualquier host de ese esquema.
      if (/^https?:$/.test(valor)) {
        hallazgos.push(`${CONFIG}: "${directiva}" acepta el esquema completo "${valor}" — cualquier host`);
      }
      // `*` suelto o subdominio comodín.
      if (valor === "*" || valor.startsWith("*.")) {
        hallazgos.push(`${CONFIG}: "${directiva}" usa el comodín "${valor}"`);
      }
    }
  }
}

// 2. remotePatterns con hostname comodín: convierte /_next/image en proxy abierto (SSRF).
for (const match of src.matchAll(/hostname:\s*"([^"]+)"/g)) {
  if (match[1].includes("*")) {
    hallazgos.push(`${CONFIG}: remotePatterns con hostname comodín "${match[1]}" — /_next/image se vuelve un proxy abierto`);
  }
}

if (hallazgos.length > 0) {
  console.error("COMODINES EN LA POLÍTICA DE SEGURIDAD:");
  for (const h of hallazgos) console.error(`  ${h}`);
  console.error("\nconstitution.md: se amplían con hosts concretos, nunca con comodines.");
  process.exit(1);
}

console.log("CSP y remotePatterns sin comodines: todos los orígenes son hosts concretos.");
