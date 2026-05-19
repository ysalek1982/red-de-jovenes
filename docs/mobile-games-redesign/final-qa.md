# QA final de juegos y menu movil

Fecha: 2026-05-19

## Resultado

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run lint` | OK | Sin errores ESLint. |
| `npm run build` | OK | Build Vite generado correctamente. |
| `npm run smoke:build` | SMOKE_BUILD_OK | Dist contiene archivos PWA requeridos. |
| `npm run qa:auth` | QA_AUTH_OK | Login y sesiones QA OK. |
| `npm run qa:rls` | QA_RLS_OK | RLS mantiene aislamiento de datos. |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK | Rutas publicas y privadas responden OK. |
| `npm run qa:prayer` | QA_PRAYER_OK | Oracion y soporte sin regresiones. |
| `npm run qa:forums` | QA_FORUMS_OK | Foros, comentarios, reacciones y reportes OK. |
| `npm run qa:admin` | QA_ADMIN_OK | Admin y bloqueo no admin OK. |
| `npm run qa:games` | QA_GAMES_OK | Los cinco juegos guardan puntaje y validan RLS. |
| `npm run qa:map` | QA_MAP_OK | Mapa y sugerencias OK. |
| `npm run qa:journeys` | QA_JOURNEYS_OK | Escenarios de usuario completos OK. |

## Observaciones

- `/app/seguridad` sigue respondiendo como ruta secundaria oculta, pero ya no esta en navegacion ni en el home.
- La capacidad de reportar contenido se conserva en foros, comentarios y oracion.
- La moderacion de reportes se conserva en admin.
- Se intento abrir el navegador embebido para una revision visual rapida, pero el plugin local no tenia `scripts/browser-client.mjs` disponible. La verificacion funcional se cubrio con build y QA automatizado.
