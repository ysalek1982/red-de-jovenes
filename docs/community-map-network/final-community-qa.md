# QA integral de comunidad

Fecha: 2026-05-19

## Resultado

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run lint` | OK | Sin errores ESLint. |
| `npm run build` | OK | Build Vite correcto. |
| `npm run smoke:build` | SMOKE_BUILD_OK | Build de produccion sin secretos detectados. |
| `npm run qa:auth` | QA_AUTH_OK | Usuarios QA y sesiones OK. |
| `npm run qa:rls` | QA_RLS_OK | Aislamiento de datos OK. |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK | Rutas locales OK. |
| `npm run qa:prayer` | QA_PRAYER_OK | Oracion con contexto comunitario OK. |
| `npm run qa:forums` | QA_FORUMS_OK | Foros con contexto comunitario OK. |
| `npm run qa:admin` | QA_ADMIN_OK | Admin, reportes y devocionales OK. |
| `npm run qa:games` | QA_GAMES_OK | Juegos sin regresion. |
| `npm run qa:map` | QA_MAP_OK | Mapa, sugerencias, membresias y filtros OK. |
| `npm run qa:journeys` | QA_JOURNEYS_OK | Escenarios end-to-end OK. |
| `npm run qa:community` | QA_COMMUNITY_OK | Red comunitaria y RLS especifico OK. |

## Cobertura nueva

- Usuario se une a comunidad.
- Usuario ve sus comunidades.
- Usuario publica post asociado a comunidad propia.
- Usuario crea peticion de oracion asociada a comunidad propia.
- Usuario no miembro no publica en comunidad ajena.
- Usuario no miembro no crea oracion en comunidad ajena.
- Reportes y administracion siguen funcionando.

## Pendiente humano

- Confirmar comportamiento visual y tactil en dispositivo movil real.
- Confirmar instalacion PWA real desde navegador movil.
