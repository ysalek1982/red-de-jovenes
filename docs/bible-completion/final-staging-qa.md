# QA staging final Biblia

Fecha: 2026-05-19

URL staging: https://red-de-jovenes.vercel.app/

Deployment Vercel:

- Alias principal: https://red-de-jovenes.vercel.app/
- Deployment: https://red-de-jovenes-57e0stc3f-ysaleks-projects.vercel.app
- Estado: Ready
- Id: `dpl_FgzoEaeXnw4zKQe63Wdgx7SseGzm`

| Validacion staging | Resultado | Observacion |
| --- | --- | --- |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK | `/app/biblia` y rutas principales responden 200. |
| `npm run qa:bible-random` | QA_BIBLE_RANDOM_OK | Versiculo aleatorio OK. |
| `npm run qa:bible-search` | QA_BIBLE_SEARCH_OK | Busqueda por referencia, palabra y libro OK. |
| `npm run qa:bible-reader` | QA_BIBLE_READER_OK | Lector por capitulo y RLS de progreso OK. |
| `npm run qa:bible-plans` | QA_BIBLE_PLANS_OK | 5 planes activos y progreso propio OK. |
| `npm run qa:bible-daily` | QA_BIBLE_DAILY_OK | Versiculo diario y fallback OK. |
| `npm run qa:bible-ai` | QA_BIBLE_AI_OK | Acciones IA biblicas OK en modo Gemini no configurado. |
| `npm run qa:admin-bible` | QA_ADMIN_BIBLE_OK | Admin Biblia OK y no-admin bloqueado. |
| `npm run qa:admin-bible-complete` | QA_ADMIN_BIBLE_COMPLETE_OK | Estadisticas, planes y diagnostico OK. |

Dictamen staging: `BIBLIA LISTA CON CORPUS PENDIENTE`.
