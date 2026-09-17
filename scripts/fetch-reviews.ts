#!/usr/bin/env -S npx tsx
/**
 * CLI de sincronización de reseñas — M1-UJ-004.
 *
 * Uso:
 *   npm run reviews:fetch            sincroniza y sobrescribe data/reviews.json
 *   npm run reviews:fetch -- --dry   imprime lo que escribiría, no toca el fichero
 *
 * Ejecutado con `tsx` (devDependency) porque Node 20 —la versión fijada en
 * design/stack_selection.md y en el CI— no puede importar `.ts` de forma nativa, y
 * `src/lib/reviews/sync.ts` reutiliza el mismo mapeo y el mismo esquema Zod que ya
 * prueban `tests/unit/reviews-google.test.ts` y `reviews-sync.test.ts`. Ver DEC-016.
 *
 * Toda la lógica de negocio vive en `src/lib/reviews/sync.ts` (probada con fixtures,
 * sin red). Este fichero es deliberadamente fino: lee argv y `.env`, llama a `runSync`,
 * y decide si escribe en disco. Exit 0 solo si escribió (o si `--dry` completó sin
 * errores); cualquier fallo, exit ≠ 0 y `data/reviews.json` intacto.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { runSync } from "../src/lib/reviews/sync";

const RUTA_DATOS = "data/reviews.json";
const RUTA_ENV = ".env";

function cargarEnv(): void {
  // Sin dependencias: un .env es "CLAVE=valor" por línea. Next carga .env solo para su
  // propio proceso; este script se ejecuta fuera de Next, así que se lee a mano.
  if (!existsSync(RUTA_ENV)) return;
  for (const linea of readFileSync(RUTA_ENV, "utf8").split("\n")) {
    const limpia = linea.trim();
    if (!limpia || limpia.startsWith("#")) continue;
    const igual = limpia.indexOf("=");
    if (igual === -1) continue;
    const clave = limpia.slice(0, igual).trim();
    let valor = limpia.slice(igual + 1).trim();
    if ((valor.startsWith('"') && valor.endsWith('"')) || (valor.startsWith("'") && valor.endsWith("'"))) {
      valor = valor.slice(1, -1);
    }
    if (!(clave in process.env)) process.env[clave] = valor;
  }
}

async function main() {
  cargarEnv();
  const dry = process.argv.includes("--dry");

  const resultado = await runSync({ env: process.env, dry });

  if (!resultado.ok) {
    const { error } = resultado;
    // Nunca se imprime el error "en bruto": solo su mensaje y su pista, que están
    // escritos a mano para no incluir jamás client_secret ni refresh_token.
    console.error(`✗ ${error.message}`);
    const hint = (error as { hint?: string }).hint;
    if (hint) console.error(`  ${hint}`);
    process.exitCode = 1;
    return;
  }

  const { file } = resultado;
  const resumen = `${file.reviews.length} reseñas · media ${file.aggregate.rating} · ${
    dry ? "(--dry, no escrito)" : "escrito"
  }`;

  if (dry) {
    console.log(resumen);
    return;
  }

  const contenido = JSON.stringify(file, null, 2) + "\n";
  writeFileSync(RUTA_DATOS, contenido, "utf8");
  console.log(resumen);
}

main().catch((error) => {
  // Red de seguridad final: cualquier fallo no contemplado también sale por stderr sin
  // volcar el objeto de error completo (podría llevar datos de la petición HTTP).
  console.error(`✗ Fallo inesperado: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
