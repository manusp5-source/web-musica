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

function extractCommand(texto) {
  // Normaliza CRLF antes de nada. En Windows git convierte los finales de línea al
  // clonar, y el regex del bloque ```bash esperaba \n pegado al fence: con \r en medio
  // no encontraba nada y **toda la suite salía PENDIENTE en silencio** — cero fallos y
  // cero ejecuciones, que es el peor resultado posible. Lo delató el propio runner el
  // 10 sep al reescribir un eval con otro final de línea.
  const markdown = texto.replace(/\r\n/g, "\n");

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

/**
 * Evals listados en el registro del README pero sin fichero en disco.
 *
 * Hallazgo de la review del 5-6 sep: recorrer el directorio no basta. `EV-008` llevaba
 * días listado como pendiente sin fichero, y el runner no podía echarlo en falta porque
 * solo ve lo que existe. Un eval listado y ausente es peor que uno que falta: parece
 * cubierto.
 *
 * Regla: si el registro dice que un eval PASA y no hay fichero, es un fallo duro
 * (alguien marcó verde algo que no se ejecuta). Si dice PENDIENTE, se enseña como FALTA
 * y no tumba la suite: su UJ todavía no está construido.
 */
function evalsDelRegistro() {
  let readme;
  try {
    readme = readFileSync(join(EVALS_DIR, "README.md"), "utf8");
  } catch {
    return [];
  }

  const filas = [];
  for (const linea of readme.split("\n")) {
    if (!linea.startsWith("|")) continue;
    if (linea.includes("ABSORBIDO")) continue; // cubierto por otro eval, a propósito
    const id = linea.match(/\bEV-(\d{3})\b/);
    if (!id) continue;
    filas.push({ id: `EV-${id[1]}`, pendiente: linea.includes("PENDIENTE") });
  }
  return filas;
}

const files = readdirSync(EVALS_DIR)
  .filter((f) => f.endsWith(".eval.md"))
  .sort();

const enDisco = new Set(files.map((f) => f.replace(/\.eval\.md$/, "")));
const ausentes = evalsDelRegistro().filter((fila) => !enDisco.has(fila.id));

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

for (const fila of ausentes) {
  results.push({
    id: fila.id,
    status: fila.pendiente ? "FALTA" : "FALLA",
    detail: fila.pendiente
      ? "listado en el registro como pendiente, todavía sin fichero"
      : "EL REGISTRO LO DA POR BUENO Y NO EXISTE EL FICHERO. Alguien marcó verde algo que no se ejecuta.",
  });
}

console.log("\n─────────── RESUMEN ───────────");
for (const r of results) {
  console.log(`${r.status.padEnd(10)} ${r.id}`);
}

const failed = results.filter((r) => r.status === "FALLA");
const pending = results.filter((r) => r.status === "PENDIENTE" || r.status === "FALTA");

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
