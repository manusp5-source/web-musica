# Selección de stack — web-musica

---

## Stack elegido

**Heredado (no se toca):** Next.js 15.5 · React 19.0.0 · Tailwind 3.4 · TypeScript 5.7 ·
three 0.184 + @react-three/fiber 9.6 · ESLint 9.

**Añadido en esta tanda, todo en `devDependencies`:**

| Paquete | Para qué |
|---|---|
| `zod` | Validar `data/reviews.json` en build y en tests |
| `vitest` + `@vitejs/plugin-react` + `jsdom` | Tests unitarios y de componente |
| `@testing-library/react` (≥16) + `@testing-library/jest-dom` | Render y aserciones sobre componentes con React 19 |
| `@playwright/test` | Smoke e2e de la home ES y EN |

**Cero dependencias nuevas en `dependencies`.** El bundle que recibe el visitante no crece
ni un byte por culpa de las reseñas.

## Razones

- **`fetch` nativo en lugar de un SDK de Google.** El paquete `googleapis` pesa decenas de
  megas y arrastra su propio grafo de dependencias para lo que aquí son dos peticiones
  HTTP. Node 20 trae `fetch`; el OAuth por refresh token es un POST con `URLSearchParams`.
- **Zod en vez de un validador a mano.** El fichero lo va a editar una persona a mano
  durante meses; un mensaje de error que diga qué campo falla vale su peso en oro. Y como
  solo corre en Node, no aparece en el bundle.
- **Vitest en vez de Jest.** Comparte configuración con el ecosistema Vite, arranca en
  milisegundos, y `rtk vitest run` filtra la salida al 99,5%.
- **Playwright limitado a smoke.** Tres pruebas: home ES renderiza, `/en` renderiza,
  sección de reseñas ausente con fichero vacío. No es una suite de regresión visual;
  es la red mínima que detecta que la página ha dejado de construir bien.
- **Server Component en vez de fetch de cliente.** Las reseñas son contenido, no
  interacción. Renderizarlas en build las hace indexables y elimina el estado de carga.

## Alternativas evaluadas y descartadas

| Alternativa | Por qué no |
|---|---|
| Places API (New) | Máximo 5 reseñas elegidas por Google y prohibición de cachear más de 30 días |
| Widget de terceros (Elfsight, Trustindex) | Cuota mensual, script externo incompatible con la CSP, y dependencia de un proveedor |
| `googleapis` o `google-auth-library` | Desproporcionado para dos peticiones |
| Jest | Configuración más pesada con ESM y Next |
| Cypress | Más lento en CI que Playwright para el mismo smoke |
| Validación con tipos TypeScript solamente | Los tipos desaparecen en runtime; un JSON editado a mano necesita validación real |
| Base de datos o CMS para las reseñas | Un fichero de 8 KB no necesita Postgres |
| ISR en Vercel | Hobby prohíbe uso comercial; Pro son 20 $/mes para un refresco diario |

## Riesgos del stack

| Riesgo | Mitigación |
|---|---|
| React `19.0.0` fijado exacto puede chocar con peer deps de Testing Library | Testing Library 16 declara soporte de React 19. Si falla: se cubre por Playwright |
| API v4 de Google es legacy | Aislada en `google.ts`; el resto solo conoce el esquema propio |
| three.js encarece el build y complica los e2e | `NEXT_PUBLIC_HERO3D=off` en el entorno de test; el fallback plano ya existe |
| Zod v4 introduce cambios de API respecto a v3 | Se fija el rango mayor en `package.json` y se declara aquí |
