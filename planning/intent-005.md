# Intent — Accesibilidad: el visitante tiene que poder leer la web

```
ID      : INT-005
Fecha   : 2026-09-10
Autor   : Manuel
Estado  : borrador
Origen  : /review — pasada 6, hallazgos fuera del alcance de M1
```

---

## Problema

La revisión adversarial de M1 midió el contraste real de la sección de reseñas y, de paso,
el del resto del sitio. Encontró tres cosas, y una es grave:

1. **La navegación es ilegible en el estado inicial.** El header es fijo y arranca con
   `bg-transparent` sobre el gradiente oscuro del hero. Medido con captura de pantalla real
   y muestreo de píxel: el logo (`text-carbon`) da **≈1,00:1** de contraste contra el fondo
   que tiene detrás, y los enlaces (`text-carbon/80`) entre **1,1 y 1,3:1**. AA exige 4,5:1
   para texto normal y 3:1 incluso para texto grande. **Es lo primero que ve cualquiera que
   entra**, en las dos raíces de idioma, y no lo cubría ningún eval.
2. **`Sections.tsx` (`Events`) usa `text-carbon/60`** — exactamente el mismo 4,42:1 que la
   review acaba de corregir en el aviso legal. Hoy no se ve porque la agenda está vacía a
   propósito, pero fallará AA en cuanto se rellene un evento.
3. **`Footer.tsx` usa `text-marfil/20`** en los separadores «·» entre enlaces legales.
   Defendible como puntuación decorativa, pero no está marcado `aria-hidden`, así que hoy
   es texto que falla AA de forma severa. Prioridad baja.

Y un hueco declarado: **el contraste del hero no se ha medido.** `text-marfil/60,/70,/80`
sobre gradientes apilados más un canvas 3D no se calcula con fiabilidad a mano.

## Resultado propuesto

Todo el texto informativo del sitio cumple WCAG 2.1 AA sobre el fondo que realmente tiene
detrás, y hay un eval que lo comprueba en cada ejecución de la suite — no solo en la
sección de reseñas, que es lo único cubierto hoy por `EV-012`.

## Sistemas afectados

| Qué | Cómo se toca |
|---|---|
| `src/components/Nav.tsx` | El estado inicial del header necesita fondo, sombra o color de texto claro |
| `src/components/Sections.tsx` | `text-carbon/60` → `/70` en `Events` |
| `src/components/Footer.tsx` | Separadores a `aria-hidden` o a un tono legible |
| `src/components/Hero.tsx` | Medición pendiente; puede no necesitar cambios |
| `implementation/evals/` | `EV-012` se generaliza del componente de reseñas a todo el sitio |

## Restricciones

- **No romper el diseño.** La paleta marfil/carbón/dorado es del proyecto y no se cambia;
  se ajustan tonos y fondos, no la identidad.
- El hero 3D se apaga solo en móvil y con `prefers-reduced-motion`: cualquier arreglo del
  header tiene que funcionar en los dos estados, con y sin partículas.
- Medir, no estimar. 4,42 y 4,5 son indistinguibles a ojo — así se coló el fallo del aviso
  legal durante cinco pasadas de revisión.

## Qué NO entra

- Auditoría completa de accesibilidad: navegación por teclado, lector de pantalla, `axe`,
  foco visible. Eso es otro intent, más grande.
- Rediseño visual.
- Cambiar la paleta de `tailwind.config.ts`.

## Criterio de éxito

- [ ] El contraste del logo y los enlaces del header ≥ 4,5:1 en el estado inicial, medido
      sobre una captura real, no sobre el CSS.
- [ ] Ningún `text-*/60` sobre marfil en texto informativo en todo `src/`.
- [ ] Los separadores del footer, o legibles o marcados como decorativos.
- [ ] El contraste del hero, medido y documentado — aunque el resultado sea «pasa».
- [ ] `EV-012` cubre todos los componentes con texto, no solo `Reviews.tsx`, y se pone rojo
      si alguien reintroduce cualquiera de los tres fallos.

## Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| Arreglarlo dentro de la review de M1 | Es código preexistente y fuera del alcance de M1. Parchearlo a escondidas mientras se audita otra cosa es exactamente el alcance de más que la propia review vigila |
| Dejarlo para después de publicar | El header ilegible lo ve el 100% de las visitas. Publicar así es peor que no publicar |
| Bajar el listón a AA para texto grande (3:1) | El logo mide ≈1:1. No pasa ni ese listón |

---

## Prioridad

**El punto 1 bloquea la publicación (M2).** Los puntos 2 y 3 pueden ir con él o después.
No bloquea nada de M1: la sección de reseñas ya cumple AA y tiene su eval.

---

## Aprobación

| Quién | Fecha | Qué aprobó |
|---|---|---|
| Manuel | — | pendiente |
