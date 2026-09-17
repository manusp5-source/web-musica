#!/usr/bin/env node
/**
 * EV-005 (mitad 2) — el CLI real, ejecutado como proceso aparte, falla ANTES de tocar
 * la red o el disco cuando faltan credenciales.
 *
 * La mitad 1 de EV-005 (`reviews-google.test.ts`, `reviews-sync.test.ts`) prueba la
 * lógica con `fetch` mockeado. Esto complementa esa mitad ejecutando el binario de
 * verdad (`npx tsx scripts/fetch-reviews.ts`) en un proceso hijo, sin variables de
 * Google en el entorno, y comprobando dos cosas que un mock no puede demostrar:
 *
 *   1. El exit code real del proceso es ≠ 0.
 *   2. `data/reviews.json` no cambia ni un byte (hash SHA-256 antes y después).
 *
 * No requiere red: la comprobación de variables de entorno ocurre en `runSync` antes
 * de la primera llamada a `fetch`, así que esto es rápido y determinista incluso sin
 * conexión a internet — a diferencia de un test que sí intentara autenticar con
 * credenciales falsas contra Google de verdad.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const RUTA_DATOS = "data/reviews.json";

function hash() {
  if (!existsSync(RUTA_DATOS)) return null;
  return createHash("sha256").update(readFileSync(RUTA_DATOS)).digest("hex");
}

const antes = hash();

// Entorno limpio de credenciales de Google, sea lo que sea que tenga la máquina.
const env = { ...process.env };
for (const clave of ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "GBP_ACCOUNT_ID", "GBP_LOCATION_ID"]) {
  delete env[clave];
}

// En Windows, `npx` es un .cmd: spawnSync no puede ejecutarlo directamente sin shell
// (EINVAL), y pasar `shell: true` junto a un array de argumentos es justo lo que Node
// avisa (DEP0190) que no escapa. Se evita el aviso invocando `cmd.exe` de forma
// explícita con la orden entera como una única cadena fija (sin interpolar nada
// externo, así que no hay riesgo de inyección real que la advertencia señale).
const [bin, args] =
  process.platform === "win32"
    ? ["cmd.exe", ["/d", "/s", "/c", "npx tsx scripts/fetch-reviews.ts"]]
    : ["npx", ["tsx", "scripts/fetch-reviews.ts"]];

let salida = "";
let exitCode = 0;
try {
  salida = execFileSync(bin, args, {
    env,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 30_000,
  });
} catch (error) {
  exitCode = typeof error.status === "number" ? error.status : 1;
  salida = (error.stdout ?? "") + (error.stderr ?? "");
}

const despues = hash();
const hallazgos = [];

if (exitCode === 0) {
  hallazgos.push(`el proceso debía salir con exit ≠ 0 sin credenciales, y salió 0`);
}
if (antes !== despues) {
  hallazgos.push(`${RUTA_DATOS} cambió sin credenciales (hash antes=${antes}, después=${despues})`);
}
if (!/variables de entorno/i.test(salida)) {
  hallazgos.push(`el mensaje no menciona las variables que faltan: "${salida.trim().slice(0, 200)}"`);
}

if (hallazgos.length > 0) {
  console.error("EL CLI NO SE COMPORTÓ COMO DEBÍA SIN CREDENCIALES:");
  for (const h of hallazgos) console.error(`  ${h}`);
  process.exit(1);
}

console.log(`CLI sin credenciales: exit ${exitCode}, ${RUTA_DATOS} intacto, mensaje accionable.`);
