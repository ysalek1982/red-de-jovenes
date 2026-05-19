# QA local final de monitoreo del piloto

## Resultado general

**QA local OK** para monitoreo del piloto cerrado.

## Validaciones ejecutadas

| Validacion | Resultado |
|---|---:|
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | `SMOKE_BUILD_OK` |
| `npm run qa:auth` | `QA_AUTH_OK` |
| `npm run qa:rls` | `QA_RLS_OK` |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:community` | `QA_COMMUNITY_OK` |
| `npm run qa:forums` | `QA_FORUMS_OK` |
| `npm run qa:prayer` | `QA_PRAYER_OK` |
| `npm run qa:games` | `QA_GAMES_OK` |
| `npm run qa:map` | `QA_MAP_OK` |
| `npm run qa:events` | `QA_EVENTS_OK` |
| `npm run qa:discipleship` | `QA_DISCIPLESHIP_OK` |
| `npm run qa:messages` | `QA_MESSAGES_OK` |
| `npm run qa:social` | `QA_SOCIAL_OK` |
| `npm run qa:build-network` | `QA_BUILD_NETWORK_OK` |
| `npm run qa:search` | `QA_SEARCH_OK` |
| `npm run qa:notifications` | `QA_NOTIFICATIONS_OK` |
| `npm run qa:bible` | `QA_BIBLE_OK` |
| `npm run qa:bible-db` | `QA_BIBLE_DB_OK` |
| `npm run qa:bible-random` | `QA_BIBLE_RANDOM_OK` |
| `npm run qa:admin-bible` | `QA_ADMIN_BIBLE_OK` |
| `npm run qa:ai-settings` | `QA_AI_SETTINGS_OK` |
| `npm run qa:ai-actions` | `QA_AI_ACTIONS_OK` |
| `npm run qa:ai-limits` | `QA_AI_USAGE_LIMITS_OK` |
| `npm run qa:ai-prompts` | `QA_AI_PROMPTS_OK` |
| `npm run qa:ai-real` | `QA_AI_REAL_PROVIDER_SKIPPED` |
| `npm run qa:ai-approval` | `QA_AI_HUMAN_APPROVAL_OK` |
| `npm run qa:pilot-feedback` | `QA_PILOT_FEEDBACK_OK` |
| `npm run qa:pilot-incidents` | `QA_PILOT_INCIDENTS_OK` |
| `npm run qa:pilot-report` | `QA_PILOT_REPORT_OK` |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` |

## Observaciones

- `QA_AI_REAL_PROVIDER_SKIPPED` es esperado mientras Gemini no tenga key real configurada por admin.
- Feedback e incidentes validan RLS: usuario normal no accede a datos ajenos ni a bitacora admin.
- El reporte de cierre genera Markdown operativo con datos reales disponibles.
