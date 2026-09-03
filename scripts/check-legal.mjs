// Comprueba que los datos legales reales están rellenados antes de publicar.
// Uso:  node scripts/check-legal.mjs           → solo avisa
//       node scripts/check-legal.mjs --strict  → falla (para CI/deploy)
import { readFileSync } from "node:fs";

const src = readFileSync("src/config/site.ts", "utf8");
const placeholders = src.match(/\[(NOMBRE Y APELLIDOS|NIF \/ DNI|Dirección postal completa)\]/g) || [];
const strict = process.argv.includes("--strict");

if (placeholders.length > 0) {
  console.warn(
    `\n⚠️  AVISO LEGAL INCOMPLETO: ${placeholders.length} placeholder(s) sin rellenar en src/config/site.ts → ${placeholders.join(", ")}` +
      `\n   Publicar así incumple el art. 10 LSSI-CE y el art. 13 RGPD. Rellena site.legal antes del deploy.\n`
  );
  if (strict) process.exit(1);
} else {
  console.log("✓ Datos legales rellenados.");
}
