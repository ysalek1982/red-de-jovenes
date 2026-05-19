# QA total final del ensayo general local

Fecha: 2026-05-18

| Modulo | QA | Resultado | Observacion | Pendiente |
| --- | --- | --- | --- | --- |
| Lint | `npm run lint` | OK | Sin errores ESLint | Ninguno |
| Build | `npm run build` | OK | Build Vite/TypeScript correcto | Ninguno |
| Build smoke | `npm run smoke:build` | `SMOKE_BUILD_OK` | Dist, manifest, SW, offline y secretos OK | Ninguno |
| Datos semilla | `npm run qa:seed` | `QA_SEED_DATA_OK` | Devocionales, comunidades y juegos OK | Curaduria humana |
| Auth | `npm run qa:auth` | `QA_AUTH_OK` | Usuarios QA A/B OK | Registro real en staging |
| RLS | `npm run qa:rls` | `QA_RLS_OK` | Escrituras ajenas denegadas | Ninguno |
| Rutas | `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` | Rutas publicas/privadas OK | Ninguno |
| Oracion | `npm run qa:prayer` | `QA_PRAYER_OK` | Soporte, respuesta, categoria, anonimato OK | Ninguno |
| Foros | `npm run qa:forums` | `QA_FORUMS_OK` | Post, comentario, reaccion, reporte OK | Ninguno |
| Admin | `npm run qa:admin` | `QA_ADMIN_OK` | Admin OK, no-admin bloqueado | Ninguno |
| Juegos | `npm run qa:games` | `QA_GAMES_OK` | Puntaje propio, bloqueo ajeno OK | Ninguno |
| Mapa | `npm run qa:map` | `QA_MAP_OK` | Filtros, sugerencias, aprobacion OK | Ninguno |
| Escenarios | `npm run qa:journeys` | `QA_JOURNEYS_OK` | Joven, participante, admin, seguridad OK | Recovery requiere staging |

## Dictamen QA

**FINAL_LOCAL_QA_OK**
