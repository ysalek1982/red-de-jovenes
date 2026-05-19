# QA final local de piloto

## Resultado general

**QA local OK** para activar piloto cerrado.

| Validacion | Resultado |
|---|---:|
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | `SMOKE_BUILD_OK` |
| `npm run qa:auth` | `QA_AUTH_OK` |
| `npm run qa:rls` | `QA_RLS_OK` |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:admin-bible` | `QA_ADMIN_BIBLE_OK` |
| `npm run qa:bible` | `QA_BIBLE_OK` |
| `npm run qa:bible-db` | `QA_BIBLE_DB_OK` |
| `npm run qa:bible-random` | `QA_BIBLE_RANDOM_OK` |
| `npm run qa:bible-importer` | `QA_BIBLE_IMPORT_GOVERNANCE_OK` |
| `npm run qa:ai-settings` | `QA_AI_SETTINGS_OK` |
| `npm run qa:ai-actions` | `QA_AI_ACTIONS_OK` |
| `npm run qa:ai-limits` | `QA_AI_USAGE_LIMITS_OK` |
| `npm run qa:ai-prompts` | `QA_AI_PROMPTS_OK` |
| `npm run qa:ai-real` | `QA_AI_REAL_PROVIDER_SKIPPED` |
| `npm run qa:ai-approval` | `QA_AI_HUMAN_APPROVAL_OK` |
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
| `npm run qa:journeys` | `QA_JOURNEYS_OK` |

## Ajustes realizados durante QA

- `qa:forums` quedo idempotente para membresias de grupo existentes.
- `qa:ai-approval` limpia uso IA diario de la accion antes de probar aprobacion humana, evitando falsos fallos por limites acumulados de QA.

## Observaciones

- Gemini real no esta configurado; el estado correcto es `QA_AI_REAL_PROVIDER_SKIPPED`.
- Las pruebas humanas de PWA fisica y recovery real siguen pendientes.
