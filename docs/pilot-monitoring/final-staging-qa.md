# QA staging final de monitoreo del piloto

## URL

- https://red-de-jovenes.vercel.app/

## Deploy

- Deployment Vercel: `https://red-de-jovenes-frp8ct0x0-ysaleks-projects.vercel.app`
- Alias principal: `https://red-de-jovenes.vercel.app`

## Resultado general

**QA staging OK** para iniciar piloto cerrado monitoreado.

| Validacion | Resultado |
|---|---:|
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:pilot-feedback` | `QA_PILOT_FEEDBACK_OK` |
| `npm run qa:pilot-incidents` | `QA_PILOT_INCIDENTS_OK` |
| `npm run qa:pilot-report` | `QA_PILOT_REPORT_OK` |
| `npm run qa:community` | `QA_COMMUNITY_OK` |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` |

## Observaciones

- Feedback piloto crea, lee propio y bloquea lectura cruzada.
- Incidentes piloto quedan restringidos a admin.
- Reporte de cierre genera resumen operativo con datos reales.
- Seguridad sigue fuera del menu visible; reportes y moderacion siguen activos.
