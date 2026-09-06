// Comprueba que los datos reales están rellenados antes de publicar.
// Uso:  node scripts/check-legal.mjs           → solo avisa
//       node scripts/check-legal.mjs --strict  → falla si falta algo LEGAL (para CI/deploy)
//
// Dos niveles, a propósito:
//   LEGAL       — obligatorio por ley (art. 10 LSSI-CE, art. 13 RGPD). Con --strict, bloquea.
//   PENDIENTE   — placeholders que no son ilegales, solo dejan la web a medias.
//                 Avisan siempre y NUNCA bloquean: rellenarlos está fuera del alcance de M0.
//       node scripts/check-legal.mjs --file <ruta>  → comprueba otro fichero (evals)
import { readFileSync } from "node:fs";

// --file existe para que EV-010 pueda ejercitar los dos desenlaces —con y sin
// placeholders— sin tocar el site.ts real. Un script que solo se puede probar
// modificando la configuración de verdad es un script que no se prueba.
const fileFlag = process.argv.indexOf("--file");
const target = fileFlag !== -1 ? process.argv[fileFlag + 1] : "src/config/site.ts";

const src = readFileSync(target, "utf8");
const strict = process.argv.includes("--strict");

// --- Nivel LEGAL ---
const legalPlaceholders =
  src.match(/\[(NOMBRE Y APELLIDOS|NIF \/ DNI|Dirección postal completa)\]/g) || [];

// --- Nivel PENDIENTE ---
// Cada regla dice qué buscar y por qué importa, para que el aviso sea accionable.
const pendingRules = [
  {
    field: "domain",
    test: () => /domain:\s*"https:\/\/tunombre\.es"/.test(src),
    why: "sitemap.xml, robots.txt, canonical y hreflang publican un dominio que no existe",
  },
  {
    field: "whatsapp",
    test: () => /whatsapp:\s*"34600000000"/.test(src),
    why: "el botón de WhatsApp no lleva a ningún sitio y el número sale como telephone en el JSON-LD",
  },
  {
    field: "media.youtubeIds",
    test: () => /youtubeIds:\s*\["",\s*"",\s*""\]/.test(src),
    why: "la sección de vídeos enseña tres huecos",
  },
  {
    field: "social",
    test: () => {
      const block = src.match(/social:\s*\{([\s\S]*?)\n\s*\},/);
      if (!block) return false;
      // Sin los comentarios: si no, las URLs de ejemplo de los `//  https://…  ←CAMBIAR`
      // cuentan como perfiles rellenados y la regla nunca salta.
      //
      // El `(^|\s)` NO es decorativo: sin él, este replace se come también el `//` de
      // `https://`, deja `"https:` y da por vacía una red que sí estaba rellenada.
      // Un comentario empieza tras espacio o al principio de línea; el de una URL va
      // pegado a los dos puntos. Lo cazó EV-010 en su primera ejecución.
      const values = block[1].replace(/(^|\s)\/\/.*$/gm, "$1");
      return !/https?:\/\//.test(values);
    },
    why: "no hay ni un perfil social enlazado, y sameAs del JSON-LD sale vacío",
  },
];

const pending = pendingRules.filter((rule) => rule.test());

if (pending.length > 0) {
  console.warn(`\n○ PENDIENTE: ${pending.length} dato(s) sin rellenar en ${target}`);
  for (const rule of pending) {
    console.warn(`   · site.${rule.field} — ${rule.why}`);
  }
  console.warn("   No bloquea el build. Bloquea que la web sirva para algo.\n");
}

if (legalPlaceholders.length > 0) {
  console.warn(
    `⚠️  AVISO LEGAL INCOMPLETO: ${legalPlaceholders.length} placeholder(s) sin rellenar en ${target} → ${legalPlaceholders.join(", ")}` +
      `\n   Publicar así incumple el art. 10 LSSI-CE y el art. 13 RGPD. Rellena site.legal antes del deploy.\n`
  );
  if (strict) process.exit(1);
} else {
  console.log("✓ Datos legales rellenados.");
  if (pending.length === 0) console.log("✓ Sin placeholders pendientes.");
}
