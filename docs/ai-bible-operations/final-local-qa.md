# QA local final - Operacion Biblia IA

## Resultado

| Validacion | Resultado | Observacion |
|---|---:|---|
| `npm run lint` | OK | Sin errores ESLint. |
| `npm run build` | OK | Build Vite generado. |
| `npm run smoke:build` | `SMOKE_BUILD_OK` | `dist` contiene archivos requeridos y no expone secretos. |
| `npm run qa:auth` | `QA_AUTH_OK` | Usuarios QA A/B operativos. |
| `npm run qa:rls` | `QA_RLS_OK` | RLS mantiene aislamiento. |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` | Rutas principales responden. |
| `npm run qa:admin` | `QA_ADMIN_OK` | Admin opera y no-admin queda bloqueado. |
| `npm run qa:bible` | `QA_BIBLE_OK` | Modulo Biblia existente sigue operativo. |
| `npm run qa:bible-db` | `QA_BIBLE_DB_OK` | Traduccion, libros, RPC y capitulo OK. |
| `npm run qa:bible-random` | `QA_BIBLE_RANDOM_OK` | Versiculo aleatorio OK. |
| `npm run qa:bible-importer` | `QA_BIBLE_IMPORT_GOVERNANCE_OK` | Dry-run OK y metadata incompleta bloqueada. |
| `npm run qa:admin-bible` | `QA_ADMIN_BIBLE_OK` | Panel Biblia via Edge Function OK. |
| `npm run qa:ai-settings` | `QA_AI_SETTINGS_OK` | Key no expuesta, no-admin denegado. |
| `npm run qa:ai-actions` | `QA_AI_ACTIONS_OK` | Acciones permitidas/controladas; invalida denegada. |
| `npm run qa:ai-limits` | `QA_AI_USAGE_LIMITS_OK` | Limite diario bloquea segunda solicitud. |
| `npm run qa:ai-prompts` | `QA_AI_PROMPTS_OK` | 9 plantillas activas y no-admin denegado. |
| `npm run qa:ai-real` | `QA_AI_REAL_PROVIDER_SKIPPED` | Gemini real no configurado aun. |
| `npm run qa:ai-approval` | `QA_AI_HUMAN_APPROVAL_OK` | Cola aprobada/ejecutada por admin. |
| `npm run qa:community` | `QA_COMMUNITY_OK` | Comunidad y reportes siguen OK. |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` | Recorridos principales OK. |

## Observacion

La prueba real de Gemini queda en `SKIPPED` hasta que un administrador cargue una API key real desde el panel.
