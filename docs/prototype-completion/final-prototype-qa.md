# QA final contra prototipo

Fecha: 2026-05-19

## Resultados locales

| Validacion | Resultado | Observacion |
|---|---:|---|
| `npm run lint` | OK | Sin errores ESLint |
| `npm run build` | OK | Build Vite generado |
| `npm run smoke:build` | OK | `SMOKE_BUILD_OK` |
| `npm run qa:auth` | OK | `QA_AUTH_OK` |
| `npm run qa:rls` | OK | `QA_RLS_OK` |
| `npm run qa:functional` | OK | Incluye rutas nuevas: Biblia, Eventos, Discipulado, Mensajes y Construir |
| `npm run qa:prayer` | OK | `QA_PRAYER_OK` |
| `npm run qa:forums` | OK | `QA_FORUMS_OK` |
| `npm run qa:admin` | OK | `QA_ADMIN_OK` |
| `npm run qa:games` | OK | `QA_GAMES_OK` |
| `npm run qa:map` | OK | `QA_MAP_OK` |
| `npm run qa:journeys` | OK | `QA_JOURNEYS_OK` |
| `npm run qa:community` | OK | `QA_COMMUNITY_OK` |
| `npm run qa:bible` | OK | `QA_BIBLE_OK` |
| `npm run qa:events` | OK | `QA_EVENTS_OK` |
| `npm run qa:discipleship` | OK | `QA_DISCIPLESHIP_OK` |
| `npm run qa:messages` | OK | `QA_MESSAGES_OK` |
| `npm run qa:social` | OK | `QA_SOCIAL_OK` |
| `npm run qa:build-network` | OK | `QA_BUILD_NETWORK_OK` |
| `npm run qa:search` | OK | `QA_SEARCH_OK` |
| `npm run qa:notifications` | OK | `QA_NOTIFICATIONS_OK` |

## Hallazgos corregidos

- La creacion de conversaciones fallaba porque el flujo intentaba leer la conversacion antes de insertar miembros. Se corrigio generando `id` localmente, insertando conversacion sin `select`, creando miembros y luego leyendo.
- El QA de foros no era idempotente cuando el usuario ya tenia membresia en una comunidad. Se ajusto para reutilizar membresia existente.
- Los QA de oracion y comunidad tenian el mismo problema de idempotencia con `group_members`; se ajustaron para reutilizar membresias o manejar duplicado seguro.
- Se agregaron migraciones incrementales para relajar creacion de conversaciones y cerrar la insercion de miembros solo al creador.

## Pendientes reales

- Mensajes no son realtime; son mensajeria asincrona.
- Push real no esta implementado; existen notificaciones internas.
- Biblia completa por capitulos requiere integracion futura con API/licencia clara.
