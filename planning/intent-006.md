# Intent — La web dice lo que el negocio decidió

```
ID      : INT-006
Fecha   : 2026-09-10
Autor   : Manuel
Estado  : aprobado (petición directa: «quita lo del piano, y usa la decisión del CMO»)
Origen  : INT-004 → docs/plan-negocio-viola.md §2 y §4
```

---

## Problema

La web y el plan de negocio dicen cosas distintas, y la web es la que ve el cliente.

1. **Promete piano en vivo en tres sitios** — hero (`:59`), servicios (`:71`) y una FAQ
   dedicada (`:135`), más sus gemelos en inglés. El plan decidió en §2 **viola sola en
   ceremonia y viola con base propia en cóctel**. Un negocio que se va a construir sobre
   reseñas no puede arrancar prometiendo lo que no entrega: la primera reseña que diga
   «esperábamos piano» vale por diez buenas.
2. **No hay posicionamiento, hay texto genérico.** «Un solo músico, dos instrumentos» y
   cuatro servicios equidistantes —bodas, corporativo, hoteles, celebraciones— es la misma
   web que tienen los otros 150 proveedores del mercado. El §4 eligió un segmento concreto
   y una frase concreta, y la web no los usa.
3. **Dice Madrid.** `site.city` está en `"Madrid"` de placeholder y el JSON-LD lo publica.
   El negocio es Granada: 3.211 matrimonios, 22,9% religiosos frente al 16,4% nacional.
   Es el dato que sostiene el segmento núcleo entero.
4. **No dice el precio**, que es el diferenciador más barato del plan y el único que
   ningún competidor local usa.

## Resultado propuesto

La web vende lo que el §4 decidió vender, a quien decidió vendérselo, con el precio
delante: **la ceremonia a viola sola, con el arreglo hecho a medida, y la tarifa ya
publicada.** Y no promete ni un minuto de piano en vivo.

## Sistemas afectados

| Qué | Cambio |
|---|---|
| `src/i18n/dictionaries.ts` | Reescritura de copy en ES y EN: hero, servicios, sobre mí, proceso, FAQ, contacto |
| `src/config/site.ts` | `city` a Granada, `region`, `serviceArea`, `brand`, `tagline` |
| `app/(es)/layout.tsx` y `app/(en)/en/page.tsx` | Metadatos, descripción y palabras clave |
| `src/components/HomePage.tsx` | JSON-LD: `genre`, `areaServed`, `priceRange` |
| `src/components/Sections.tsx` | Sección de tarifa nueva |
| `implementation/evals/` | `EV-013`: la copy no vuelve a prometer piano en vivo |

## Restricciones

- **Honestidad por delante de conversión.** Ninguna frase puede prometer algo que no se
  entregue. Es el mismo principio que impide filtrar reseñas.
- **«Viola» no es palabra de mercado** (§3.2 del informe): nadie busca «violista». Los
  titulares llevan lo que la gente busca —música en directo, ceremonia, boda, Granada— y la
  viola aparece como lo que es, el instrumento. **Pero no se disfraza de violinista**: eso
  es lo que hace el competidor y sería mentir.
- **El segmento manda**: pareja de Granada provincia con ceremonia cuidada. Hostelería y
  corporativo bajan de rango, no desaparecen.
- No se toca el diseño ni la estructura de secciones. Es contenido.

## Qué NO entra

- Rediseño visual, secciones nuevas más allá de la tarifa, blog, páginas por ciudad.
- Los datos legales reales y el dominio: siguen en `M2-IT-002` e `INT-003`.
- El arreglo de accesibilidad del header: es `INT-005`.
- Fotos, vídeos y audio reales: siguen siendo placeholders.

## Criterio de éxito

- [ ] Cero menciones a piano en vivo en `dictionaries.ts`, ES y EN, y un eval que lo vigile.
- [ ] La frase de posicionamiento del §4 aparece en el hero, reconocible.
- [ ] La tarifa de §4 está publicada con sus seis líneas y la política de desplazamiento.
- [ ] Granada aparece en el hero, en los metadatos y en el JSON-LD; Madrid desaparece.
- [ ] Los servicios se ordenan por la prioridad del §4: ceremonia, cóctel, funeral,
      comunión, hostelería.
- [ ] La FAQ responde lo que el plan identificó: iglesia, bases propias, precio,
      desplazamiento, plan B si enferma.
- [ ] `npm run build`, tests, e2e y evals siguen en verde.

## La decisión incómoda, señalada aparte

**Publicar la tarifa.** `INT-004` la dejó como pregunta abierta 4 y fuera de su alcance;
el §4 la pone en el centro del posicionamiento —*«y el precio ya en la web»*— y es la pata
que sostiene la diferenciación ahora que no hay piano en vivo. Se publica.

Es lo más difícil de deshacer de todo este intent: bajar un precio publicado es fácil,
subirlo después de que lo hayan visto los planners, no. Si prefieres esperar a validar la
tarifa con las tres comprobaciones de coste cero del §9 Fase 0, se quita y queda «precio
cerrado sin sorpresas, presupuesto en 24 h».

## Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| Quitar solo el piano y no tocar el resto | Deja la web sin posicionamiento, que es el problema de fondo. Media corrección |
| Venderse como violinista, que es lo que se busca | Es mentir sobre el instrumento. Y es la casilla exacta del competidor con 119 reseñas |
| Mantener los cuatro servicios equidistantes | Contradice el §4: sin segmento elegido no hay mensaje, y sin mensaje se compite solo por precio |
| Esperar a tener fotos y vídeos reales | El texto no depende del material gráfico y hoy bloquea la publicación |

---

## Aprobación

| Quién | Fecha | Qué aprobó |
|---|---|---|
| Manuel | 2026-09-10 | Quitar el piano y aplicar la decisión del CMO al contenido |
