#!/usr/bin/env node
/**
 * EV-006 — eval de trayectoria: ningún secreto llega al bundle.
 *
 * Escrito en Node y no como `grep` a propósito: el runner puede lanzarse desde
 * PowerShell, donde grep no existe. Un eval que solo funciona en una shell es un
 * eval que un día deja de ejecutarse sin que nadie se entere.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const BUILD_DIR = ".next";

// Nombres de credencial que nunca deben aparecer en el build.
const FORBIDDEN_NAMES = ["client_secret", "refresh_token", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"];

// Y, si están en el entorno, sus valores reales.
const FORBIDDEN_VALUES = [process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REFRESH_TOKEN]
  .filter((v) => typeof v === "string" && v.length >= 8);

const TEXT_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".json", ".html", ".css", ".txt", ".map"]);

function walk(dir, found) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "cache") continue; // caché de build, no se publica
      walk(path, found);
      continue;
    }

    const dot = entry.name.lastIndexOf(".");
    if (dot === -1 || !TEXT_EXTENSIONS.has(entry.name.slice(dot))) continue;
    if (statSync(path).size > 8 * 1024 * 1024) continue;

    const content = readFileSync(path, "utf8");
    for (const needle of [...FORBIDDEN_NAMES, ...FORBIDDEN_VALUES]) {
      if (content.includes(needle)) {
        found.push({ path, needle: FORBIDDEN_VALUES.includes(needle) ? "<valor real de una credencial>" : needle });
      }
    }
  }
  return found;
}

try {
  statSync(BUILD_DIR);
} catch {
  console.error(`No existe ${BUILD_DIR}/. Ejecuta "npm run build" antes de este eval.`);
  process.exit(1);
}

const hits = walk(BUILD_DIR, []);

if (hits.length > 0) {
  console.error("SECRETOS EN EL BUILD:");
  for (const hit of hits) console.error(`  ${hit.path} → ${hit.needle}`);
  process.exit(1);
}

console.log(`Sin secretos en ${BUILD_DIR}/ (${FORBIDDEN_NAMES.length} nombres y ${FORBIDDEN_VALUES.length} valores comprobados).`);
