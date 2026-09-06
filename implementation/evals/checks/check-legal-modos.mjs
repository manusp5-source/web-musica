#!/usr/bin/env node
/**
 * EV-010 — la guardia de placeholders se comporta como dice, en los dos modos.
 *
 * Nace de un hallazgo de la review del 5 sep: `M0-IT-008` tenía `Eval ✓` marcado con la
 * única prueba de una frase en el work_log. Ejecutar algo a mano una vez no es un eval:
 * no lo repite nadie y una regresión pasa desapercibida. Ya hubo una (la regla de `social`
 * leía las URLs de los comentarios y daba falso negativo).
 *
 * Comprueba SEMÁNTICA, no el estado de hoy: seguirá siendo correcto cuando M2-IT-002
 * rellene los datos reales y `--strict` empiece a salir 0 sobre el site.ts de verdad.
 */
import { spawnSync } from "node:child_process";

const FIXTURES = "tests/fixtures";

function run(file, { strict }) {
  const args = ["scripts/check-legal.mjs", "--file", file];
  if (strict) args.push("--strict");
  const result = spawnSync("node", args, { encoding: "utf8" });
  return { code: result.status, out: (result.stdout || "") + (result.stderr || "") };
}

const casos = [
  {
    nombre: "con placeholders legales · modo aviso → no bloquea",
    file: `${FIXTURES}/site-con-placeholders.ts`,
    strict: false,
    esperado: 0,
    debeContener: "AVISO LEGAL INCOMPLETO",
  },
  {
    nombre: "con placeholders legales · --strict → bloquea",
    file: `${FIXTURES}/site-con-placeholders.ts`,
    strict: true,
    esperado: 1,
    debeContener: "art. 10 LSSI-CE",
  },
  {
    nombre: "legal relleno pero pendientes vacíos · --strict → NO bloquea",
    file: `${FIXTURES}/site-legal-ok-pendientes.ts`,
    strict: true,
    esperado: 0,
    debeContener: "PENDIENTE",
  },
  {
    nombre: "todo relleno · --strict → no bloquea y no avisa de nada",
    file: `${FIXTURES}/site-completo.ts`,
    strict: true,
    esperado: 0,
    debeContener: "Sin placeholders pendientes",
  },
  {
    nombre: "con placeholders · modo aviso detecta los 4 campos pendientes",
    file: `${FIXTURES}/site-con-placeholders.ts`,
    strict: false,
    esperado: 0,
    debeContener: "4 dato(s) sin rellenar",
  },
];

let fallos = 0;

for (const caso of casos) {
  const { code, out } = run(caso.file, { strict: caso.strict });
  const codigoOk = code === caso.esperado;
  const textoOk = out.includes(caso.debeContener);

  if (codigoOk && textoOk) {
    console.log(`  ok   ${caso.nombre}`);
    continue;
  }

  fallos += 1;
  console.error(`  FALLA ${caso.nombre}`);
  if (!codigoOk) console.error(`        exit esperado ${caso.esperado}, recibido ${code}`);
  if (!textoOk) console.error(`        falta en la salida: "${caso.debeContener}"`);
}

if (fallos > 0) {
  console.error(`\n${fallos} de ${casos.length} casos fallan.`);
  process.exit(1);
}

console.log(`\n${casos.length} casos correctos: la guardia bloquea solo por datos legales.`);
