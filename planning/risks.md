# Registro de riesgos — web-musica

Actualizado: 2026-09-03

---

## Riesgos

| ID | Riesgo | Probabilidad | Impacto | Mitigación | Estado |
|----|--------|-------------|---------|-----------|--------|
| R-01 | Google no aprueba la cuota de Business Profile API, o tarda semanas | Alta | Alto | El contrato es `data/reviews.json`. La tubería se prueba con fixtures y el fichero se rellena a mano mientras tanto. Nada del plan depende de la aprobación | OPEN |
| R-02 | La ficha de Google **no existe**: hay que crearla y verificarla (correo postal o vídeo, días) | Alta | Alto | `docs/google-business-setup.md` con los pasos. No bloquea ningún IT ni UJ de este plan | OPEN |
| R-03 | La API v4 es legacy y Google puede retirarla | Media | Medio | Todo el conocimiento de Google vive en `src/lib/reviews/google.ts`. El resto del sistema solo conoce el esquema propio | OPEN |
| R-04 | El renombrado de carpeta rompe rutas absolutas, `node_modules` o el workspace del IDE | Media | Bajo | Hecho antes del primer commit, sin remoto que arrastrar. Verificación: `npm run build` después del rename | MITIGADO — rename ejecutado el 3 sep |
| R-05 | Los avatares de Google chocan con la CSP o con `images.remotePatterns` | Media | Bajo | Añadir `lh3.googleusercontent.com` explícitamente, **nunca un comodín** (un `**` convierte `/_next/image` en proxy abierto). Alternativa: iniciales en círculo, cero peticiones a Google | OPEN |
| R-06 | Playwright inestable o lento en CI por el hero 3D (three.js, WebGL en headless) | Media | Medio | Variable de entorno que desactiva `hero3d` en el entorno de e2e; el fallback de gradiente ya existe | OPEN |
| R-07 | Filtrar u ocultar reseñas negativas = práctica desleal (RDL 24/2021, Anexo I) | Baja | **Alto** (sanción) | Decisión de producto tomada: se muestran todas, sin filtro, con declaración visible de origen y verificación | MITIGADO por diseño |
| R-08 | Publicar nombre y foto de terceros sin base legal ni mención en la privacidad | Baja | Alto | `M1-UJ-005`: atribución + enlace al original + párrafo en la política de privacidad ES y EN | OPEN |
| R-09 | Un secreto (`refresh_token`) acaba en el bundle o en un commit | Baja | **Alto** | El fetch solo ocurre en Node. `.env` ya está en `.gitignore`. Eval `EV-006` hace `grep` del `.next` de producción | OPEN |
| R-10 | Testing Library o Vitest no encajan con React `19.0.0` fijado exacto | Baja | Medio | Testing Library ≥ 16 soporta React 19. Si falla, los componentes se cubren con Playwright y tests de render de servidor | OPEN |
| R-11 | El JSON-LD declara un `aggregateRating` que no coincide con las reseñas mostradas | Media | Medio | Ambos salen del mismo `data/reviews.json`; eval `EV-004` compara los dos números | OPEN |
| R-12 | La web nunca se publica porque los datos legales quedaron fuera de alcance | Media | Alto | Escrito en `scope.md` y en `docs/maintain.md` como señal vigilada. Requiere un intent nuevo | OPEN |

## Dependencias externas que pueden bloquear

| Dependencia | Bloquea | Fallback | Quién la desbloquea |
|---|---|---|---|
| Ficha de Google verificada | La conexión real de `M1-UJ-004` (no su código) | `data/reviews.json` manual | Manuel — crear y verificar la ficha |
| Cuota de Business Profile API aprobada | Ídem | Ídem | Google, tras solicitud de Manuel |
| `gh` CLI autenticado | `M0-IT-002` y con él el CI real (`M0-IT-005`) | Repo local, workflow escrito sin ejecutar | Manuel |
| Credenciales OAuth (`client_id`, `client_secret`, `refresh_token`) | Ejecución real de `npm run reviews:fetch` | Fixtures en los tests | Manuel, tras la aprobación |
