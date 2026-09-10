# Intent — Levantar el negocio de música en directo para eventos en Granada

```
ID      : INT-004
Fecha   : 2026-09-09
Autor   : Manuel
Estado  : borrador
Origen  : manual — petición de research de mercado y plan de negocio
```

> **Este fichero va antes que el diseño y antes del gate.** El alcance de INT-004 es de
> negocio, no de código: el software que salga de aquí se especifica en su propio intent
> (ver `Sistemas afectados`).

---

## Problema

La web está construida y **el negocio que la sostiene no está decidido**. Tres cosas
observables hoy:

1. **No hay posicionamiento elegido, solo un texto de web.** `src/i18n/dictionaries.ts:71`
   promete *"viola para la ceremonia, piano para el cóctel"*, que es una buena frase, pero
   nadie ha comprobado si existe demanda para ella, a qué precio, ni contra quién se compite.
2. **La competencia local es real y está muy por delante.** Viola Tempestad acumula 119
   opiniones con 5,0/5 y más de 300 bodas en Granada; el proyecto parte de cero reseñas y
   sin ficha de Google. Entrar sin saber esto es entrar a ciegas.
3. **No hay ningún número.** Ni precio, ni punto de equilibrio, ni cuántos eventos hacen
   falta para que la actividad se sostenga, ni qué capacidad real tiene una sola persona.
   Sin eso no se puede decidir si merece la pena darse de alta de autónomo.

## Resultado propuesto

Un informe de mercado con fuentes y un plan de negocio con números, que permitan decidir
—con datos, no con intuición— si se levanta el negocio, con qué posicionamiento y a qué
precio.

Entregado en dos documentos:

- [`docs/mercado-viola-eventos.md`](../docs/mercado-viola-eventos.md) — mercado, competencia,
  precios y canales. Toda cifra con fuente y fecha; lo no publicado, marcado como tal.
- [`docs/plan-negocio-viola.md`](../docs/plan-negocio-viola.md) — decisión, tarifa, economía
  unitaria, presupuesto de ventas, cuadro de mando y plan por fases.

**Producidos con las skills `c-suite-*`**, construidas sobre el MBA de EAE en esta misma
sesión: CEO, COO, CMO, CFO, CHRO y CDO, con crítico en rol distinto.

## Sistemas afectados

| Sistema | Cómo le afecta |
|---|---|
| `docs/` | Dos documentos nuevos. No tocan código |
| **INT-001** (reseñas de Google) | **Deja de ser una mejora y pasa a ser el cuello de botella comercial.** El plan hace depender de la ficha de Google el único canal de coste cero |
| **INT-003** (publicar la web) | Igual: sin dominio ni datos legales reales, la captación orgánica no existe y todo cuelga del portal de pago |
| `dictionaries.ts` | Dos cambios de contenido, **ninguno incluido en este intent**: publicar la tarifa de §4, y **quitar el piano en vivo** (`:59`, `:71`, `:135` y sus equivalentes en inglés) si se confirma la instrumentación de viola sola. Lo segundo **bloquea la publicación de la web** |
| Dashboard del negocio | Los KPIs del §10 del plan son su especificación. **Proyecto aparte**, con su propio `/init-project` y su propio gate |

## Restricciones

- **La capacidad es el techo duro**: ~38–40 eventos al año, de los cuales ~30 en sábado de
  temporada. Cualquier plan que la ignore es ficción.
- **Granada primero, España después.** Málaga y Sevilla quedan fuera del año 1.
- **Nada de cifras inventadas.** Lo que no está publicado se marca `no publicado`; las
  estimaciones propias van etiquetadas con su método.
- **Ninguna decisión irreversible la toma la IA**: alta de autónomo, compra de equipo y
  contratación del portal necesitan OK humano explícito.

## Qué NO entra

- **Publicar la tarifa en la web.** El plan la propone; llevarla a `dictionaries.ts` es
  otro trabajo.
- **El dashboard del negocio.** Va por `/init-project` en `viola-dashboard`, con su gate.
- **El alta de autónomo y la compra de equipo.** Son decisiones de Manuel, no tareas.
- **Contactar con clientes, planners o funerarias.** El plan lista a quién; ejecutarlo es
  trabajo humano.
- **Málaga, Sevilla y el mercado internacional de bodas de destino.**

## Criterio de éxito

1. Toda cifra externa del informe tiene fuente y fecha, o está marcada `no publicado`.
2. El punto de equilibrio está calculado **y comparado con la capacidad real**, no solo con
   el deseo.
3. Hay tres opciones estratégicas defendibles y una recomendación que **nombra su renuncia**.
4. Existe un escenario pesimista **con la decisión asociada**, no solo con el número.
5. El crítico ha pasado en rol distinto y sus correcciones están escritas, no borradas.
6. Las tres comprobaciones de coste cero que pueden invalidar el plan están identificadas
   **antes** de gastar un euro.

Los seis se cumplen en los documentos entregados.

## Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| **Plan de negocio sin research** | Es lo que ya había: una frase de web sin comprobar. El problema no era la falta de plan, era la falta de datos |
| **Research sin las skills del MBA** | Habría salido un informe genérico. El listón de "compara el punto de equilibrio con la capacidad" y "nombra la renuncia" viene del método, y sin él no se aplica |
| **Meter el plan en `OFERTA.md` de `agencia/`** | Este negocio no es de la agencia. Es personal y su sitio es este repo |
| **Levantar el dashboard primero** | Mediría KPIs inventados. Los indicadores salen del cuadro de mando del CFO, que no existía |

## Preguntas abiertas

Las tres de coste cero que pueden tumbar el plan, y que van antes que nada:

1. **¿Cuánto cuesta bodas.net para Granada?** Si supera 2.500 €/año, el canal sale del año 1.
2. **¿Qué porcentaje de bodas de Granada contrata música en directo?** Si es menor del 15%,
   se revisa el segmento. Se cierra con cinco llamadas.
3. **¿Cuáles son las tarifas reales de Viola Tempestad?** Define el techo de precio local.
   Solo se sabe pidiendo presupuesto.

Y dos de producto:

4. ¿Se publica la tarifa en la web? Es el diferenciador más barato del plan y el más
   incómodo de deshacer. No bloquea.
5. **¿Se toca el piano en vivo o no?** Resuelta en §2 del plan a favor de **viola sola en
   ceremonia y viola con base propia en cóctel**, con el coste estratégico anotado: sin
   piano en vivo el posicionamiento cae en la casilla del competidor de referencia.
   **Esta sí bloquea**, porque la web promete hoy piano en vivo en tres sitios.

## Aprobación

```
Estado : borrador
```

Pendiente de revisión de Manuel. **Este intent no abre código**: lo que abre es la decisión
de si se levanta el negocio y con qué forma.
