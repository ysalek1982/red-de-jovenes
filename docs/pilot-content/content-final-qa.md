# QA final de contenido inicial y escenarios

Fecha: 2026-05-18

| Modulo | Contenido base | QA | Resultado | Pendiente |
| --- | --- | --- | --- | --- |
| Lint | Codigo y docs | `npm run lint` | OK | Ninguno |
| Build | App Vite/React | `npm run build` | OK | Ninguno |
| Build smoke | Dist/PWA/secret scan | `npm run smoke:build` | `SMOKE_BUILD_OK` | Ninguno |
| Auth | Usuarios QA A/B | `npm run qa:auth` | `QA_AUTH_OK` | Probar registro real con emails de piloto |
| RLS | Escrituras propias/ajenas | `npm run qa:rls` | `QA_RLS_OK` | Ninguno |
| Rutas | Publicas y privadas | `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` | Ninguno |
| Oracion | Flujo comunitario | `npm run qa:prayer` | `QA_PRAYER_OK` | Curaduria pastoral en piloto |
| Foros | Post, comentario, reaccion | `npm run qa:forums` | `QA_FORUMS_OK` | Curaduria pastoral en piloto |
| Admin | Moderacion/devocional | `npm run qa:admin` | `QA_ADMIN_OK` | Politicas operativas de equipo |
| Juegos | Banco ampliado y puntaje | `npm run qa:games` | `QA_GAMES_OK` | Revisar preguntas con lideres |
| Mapa | Comunidades base y sugerencias | `npm run qa:map` | `QA_MAP_OK` | Confirmar comunidades reales |
| Escenarios | Joven, participante, admin, seguridad | `npm run qa:journeys` | `QA_JOURNEYS_OK` | Registro nuevo y recovery requieren email/staging |

## Hallazgo corregido

El escenario end-to-end detecto que el progreso devocional con `upsert` podia fallar cuando el registro ya existia. Se agrego la migracion:

- `20260518242000_allow_idempotent_devotional_progress.sql`

Resultado: `QA_JOURNEYS_OK`.

## Dictamen QA

**CONTENT_QA_OK**
