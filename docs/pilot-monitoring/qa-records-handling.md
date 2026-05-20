# Manejo de registros QA en monitoreo piloto

Fecha: 2026-05-19

Release base: `pilot-v1.0.0`

## Dictamen

`QA_RECORDS_ISOLATED_FROM_REAL_PILOT_METRICS`

Los registros QA de `pilot_feedback` y `pilot_incidents` se conservan como evidencia tecnica, pero ya no contaminan metricas reales del panel de piloto, promedios de rating, incidentes abiertos ni reportes de cierre.

## Registros QA revisados

Consulta posterior a validacion:

| Tabla | Criterio QA | Cantidad | Estado |
| --- | --- | ---: | --- |
| `pilot_feedback` | `module = 'QA'` o titulo/evidencia QA | 8 | Excluidos de metricas reales |
| `pilot_incidents` | `module = 'QA'` o titulo/evidencia QA | 8 | Excluidos de metricas reales |

Conteos reales despues del aislamiento:

| Metrica real | Resultado |
| --- | ---: |
| Feedback real total | 0 |
| Feedback real nuevo | 0 |
| Incidentes reales abiertos | 0 |
| Incidentes reales criticos | 0 |

## Decision de datos

No se borraron registros QA.

Motivos:

1. Sirven como evidencia de que RLS, creacion, lectura propia, bloqueo cruzado y actualizacion admin funcionan.
2. No contienen secretos ni datos personales reales.
3. Borrarlos reduciria trazabilidad de QA del piloto.
4. El problema se resolvio en la capa de metricas y visualizacion, no eliminando evidencia.

## Cambios aplicados

| Archivo | Cambio |
| --- | --- |
| `src/features/admin/pilotMetricsService.ts` | Las metricas de feedback/incidentes del piloto excluyen `module = 'QA'`. |
| `src/features/pilot/pilotFeedbackService.ts` | Las listas y resumenes reales excluyen feedback QA; se agrego consulta separada de evidencia QA. |
| `src/features/pilot/pilotIncidentService.ts` | Las listas y resumenes reales excluyen incidentes QA; se agrego consulta separada de evidencia QA. |
| `src/features/admin/pilotReportService.ts` | El reporte de cierre del piloto excluye registros QA. |
| `src/pages/AdminHome.tsx` | Se agrego seccion separada “Evidencia QA” con conteos y ultimos registros QA. |

## Reglas de aislamiento

Un registro se considera QA cuando:

- `module = 'QA'`; o
- su titulo inicia con `QA `; o
- en feedback, `device = 'QA'`.

Las metricas reales usan principalmente el filtro persistente `module <> 'QA'` o `module is null`, y las listas de Admin refuerzan el aislamiento en cliente para cubrir evidencia QA por titulo/dispositivo.

## QA ejecutado

| Validacion | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | `SMOKE_BUILD_OK` |
| `npm run qa:pilot-feedback` | `QA_PILOT_FEEDBACK_OK` |
| `npm run qa:pilot-incidents` | `QA_PILOT_INCIDENTS_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |

## Impacto esperado

| Area | Impacto |
| --- | --- |
| Panel de piloto | Muestra feedback/incidentes reales sin QA. |
| Rating promedio | Calculado solo con feedback real. |
| Incidentes abiertos | No cuenta incidentes QA resueltos ni futuros QA. |
| Evidencia QA | Visible por separado para administradores. |
| QA automatizado | Sigue funcionando y puede ejecutarse varias veces. |

## Recomendacion

Mantener los registros QA como evidencia, no borrarlos. Durante el piloto, revisar diariamente la seccion real de feedback/incidentes y usar “Evidencia QA” solo para trazabilidad tecnica.
