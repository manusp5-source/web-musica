# Semilla de intent — dashboard del negocio de eventos

```
Estado : semilla. NO es un intent aprobado
Destino: C:\Users\Manuel\Desktop\viola-dashboard  (ruta sin espacios ni acentos)
Arranca: /init-project  — que trae su propio planning gate con APROBADO
```

> **Esto no es el proyecto.** Es lo que `/init-project` necesita leer para no empezar en
> blanco. El gate sigue siendo de Manuel: no se genera código hasta que escriba `APROBADO`.

---

## Antes de arrancar

`/factoria-doctor` ejecutado el **9 sep 2026**: 23/23 evals en verde, índice de skills al
día con 312 entradas, un solo ciclo de proyecto instalado. Un hallazgo abierto y ajeno a
esto: `instinct-observe.ps1` está huérfano —no lo ejecuta ningún hook— y conviene resolverlo
o retirarlo antes de sumar un proyecto más.

Consultar `agencia/INFRA-LOCAL.md` antes de asignar puerto: hay veinte ocupados.

## El problema que resuelve

El plan de [`plan-negocio-viola.md`](plan-negocio-viola.md) define ocho indicadores y
**ninguno tiene dónde vivir**. Sin sitio donde anotarlos, el cuadro de mando se abandona en
marzo — que es exactamente lo que el MBA avisa en la U21 §2.2, y por lo que la mayoría de
los cuadros de mando no llegan al segundo trimestre.

Hay además un dato que solo se sabe si se registra desde el primer mes y que decide un gasto
de cuatro cifras: **el coste por cliente de bodas.net**. Si no se mide, se renueva por
inercia.

## Los cuatro bloques

Salen del alcance que pidió Manuel, no de lo que sea fácil de construir.

| Bloque | Qué mide | De dónde sale |
|---|---|---|
| **Agenda y ocupación** | Eventos contratados y sábados libres de temporada | §2 del plan: la capacidad es el cuello de botella |
| **Pipeline de leads** | Peticiones por canal, estado y conversión de cada uno | §4 del plan |
| **Dinero** | Ingreso por evento y mes, coste por lead, margen, avance contra presupuesto | §5 del plan |
| **Cuadro de mando** | Los ocho KPIs en semáforo | §10 del plan |

## Los KPIs — no se inventan, ya están decididos

| Indicador | Umbral | Frecuencia |
|---|---|---|
| **Ocupación de sábados de temporada** | ≥60% | Mensual (mar–oct) |
| **Ingreso por sábado de temporada** | ≥459 € año 1 · ≥600 € año 2 | Trimestral |
| Leads del mes | ≥6 en temporada | Mensual |
| Conversión lead → contrato | ≥20% | Mensual |
| **Coste por cliente de bodas.net** | ≤150 € | Trimestral |
| Ticket medio | ≥450 € | Trimestral |
| Reseñas de Google acumuladas | +2 al mes | Mensual |
| Ingresos contraestacionales (nov–mar) | ≥1.500 €/año | Anual |

Los dos en negrita son los que deciden si el plan funciona, y **solo sirven juntos**:
ocupación cruzada con ingreso por sábado. Cualquiera de los dos por separado engaña.

## Restricciones que hereda

- **Un solo usuario.** No hay equipo, no hay roles, no hay multi-tenant.
- **Se usa desde el móvil**, de pie, después de un evento. Si meter un lead cuesta más de
  treinta segundos, no se mete y el dashboard muere.
- **La estacionalidad es del dominio**, no una preferencia: la vista por defecto en
  temporada no es la misma que en enero.
- Credenciales por los tres niveles de `~/CLAUDE.md`. Nada en ficheros versionados.

## Qué NO entra

- Facturación y contabilidad. Eso es de la gestoría.
- Firma de contratos y gestión documental.
- Cualquier integración con bodas.net. **No hay API**; el dato del canal se mete a mano.
- Venderlo a otros músicos. Si algún día, será otro intent.

## Preguntas que `/init-project` tiene que hacer

1. ¿Local con Docker, o desplegado para poder usarlo desde el móvil fuera de casa? Lo
   segundo es lo que pide el caso de uso y lo que obliga a auth de verdad.
2. ¿Los datos se cargan a mano, o se importan de algún sitio? Hoy no hay de dónde.
3. ¿Se guarda el histórico de presupuestos perdidos y su motivo? Es el dato que permite
   saber si se pierde por precio — y el §5 del plan lo necesita para decidir si bajarlo.
