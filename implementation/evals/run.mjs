#!/usr/bin/env node
/**
 * Runner de evals — M0-IT-006
 *
 * Recorre implementation/evals/*.eval.md, extrae el comando del bloque ```bash que
 * hay bajo "## Comando", lo ejecuta desde la raíz del proyecto y devuelve exit != 0
 * si falla alguno.
 *
 * Un eval cuyo comando siga siendo el placeholder de la plantilla se cuenta como
 * PENDIENTE, no como aprobado: lo que no se ejecuta no pasa.
 */
import { execSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const EVALS_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(EVALS_DIR, "..", "..");

const PLACEHOLDER = /^\[comando\]$/m;

function extractCommand(markdown) {
  // El primer bloque ```bash que aparece después del encabezado "## Comando"
  const section = markdown.split(/^##\s+Comando\s*$/m)[1];
  if (!section) return null;
  const fence = section.match(/```(?:bash|sh)?\n([\s\S]*?)```/);
  if (!fence) return null;

  const body = fence[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .join(" && ");

  return body || null;
}

const files = readdirSync(EVALS_DIR)
  .filter((f) => f.endsWith(".eval.md"))
  .sort();

if (files.length === 0) {
  console.error("No hay ningún fichero *.eval.md en implementation/evals/");
  process.exit(1);
}

const results = [];

for (const file of files) {
  const markdown = readFileSync(join(EVALS_DIR, file), "utf8");
  const id = file.replace(/\.eval\.md$/, "");
  const command = extractCommand(markdown);

  if (!command || PLACEHOLDER.test(command)) {
    results.push({ id, status: "PENDIENTE", detail: "sin comando todavía" });
    continue;
  }

  process.stdout.write(`▸ ${id} … `);
  const started = Date.now();
  try {
    execSync(command, { cwd: PROJECT_ROOT, stdio: "pipe", encoding: "utf8" });
    const secs = ((Date.now() - started) / 1000).toFixed(1);
    console.log(`PASA (${secs}s)`);
    results.push({ id, status: "PASA", detail: command });
  } catch (error) {
    console.log("FALLA");
    const output = [error.stdout, error.stderr].filter(Boolean).join("\n").trim();
    results.push({ id, status: "FALLA", detail: output.split("\n").slice(-12).join("\n") });
  }
}

console.log("\n─────────── RESUMEN ───────────");
for (const r of results) {
  console.log(`${r.status.padEnd(10)} ${r.id}`);
}

const failed = results.filter((r) => r.status === "FALLA");
const pending = results.filter((r) => r.status === "PENDIENTE");

if (failed.length > 0) {
  console.log("\n─────────── FALLOS ───────────");
  for (const f of failed) {
    console.log(`\n${f.id}:\n${f.detail}`);
  }
}

console.log(
  `\n${results.filter((r) => r.status === "PASA").length} pasan · ` +
    `${failed.length} fallan · ${pending.length} pendientes`
);

// Los pendientes no tumban la suite, pero se ven. Los fallos sí.
process.exit(failed.length > 0 ? 1 : 0);
