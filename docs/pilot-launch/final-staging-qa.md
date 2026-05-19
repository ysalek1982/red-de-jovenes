# QA final staging de piloto

## URL

- https://red-de-jovenes.vercel.app/

## Resultado general

**QA staging OK** para iniciar piloto cerrado.

| Validacion | Resultado |
|---|---:|
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:admin-bible` | `QA_ADMIN_BIBLE_OK` |
| `npm run qa:bible-random` | `QA_BIBLE_RANDOM_OK` |
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
| `npm run qa:search` | `QA_SEARCH_OK` |
| `npm run qa:notifications` | `QA_NOTIFICATIONS_OK` |

## Observaciones

- `qa:admin-bible` se reintento tras una respuesta transitoria de Edge Function y quedo OK.
- `qa:forums` fue ajustado para manejar membresias existentes sin `upsert`, evitando falso fallo de RLS al ejecutarse en paralelo con QA de comunidad.
- `qa:ai-real` queda en `SKIPPED` hasta que un admin configure Gemini real.
