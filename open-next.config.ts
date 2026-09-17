import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Sin overrides: el build entero sale estático (13/13 rutas "○ Static" en next build,
// sin ISR ni Server Actions). El incremental cache por defecto basta — un bucket R2 sería
// infraestructura para una funcionalidad que este sitio no usa.
export default defineCloudflareConfig();
