# Cierre Fase 26 - Juegos y menu movil

Fecha: 2026-05-19

## Dictamen

LISTO PARA PILOTO CON JUEGOS Y MENU MOVIL MEJORADO.

## Juegos completados

| Juego | Estado final |
| --- | --- |
| Versiculo Rapido | Jugable, con puntaje, resultado e historial. |
| Trivia Biblica | Jugable, con banco de 15 preguntas, puntaje e historial. |
| Adivina la Historia | Jugable, con pistas, opciones, feedback y referencia biblica. |
| Memory Match | Jugable, con cartas, pares, intentos, resultado y guardado. |
| Desafio de Fe | Jugable como modo individual, sin prometer multijugador. |

## Seguridad

Seguridad dejo de ser modulo visible para jovenes:

- no aparece en bottom nav;
- no aparece en menu `Mas`;
- no aparece como tarjeta del home;
- no aparece como acceso rapido.

Se mantiene internamente:

- ruta secundaria `/app/seguridad`;
- botones de reportar en contenidos;
- `content_reports`;
- `safetyService`;
- reportes y moderacion en admin.

## Menu movil nuevo

Bottom nav movil:

- Inicio
- Oracion
- Foros
- Juegos
- Mapa
- Mas

Menu `Mas`:

- Devocional
- Perfil
- Administracion, solo admin
- Cerrar sesion

## Home privado

`/app` queda reorganizado con:

- accesos principales sin Seguridad;
- primeros pasos;
- progreso real de fe;
- devocional del dia;
- ultimas oraciones;
- foros recientes.

## Progreso y gamificacion

Se agrego progreso real desde Supabase:

- devocionales leidos;
- juegos completados;
- puntos de juegos;
- oraciones apoyadas;
- ultimo juego jugado.

No se agrego leaderboard global ficticio.

## Migraciones aplicadas

- `20260519010000_expand_game_score_keys.sql`

La migracion fue aplicada con:

- `npx supabase db push --dry-run`
- `npx supabase db push`
- `npx supabase gen types typescript --project-id ntlzlfbztryasbmjnynq --schema public > src/types/supabase.generated.ts`

## QA ejecutado

| Validacion | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | SMOKE_BUILD_OK |
| `npm run qa:auth` | QA_AUTH_OK |
| `npm run qa:rls` | QA_RLS_OK |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK |
| `npm run qa:prayer` | QA_PRAYER_OK |
| `npm run qa:forums` | QA_FORUMS_OK |
| `npm run qa:admin` | QA_ADMIN_OK |
| `npm run qa:games` | QA_GAMES_OK |
| `npm run qa:map` | QA_MAP_OK |
| `npm run qa:journeys` | QA_JOURNEYS_OK |

## Pendientes reales

- Probar visualmente el nuevo bottom nav en dispositivo movil fisico.
- Si se desea multijugador real para Batallas de Fe, planificarlo como fase futura con backend especifico.
- Mantener `/app/seguridad` como ruta secundaria o decidir redireccionarla despues del piloto.

## Recomendacion

Pasar a revision visual en dispositivo real y luego desplegar los cambios a staging para que los usuarios piloto prueben el nuevo menu y los cinco juegos.
