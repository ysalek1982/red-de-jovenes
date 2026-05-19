# QA local final Biblia

Fecha: 2026-05-19

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run lint` | OK | ESLint sin errores. |
| `npm run build` | OK | TypeScript y Vite build correctos. |
| `npm run smoke:build` | SMOKE_BUILD_OK | `dist` contiene HTML, manifest, SW, offline y assets. |
| `npm run qa:bible` | QA_BIBLE_OK | Modulo Biblia base OK. |
| `npm run qa:bible-db` | QA_BIBLE_DB_OK | 2 traducciones, 66 libros, versiculo aleatorio y capitulo OK. |
| `npm run qa:bible-random` | QA_BIBLE_RANDOM_OK | Versiculos aleatorios OK. |
| `npm run qa:bible-importer` | QA_BIBLE_IMPORT_GOVERNANCE_OK | JSON, CSV, licencia, confirmacion y upsert OK. |
| `npm run qa:bible-search` | QA_BIBLE_SEARCH_OK | Referencia, palabra y filtro por libro OK. |
| `npm run qa:bible-reader` | QA_BIBLE_READER_OK | Capitulo existente, empty state y progreso propio OK. |
| `npm run qa:bible-plans` | QA_BIBLE_PLANS_OK | 5 planes activos y RLS de progreso OK. |
| `npm run qa:bible-daily` | QA_BIBLE_DAILY_OK | Programado/fallback OK. |
| `npm run qa:bible-ai` | QA_BIBLE_AI_OK | 5 acciones IA biblicas permitidas; Gemini no configurado responde de forma gobernada. |
| `npm run qa:admin-bible` | QA_ADMIN_BIBLE_OK | Admin OK, no-admin denegado. |
| `npm run qa:admin-bible-complete` | QA_ADMIN_BIBLE_COMPLETE_OK | Estadisticas, planes y diagnostico OK. |
| `npm run qa:auth` | QA_AUTH_OK | Auth sigue OK. |
| `npm run qa:rls` | QA_RLS_OK | RLS sigue OK. |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK | Rutas locales OK. |
| `npm run qa:admin` | QA_ADMIN_OK | Admin general OK. |
| `npm run qa:ai-settings` | QA_AI_SETTINGS_OK | Key no expuesta. |
| `npm run qa:ai-actions` | QA_AI_ACTIONS_OK | Acciones IA basicas OK. |
| `npm run qa:ai-limits` | QA_AI_USAGE_LIMITS_OK | Limites diarios OK. |
| `npm run qa:ai-prompts` | QA_AI_PROMPTS_OK | Plantillas activas OK. |
| `npm run qa:ai-real` | QA_AI_REAL_PROVIDER_SKIPPED | Gemini real no configurado. |
| `npm run qa:community` | QA_COMMUNITY_OK | Comunidad sigue OK. |
| `npm run qa:journeys` | QA_JOURNEYS_OK | Flujos principales OK. |

Dictamen local: `BIBLIA LISTA CON CORPUS PENDIENTE`.
