# QA local final de onboarding y activacion

Fecha: 2026-05-21

Dictamen: QA_LOCAL_ONBOARDING_OK

## Resultado

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run lint` | OK | Sin errores ESLint. |
| `npm run build` | OK | TypeScript y Vite compilan correctamente. |
| `npm run smoke:build` | SMOKE_BUILD_OK | Archivos requeridos presentes en `dist`. |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK | Incluye `/app/guia`. |
| `npm run qa:auth` | QA_AUTH_OK | Sesiones QA correctas. |
| `npm run qa:rls` | QA_RLS_OK | Acciones cruzadas bloqueadas. |
| `npm run qa:admin` | QA_ADMIN_OK | Admin y bloqueo no-admin correctos. |
| `npm run qa:bible-corpus` | QA_BIBLE_CORPUS_COMPLETE_OK | RVR1909 completa validada. |
| `npm run qa:journeys` | QA_JOURNEYS_OK | Flujos principales completos. |
| `npm run qa:community` | QA_COMMUNITY_OK | Comunidad y RLS correctos. |
| `npm run qa:forums` | QA_FORUMS_OK | Foros, comentarios y reportes correctos. |
| `npm run qa:prayer` | QA_PRAYER_OK | Oracion y privacidad correctas. |
| `npm run qa:games` | QA_GAMES_OK | Juegos y puntajes correctos. |
| `npm run qa:map` | QA_MAP_OK | Mapa, sugerencias y membresias correctas. |
| `npm run qa:pilot-feedback` | QA_PILOT_FEEDBACK_OK | Feedback propio/admin correcto. |
| `npm run qa:pilot-incidents` | QA_PILOT_INCIDENTS_OK | Incidentes admin y bloqueo no-admin correctos. |
| `npm run qa:mobile-scroll` | QA_MOBILE_SCROLL_OK | Validacion estatica local; staging usa URL real. |

## Observaciones

- No se tocaron Auth/RLS.
- No se tocaron Biblia corpus ni Gemini.
- No se agregaron migraciones.
- La ruta `/app/guia` queda cubierta por QA funcional.

## Pendiente

- Ejecutar QA staging con `QA_APP_BASE_URL=https://red-de-jovenes.vercel.app`.
