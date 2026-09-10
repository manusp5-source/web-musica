# Plan de negocio — música en directo para eventos, Granada

```
Fecha    : 2026-09-09
Autor    : Manuel (sesión de c-suite-comite)
Base     : mercado-viola-eventos.md
Sillas   : CEO · COO · CMO · CFO · CHRO · CDO + crítico
Estado   : propuesta. Ninguna decisión irreversible tomada
```

> Los datos de mercado, con su fuente, están en [`mercado-viola-eventos.md`](mercado-viola-eventos.md).
> Aquí solo va la decisión y los números que se derivan de ella.

---

## 1. La decisión

**¿Con qué posicionamiento y a qué precio se entra en el mercado de música en directo para
eventos de Granada, y qué volumen hace falta para que el negocio se sostenga?**

---

## 2. COO — el techo, antes que nada

Se pone primero a propósito. Si la capacidad se declara al final, el plan ya se ha escrito
contra una demanda imaginaria y nadie lo tira.

### Capacidad real

| | |
|---|---|
| Sábados del año | 52 |
| Sábados en los siete meses de temporada (abr–oct) | ~30 |
| Viernes y domingos aprovechables | +8 a 10 |
| **Techo realista de eventos tipo boda** | **38–40 al año** |
| De ellos, en sábado de temporada | ~30 |

Dos eventos el mismo sábado es posible sobre el papel (ceremonia de mediodía y cóctel de
tarde) y mala idea en la práctica: una boda no se puede llegar tarde y el montaje de sonido
no se improvisa. **No se planifica sobre eso.**

### Cuello de botella

**El sábado de temporada.** No la demanda: Granada celebra 3.211 bodas al año y solo 472 en
septiembre. Hay clientes de sobra; lo que no hay es fechas.

De ahí sale la consecuencia que gobierna todo el plan y que el CFO desarrolla en §5:

> **La palanca no es hacer más bodas. Es cobrar más por cada sábado.**

### Decisión de instrumentación — viola sola, con base propia, y por segmento

La web vende hoy *"viola para la ceremonia, piano para el cóctel"*
([`src/i18n/dictionaries.ts:71`](../src/i18n/dictionaries.ts#L71)), con piano **en vivo**.
Manuel plantea la alternativa que tenía pensada: **viola sola sobre base pregrabada**.

Las dos opciones tienen razón en sitios distintos, así que la decisión es por segmento:

| Momento | Formato | Por qué |
|---|---|---|
| **Ceremonia** (religiosa o civil solemne) | **Viola sola, sin base** | Es donde el timbre desnudo gana. Y es donde la base estorba: en iglesia muchos párrocos no la admiten, y el segmento núcleo del plan son las 736 ceremonias religiosas de Granada |
| **Cóctel, fiesta, hostelería, redes** | **Viola + base propia** | El repertorio pop con viola sola suena escueto. Con base, no |
| Piano en vivo | **Solo si se toca de verdad** | Ver el aviso de abajo |

**Lo que esto ahorra:** los 1.200 € del piano digital, 20 kg de carga y ~25 min de montaje
por evento. La inversión de §5 baja de 4.700 € a 3.500 €.

**Lo que esto cuesta, y hay que verlo:** el pack de dos instrumentos en vivo era el único
hueco del mapa perceptual que Viola Tempestad no ocupa. Viola + base + equipo propio **es
exactamente su modelo**, y él tiene 119 reseñas. Sin el piano en vivo, la diferenciación
tiene que recaer entera sobre las otras dos patas: **precio publicado y arreglo propio**.

### Aviso duro sobre las bases

**Las bases no pueden salir de YouTube.** Usar audio de la plataforma en una actuación
comercial infringe el copyright de la grabación y las propias condiciones del servicio. No
es un matiz: es lo que puede dejar una actuación sin poder facturarse.

**La solución ya está en la máquina.** Manuel tiene FL Studio y una carpeta de proyectos
propios. Producir las bases resuelve tres cosas de una vez:

1. El problema de licencia desaparece: la base es obra propia.
2. *"Arreglo personalizado de vuestra canción"* pasa de frase de web a producto real.
3. Abre el vídeo-concierto grabado de §6 sin coste marginal de licencia.

### Corrección pendiente en la web

`dictionaries.ts` promete piano en vivo en tres sitios: el hero (`:59`), la descripción de
servicios (`:71`) y una FAQ dedicada (`:135`), más sus equivalentes en inglés.

**Si no se va a tocar el piano en vivo, eso sale de la web.** Un negocio que se construye
sobre reseñas no puede arrancar prometiendo lo que no entrega. La corrección es de
contenido y va en su propio intent, pero **bloquea la publicación**.

### Modos de fallo y plan B

| Fallo | Plan B |
|---|---|
| Enfermedad o accidente el día del evento | Acuerdo previo de sustitución con dos músicos (§7). **Una boda no se aplaza** |
| Fallo del equipo de sonido | Segundo cable, segunda pastilla y batería de repuesto en la funda, siempre |
| Espacio sin toma de corriente cerca | Batería portátil con autonomía ≥3 h. Se pregunta en la visita técnica |
| Lluvia en ceremonia exterior | Cláusula de reubicación en el contrato; el instrumento no sale bajo agua |

---

## 3. CEO — diagnóstico y opciones

### Las cinco fuerzas, en corto

| Fuerza | Intensidad | Por qué |
|---|---|---|
| Rivalidad | **Alta** | +150 proveedores de música en bodas.net Granada |
| Nuevos entrantes | **Muy alta** | Barrera de entrada casi nula: un instrumento y un perfil |
| Poder del cliente | **Alto** | Compara tres presupuestos en una tarde, y el portal se lo pone fácil |
| Proveedores | Bajo | El músico es el proveedor |
| Sustitutivos | **Muy alto** | DJ, lista de Spotify, la megafonía de la finca |

Un sector duro. La única defensa real es no estar en la misma comparación que los otros
150 — y eso es exactamente lo que permite el hallazgo del §2.4 del informe.

### DAFO

| | |
|---|---|
| **Fortalezas** | **Arreglos propios producidos por él mismo** (FL Studio), no bases compradas · formación clásica · web ya construida en dos idiomas · timbre que casi nadie ha oído en una ceremonia |
| **Debilidades** | **Cero reseñas frente a las 119 de Viola Tempestad** · sin ficha de Google · sin cartera ni recomendación · un solo par de manos |
| **Oportunidades** | Granada tiene 22,9% de bodas religiosas (vs 16,4% nacional), que es donde más se contrata música en vivo · nadie publica precios · funerales sin temporada y sin competencia fina · el mercado local (340 €) está por debajo del nacional (450–550 €) |
| **Amenazas** | Saturación · el cliente compara por precio · si el incumbente publica tarifas, se cierra la grieta principal |

### Las tres opciones

| | Opción | Veredicto |
|---|---|---|
| **A** | **Violinista genérico de precio bajo.** Entrar por debajo de los 340 € de media local y competir por volumen | **Rechazada.** Carrera a la baja contra 150 proveedores, sin ninguna ventaja, y choca de frente con el techo de 40 eventos: el volumen no existe |
| **B** | **Viola pura de nicho.** Marca, comunicación y SEO construidos sobre la palabra "viola" | **Rechazada como estrategia única.** La demanda no busca "viola" — ni siquiera el incumbente violista se vende así. Es construir sobre un mercado que no teclea |
| **C** | **Nicho enfocado con diferenciación.** Aparecer en la palabra que la gente busca; ganar con la que nadie ofrece | **Recomendada** |

### La recomendación

**Opción C — nicho enfocado (U3 §3.3 del MBA) con diferenciación por doble instrumento,
precio publicado y contraestacionalidad.**

Tres patas:

1. **Se capta en "música de cuerda / violinista / música clásica para bodas en Granada"**,
   que es lo que el cliente escribe.
2. **Se gana en la segunda frase**: una sola contratación cubre ceremonia y cóctel con dos
   instrumentos distintos, y el precio está publicado — lo que ningún competidor local hace.
3. **Se rellena el invierno con funerales, comuniones y hostelería**, que es donde no hay
   temporada ni competencia trabajada.

### A qué se renuncia

Sin esto no sería una estrategia:

- **Al tramo de precio por debajo de 350 €.** No se compite ahí. Un sábado gastado a 250 €
  es un sábado perdido, porque solo hay 30.
- **A Málaga y Sevilla durante el año 1.** Foco en Granada provincia; Jaén y Almería solo
  con recargo de desplazamiento.
- **A la fiesta y al DJ.** No es el terreno; se colabora con ellos, no se compite.
- **Al volumen como objetivo.** El objetivo es el ingreso por sábado, no el número de bodas.

### Supuestos que invalidan la recomendación

1. Que **menos del 15% de las bodas de Granada contraten música en directo**. Reduciría el
   mercado servible a ~480 bodas y haría la competencia por ellas insostenible.
2. Que la tarifa anual de bodas.net supere los **2.500 €**. No cabría en el año 1.
3. Que **Viola Tempestad publique tarifas** agresivas. Cerraría la grieta principal.

Los tres se comprueban en la Fase 0 (§9), y ninguno cuesta dinero.

---

## 4. CMO — segmento, posicionamiento y precio

### Segmentación y elección

| Segmento | Volumen Granada | Ticket | Estacionalidad | Prioridad |
|---|---|---|---|---|
| **Boda religiosa** | 736/año | Alto | Abr–oct | **1 — el núcleo** |
| **Boda civil con ceremonia cuidada** | ~800 estim. de 2.475 | Alto | Abr–oct | **2** |
| Bodas de destino (Alhambra, cármenes) | `no publicado` | Muy alto | Abr–jun, sep–oct | 3 — vía planners |
| **Funerales** | Sin dato local | Bajo | **Ninguna** | **3 — contraestacional** |
| Comuniones | Sin dato local | Bajo | Mayo | 4 |
| Hostelería y corporativo | Sin dato local | Medio | Otoño-invierno | 4 |

**Segmento objetivo:** pareja que celebra en Granada provincia, con ceremonia cuidada
—religiosa o civil solemne—, presupuesto total de boda por encima de 20.000 €, y que valora
la música como parte del recuerdo y no como un trámite del programa.

Se elige porque es donde la partida de música (1.200–2.160 €) da margen al solista sin
pelear con el DJ, y porque Granada tiene un 40% más de peso de ceremonia religiosa que la
media española.

### Mapa perceptual

Ejes: **precio** (vertical) × **singularidad del sonido** (horizontal).

```
        precio alto
             │
   Cuarteto  │        ← hueco: precio medio-alto,
   Alhamar   │          sonido singular, una sola
             │          contratación
   ──────────┼──────────────────────────  singularidad →
             │  Viola Tempestad
   Música a  │  (5,0 · 119 opiniones,
   la Carta  │   se vende como violín)
   (400 €)   │
        precio bajo      · 150 proveedores genéricos
```

**El hueco no es "viola".** Es *"una sola contratación cubre ceremonia y cóctel con dos
timbres distintos, y sabes el precio antes de escribir"*.

### Posicionamiento, en una frase

> **La ceremonia a viola sola, con vuestro arreglo hecho por mí, y el precio ya en la web.**

Una frase que un cliente repetiría a su pareja. Ese es el listón.

### Tarifa propuesta

Publicada en la web. Es el diferenciador más barato de implantar y ningún competidor
local lo hace.

| Paquete | Contenido | Precio |
|---|---|---|
| **Ceremonia** | **Viola sola, sin base.** 45 min, equipo de sonido incluido, 1 arreglo propio | **390 €** |
| **Ceremonia + cóctel** | Lo anterior + 1 h de cóctel con **viola y bases propias** | **690 €** |
| **Jornada** | Ceremonia + cóctel + entrada al banquete | **990 €** |
| Comunión o funeral | 45 min, un instrumento | **250 €** |
| Hostelería (set de 1 h) | Repertorio de ambiente, precio por recurrencia | **200 €** |
| Vídeo-concierto grabado | Pieza a medida, calidad de estudio | **150 €** |
| Desplazamiento | Gratis hasta 50 km; después 0,40 €/km | — |

**Justificación del precio, por las tres vías que exige el MBA (U9 §3):**

- **Coste:** el punto de equilibrio (§5) se cubre con 9 eventos al año. Hay holgura.
- **Competencia:** 390 € queda por encima de la media local de clásica (340 €) y por debajo
  de la ceremonia española (450–550 €). Se entra caro para Granada y barato para España
  — que es exactamente el hueco que abre el §3.2 del informe.
- **Valor:** arreglo propio producido a medida —no una base comprada—, equipo propio y
  precio cerrado sin tener que pedirlo.

**Lo que no se hace: descuentos por volumen.** Con 30 sábados, rebajar el sábado es regalar
el activo escaso.

### Canales, y qué se espera de cada uno

| Canal | Coste año 1 | Leads esperados | Conversión | Coste/cliente | Cuándo entra |
|---|---|---|---|---|---|
| **Ficha de Google + SEO local** | 0 € + tiempo | 15–25 | 25% | ~0 € | **Mes 1. Lo primero** |
| Instagram / TikTok vertical | 0 € + edición (~400 €) | 10–20 | 15% | ~130 € | Mes 1 |
| Wedding planners y fincas | 0 € | 8–15 | **40%** | 0 € | Mes 2 |
| Funerarias y tanatorios | 0 € | 5–15 | 50% | 0 € | Mes 3 |
| **bodas.net** | 1.200–2.400 € `estimado` | 30–40 | 20% | **150–300 €** | **Mes 4** — ver disidencia §8 |
| Agregadores gratuitos | 0 € | 5–10 | 10% | 0 € | Mes 2 |

Las cifras de leads y conversión son **estimaciones propias**, no datos observados. Existen
para poder compararlas contra lo real desde el primer mes, que es su única función.

---

## 5. CFO — si los números salen

### Estructura de costes

**Fijos anuales (año 1, con tarifa plana de autónomo):**

| Concepto | Importe |
|---|---|
| Cuota de autónomo (80 €/mes) | 960 € |
| Gestoría (50 €/mes) | 600 € |
| Dominio y hosting | 60 € |
| Seguro de responsabilidad civil | 150 € |
| bodas.net (`estimado`, punto medio) | 1.800 € |
| **Total fijo** | **3.570 €** |

> **Aviso:** a partir del año 2 la cuota de autónomo pasa de 80 € a entre 205,88 € y
> 607,35 €/mes según rendimientos. En el tramo bajo eso son **+1.510 €/año de coste fijo**,
> que sube el punto de equilibrio de 9 a 13 eventos. Está previsto, no es una sorpresa.

**Inversión inicial:**

| Concepto | Importe |
|---|---|
| Viola eléctrica | 1.200 € |
| Equipo de sonido portátil (PA, pastilla, pedal, cables) | 1.200 € |
| Fotografía y vídeo profesional | 1.100 € |
| Producción de bases propias (FL Studio ya instalado) | **0 €** |
| **Total inversión** | **3.500 €** |

> El piano digital de 88 teclas (1.200 €) **sale de la inversión** por la decisión de
> instrumentación de §2. Vuelve a entrar solo si se decide tocar piano en vivo.

**Variable por evento:** desplazamiento medio 40 € + consumibles 10 € = **50 €**.

### Punto de equilibrio

Con la tarifa de §4 y un mix realista de año 1 (más ceremonias sueltas que jornadas
completas), el **ticket medio ponderado sale a 459 €** y el margen de contribución a
**409 € por evento**.

| | |
|---|---|
| **Punto de equilibrio operativo** | **9 eventos al año** (3.570 / 409) |
| Eventos para además recuperar los 3.500 € de inversión en el año 1 | **18 eventos** |
| **% de la capacidad (40) que consume el equilibrio** | **22,5%** |

**Este es el número que dice que el negocio es viable:** el umbral cabe holgadamente bajo el
techo del COO. Nueve eventos son tres meses de temporada floja. Dieciocho son un año base.

Si el equilibrio hubiera salido en 35 eventos sobre una capacidad de 40, el modelo estaría
muerto a ese precio y habría que subirlo. No es el caso.

### Apalancamiento operativo

Escenario base, 26 eventos:

```
Margen de contribución  26 × 409 €  =  10.634 €
Costes fijos                        =   3.570 €
BAII                                =   7.064 €

GAO = 10.634 / 7.064 = 1,51
```

**Un 1,51 es bajo, y eso es una buena noticia.** Significa que una caída del 20% en ventas
solo se lleva un 30% del beneficio, no lo borra. El negocio no está apalancado en costes
fijos porque el activo principal —el tiempo— no se paga si no se usa. La fragilidad de este
modelo no está en los costes: está en la agenda.

| Escenario | Eventos | Ingresos | BAII |
|---|---|---|---|
| −20% | 21 | 9.639 € | 5.019 € |
| **Base** | **26** | **11.934 €** | **7.064 €** |
| +20% | 31 | 14.229 € | 9.109 € |

### La inversión: payback, VAN y TIR

Tasa de descuento **10%**, que es un coste de oportunidad conservador para capital propio de
un autónomo sin deuda.

| | |
|---|---|
| Payback simple | 3.500 / 409 = **8,6 eventos** ≈ 4 meses de temporada |
| VAN a 3 años (flujos 7.064 / 9.500 / 11.000) | **≈ 19.000 €** |
| TIR | > 150% |

**El CFO avisa de que estos tres números halagan y no hay que creérselos.** Son
espectaculares porque la inversión es ridícula comparada con los flujos: en este negocio el
capital no es el recurso escaso. **El recurso escaso es el sábado de temporada**, y ni el
VAN ni la TIR lo ven.

La métrica que sí importa:

> **Ingreso por sábado de temporada ocupado.** Base: 11.934 € / ~26 = **459 €**.
> Objetivo año 2: **≥ 600 €**, subiendo el mix hacia "Ceremonia + cóctel" y "Jornada".
> No haciendo más bodas — no caben.

### Presupuesto de ventas por mes

Sigue la estacionalidad real de Granada, no un reparto lineal.

| Mes | Bodas | Otros | Total | Ingreso estimado |
|---|---|---|---|---|
| Enero | 0 | 1 | 1 | 250 € |
| Febrero | 0 | 1 | 1 | 250 € |
| Marzo | 1 | 1 | 2 | 640 € |
| Abril | 2 | 1 | 3 | 1.030 € |
| Mayo | 2 | 2 | 4 | 1.280 € |
| Junio | 3 | 0 | 3 | 1.470 € |
| Julio | 2 | 0 | 2 | 1.080 € |
| Agosto | 2 | 0 | 2 | 980 € |
| **Septiembre** | **3** | 0 | **3** | **1.770 €** |
| Octubre | 2 | 1 | 3 | 1.334 € |
| Noviembre | 1 | 1 | 2 | 640 € |
| Diciembre | 0 | 1 | 1 | 250 € |
| **Total** | **18** | **8** | **26** | **11.974 €** |

Enero, febrero y diciembre viven **solo** de funerales y hostelería. Sin ese segmento, el
negocio tiene cinco meses muertos al año.

### Tres escenarios y qué se hace en cada uno

| Escenario | Supuesto | Resultado | **Decisión si ocurre** |
|---|---|---|---|
| **Pesimista** | 12 eventos. La ficha de Google no arranca y bodas.net no convierte | BAII ≈ 870 €. **No se recupera la inversión** | **Se corta bodas.net** en la renovación y se vuelca todo en planners y funerarias, que son gratis. Se revisa el precio a la baja solo si hay evidencia de 5 presupuestos perdidos por precio |
| **Base** | 26 eventos | BAII ≈ 7.064 € | Se mantiene el plan y se sube el mix |
| **Optimista** | 38 eventos, mix desplazado a paquetes altos | BAII ≈ 15.800 € | **No se hacen más bodas: se sube el precio.** Es la señal de que la capacidad está llena |

---

## 6. CDO — qué se prueba

**Desencadenante:** el hallazgo de §2.4 del informe. La viola no se busca, pero se ve y se
oye. Si el canal de texto no puede vender el diferenciador, tiene que hacerlo el vídeo.

| | |
|---|---|
| **Prototipo más barato que responde la pregunta** | 12 vídeos verticales en 90 días: la viola sonando en sitios reconocibles de Granada (mirador de San Nicolás, un carmen, el Paseo de los Tristes). Coste: tiempo + ~400 € de edición |
| **Métrica de éxito, declarada antes de construir** | **≥3 leads atribuibles** al canal en 90 días |
| **Criterio de abandono** | 12 vídeos publicados y **0 leads en 90 días** → se para, y el presupuesto de edición se mueve a fotografía para los portales |
| Segunda apuesta | Vídeo-concierto grabado a 150 €. Validado: el incumbente ya lo vende |

---

## 7. CHRO — quién hace el trabajo

| Función | Quién | Umbral económico |
|---|---|---|
| Tocar, vender, arreglos | **Manuel** | — |
| Gestoría y fiscalidad | Delegada, 50 €/mes | Desde el mes 1. Recupera ~4 h/mes |
| Edición de vídeo | Delegada, 30–60 €/pieza | **A partir de 8 eventos/mes.** Por debajo, se edita solo |
| Fotografía y vídeo de marca | Subcontratada, 1.100 € una vez | Mes 1. Es inversión, no gasto |

### Plan de contingencia — el punto crítico

**Una boda no se aplaza.** Un músico solo, sin sustituto, es un riesgo de negocio, no un
detalle de recursos humanos.

**Acción del mes 1:** acuerdo previo con **dos violistas o violinistas** de la Orquesta de la
UGR o del entorno del conservatorio, con tarifa pactada y repertorio compartido en una
carpeta. No es una conversación que se pueda tener el sábado por la mañana.

---

## 8. Disidencias registradas

Un acta sin disidencias es un acta que no discutió.

| Silla | En qué no está de acuerdo | Qué pasaría si tiene razón |
|---|---|---|
| **CFO vs CMO** | El CMO quiere bodas.net desde el mes 1. El CFO se opone: **un perfil con cero reseñas convierte mal**, y pagar 1.800 € para competir contra un perfil de 119 opiniones es quemar el presupuesto del año | Se resuelve: **bodas.net entra en el mes 4**, con al menos 5 reseñas de Google encima. Si en el mes 4 no hay 5 reseñas, no entra |
| **COO vs CMO** | El pack de dos instrumentos en vivo exigía piano, y **casi ninguna finca tiene uno** | Resuelto por decisión de instrumentación (§2): viola sola en ceremonia, viola con base propia en cóctel. Ahorra 1.200 € **y cuesta el diferenciador** |
| **CEO vs COO** | El CEO avisa de que, sin piano en vivo, el posicionamiento **cae en la casilla exacta de Viola Tempestad**, que la ocupa con 119 reseñas | Aceptado con los ojos abiertos. La diferenciación pasa a depender enteramente de **precio publicado + arreglo propio**. Si a los 6 meses ninguna de las dos ha traído un cliente atribuible, hay que reabrir la instrumentación |
| **CDO vs CFO** | El CDO quiere presupuesto de vídeo desde el mes 1; el CFO lo ve como gasto sin retorno demostrado | Se resuelve con el criterio de abandono de §6. El gasto está acotado a 400 € |

---

## 9. Plan de ejecución

### Fase 0 — Comprobar lo que invalida el plan (mes 1, coste 0 €)

Ninguna cuesta dinero y las tres pueden tumbar el plan. Van primero.

```
- [ ] Pedir tarifa de proveedor a bodas.net para Granada. Si supera 2.500 €/año, el canal
      sale del año 1
- [ ] Llamar a 3 fincas y 2 wedding planners: ¿qué % de sus bodas contrata música en
      directo? Si es <15%, se revisa el segmento
- [ ] Pedir presupuesto real a Viola Tempestad como cliente. Es la única forma de conocer
      el techo de precio local
```

### Fase 1 — Base de captación (meses 1–3)

```
- [ ] Crear la ficha de Google Business Profile. Es la palanca de mejor retorno pendiente
      y hoy no existe (INT-001)
- [ ] Publicar la web con datos legales y dominio reales — hoy sigue con marcadores
      (INT-003, en borrador)
- [ ] Publicar la tarifa de §4 en la web. Es el diferenciador más barato del plan
- [ ] Sesión de fotografía y vídeo profesional
- [ ] Acuerdo de sustitución con dos músicos (§7)
- [ ] Alta de autónomo: modelo 036 con epígrafe IAE 032, después RETA con tarifa plana
- [ ] Contactar 7 wedding planners y 5 fincas de Granada
- [ ] Contactar 3 funerarias — es el segmento que sostiene el invierno
```

### Fase 2 — Primeras reseñas (meses 3–6)

```
- [ ] Pedir reseña de Google después de cada evento. Sin excepción, el mismo día
- [ ] Llegar a 5 reseñas antes de contratar bodas.net (condición de §8)
- [ ] Publicar los 12 vídeos verticales y medir contra el criterio de abandono de §6
- [ ] Entrar en agregadores gratuitos
```

### Fase 3 — Subir el mix (meses 6–12)

```
- [ ] Empujar "Ceremonia + cóctel" y "Jornada" frente a "Ceremonia" suelta
- [ ] Medir el ingreso por sábado de temporada. Objetivo año 2: ≥600 €
- [ ] Revisar precio al alza si la ocupación de sábados supera el 70%
```

---

## 10. Cuadro de mando

Pocos indicadores, con umbral y frecuencia. Un cuadro de mando con veinte líneas se abandona
en marzo (U21 §2.2).

| Indicador | Umbral | Frecuencia | Fuente del dato |
|---|---|---|---|
| **Ocupación de sábados de temporada** | ≥60% | Mensual (mar–oct) | Agenda |
| **Ingreso por sábado de temporada** | ≥459 € año 1 · ≥600 € año 2 | Trimestral | Facturación / agenda |
| Leads del mes | ≥6 en temporada | Mensual | Formulario + teléfono |
| Conversión lead → contrato | ≥20% | Mensual | Registro de presupuestos |
| **Coste por cliente de bodas.net** | **≤150 €** | Trimestral | Gasto del portal / clientes cerrados |
| Ticket medio | ≥450 € | Trimestral | Facturación |
| Reseñas de Google acumuladas | +2 al mes | Mensual | Ficha de Google |
| Ingresos de segmentos contraestacionales | ≥1.500 €/año | Anual | Facturación nov–mar |

El indicador que decide si el plan funciona no es la facturación: es **la ocupación de
sábados cruzada con el ingreso por sábado**. Los dos juntos, nunca uno solo.

---

## 11. Lo que necesita OK humano

Ninguna de estas las toma la IA.

| Decisión | Por qué | Coste |
|---|---|---|
| Alta de autónomo | Obligación fiscal continuada. Difícil de deshacer sin coste | 80 €/mes año 1, después 205–607 €/mes |
| Compra del equipo | Desembolso irreversible | 3.500 € |
| **Quitar el piano en vivo de la web** | Cambia la promesa pública del negocio | 0 € |
| Contratar bodas.net | Contrato anual con renovación | 1.200–2.400 €/año `estimado` |
| Publicar la tarifa | Fija el posicionamiento en público y es incómodo de bajar | 0 € |

---

## 12. Veredicto del crítico

Rol distinto del que escribió el análisis. Audita la trayectoria, no repite las cuentas.

| Comprobación | Resultado |
|---|---|
| Tres opciones reales, no una y dos de paja | **Sostenido.** A y B son opciones que un profesional tomaría; se rechazan con argumento, no por descarte |
| La recomendación nombra su renuncia | **Sostenido.** Cuatro renuncias explícitas en §3 |
| El plan de ventas cabe en la capacidad del COO | **Sostenido.** 26 eventos base contra un techo de 38–40 |
| El punto de equilibrio se comparó con la capacidad | **Sostenido.** 9 eventos = 22,5% del techo, dicho en §5 |
| Cada cifra externa con fuente y fecha, o marcada como estimación | **Sostenido con reserva.** Las cifras del INE y de precios están citadas; los leads por canal de §4 y la tarifa de bodas.net son estimaciones propias y aparecen marcadas. **La fila de "leads esperados" es la más débil del documento** y no debe usarse como si fuera un dato |
| Escenario pesimista con decisión asociada | **Sostenido.** §5 lleva la decisión, no solo el número |
| Cada silla se quedó en su carril | **Sostenido.** El aviso del piano lo dio el COO, lo pagó el CFO y el CEO puso el coste estratégico encima de la mesa. Así debe funcionar |
| Disidencias registradas | **Sostenido.** Cuatro, en §8 |

**Veredicto: avanzar con correcciones.**

**Correcciones exigidas:**

0. **La decisión de instrumentación de §2 tiene una consecuencia que el plan no puede
   maquillar:** al renunciar al piano en vivo, el posicionamiento cae dentro de la casilla
   que Viola Tempestad ocupa con 119 reseñas. El plan sigue siendo defendible —el precio
   publicado y el arreglo propio son diferenciadores reales— pero **son más frágiles que
   una instrumentación que el competidor no puede copiar en una tarde.** Revisar a los 6
   meses con datos, no con intuición.

1. **La Fase 0 no es opcional.** Las tres comprobaciones cuestan cero euros y cualquiera de
   las tres puede tumbar el plan. Ejecutar el resto sin ellas sería construir sobre
   supuestos que se sabía cómo verificar.
2. **La tabla de canales de §4 lleva estimaciones propias en las columnas de leads y
   conversión.** Sirven para contrastarlas contra lo real desde el mes 1, no para
   presupuestar. Sustituirlas por datos observados en cuanto los haya.
3. **El plan depende de dos cosas que hoy no existen**: la ficha de Google (INT-001) y la
   web publicada con datos legales reales (INT-003, todavía en borrador). Sin ellas, el
   canal de coste cero —el mejor del plan— no existe, y todo cuelga de bodas.net, que es el
   más caro. **Ese es el riesgo mayor del plan y no es de mercado: es de ejecución propia.**
