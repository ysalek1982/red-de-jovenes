# Verificacion de idempotencia

Fecha: 2026-05-18

## Objetivo

Confirmar que los QA y datos base pueden ejecutarse repetidamente sin romper RLS, duplicar interacciones indebidas ni dejar basura critica.

## Comandos ejecutados

Dos rondas consecutivas:

```bash
npm run qa:prayer
npm run qa:forums
npm run qa:games
npm run qa:map
npm run qa:journeys
```

## Resultado ronda 1

| Script | Resultado |
| --- | --- |
| `npm run qa:prayer` | `QA_PRAYER_OK` |
| `npm run qa:forums` | `QA_FORUMS_OK` |
| `npm run qa:games` | `QA_GAMES_OK` |
| `npm run qa:map` | `QA_MAP_OK` |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` |

## Resultado ronda 2

| Script | Resultado |
| --- | --- |
| `npm run qa:prayer` | `QA_PRAYER_OK` |
| `npm run qa:forums` | `QA_FORUMS_OK` |
| `npm run qa:games` | `QA_GAMES_OK` |
| `npm run qa:map` | `QA_MAP_OK` |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` |

## Puntos validados

- `Estoy orando` no duplica soporte; duplicado queda denegado.
- Reaccion `Amen` no duplica; duplicado queda denegado.
- Progreso devocional se comporta de forma idempotente.
- Favoritos devocionales no duplican filas.
- Sugerencias y aprobaciones QA pueden repetirse con datos temporales.
- Puntajes se guardan dentro de rangos validos.
- Comunidades QA temporales se desactivan al limpiar.
- Scripts no usan `service_role`.

## Estado final

**IDEMPOTENCY_OK**
