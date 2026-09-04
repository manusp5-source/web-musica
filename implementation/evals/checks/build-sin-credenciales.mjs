#!/usr/bin/env node
/**
 * EV-009 — el build no depende de una red ni de credenciales.
 *
 * Construye con las variables de Google borradas del entorno del proceso hijo.
 * Si algún día alguien mete una llamada a la API dentro del build, este eval se
 * pone rojo antes de que lo haga un despliegue.
 */
import { spawnSync } from "node:child_process";

const STRIPPED = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "GBP_ACCOUNT_ID",
  "GBP_LOCATION_ID",
  "GBP_PROFILE_URL",
];

const env = { ...process.env };
for (const key of STRIPPED) delete env[key];

const result = spawnSync("npm", ["run", "build"], {
  env,
  encoding: "utf8",
  shell: true, // en Windows, npm es npm.cmd
});

if (result.status !== 0) {
  console.error("El build falló sin credenciales de Google:");
  console.error((result.stdout || "").split("\n").slice(-25).join("\n"));
  console.error(result.stderr || "");
  process.exit(1);
}

console.log(`Build correcto con ${STRIPPED.length} variables de Google ausentes del entorno.`);
