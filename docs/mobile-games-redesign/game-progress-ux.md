# Progreso y recompensas de juegos

Fecha: 2026-05-19

## Cambios en `/app/juegos`

La pantalla de juegos muestra progreso propio real:

- puntos totales guardados;
- partidas jugadas;
- mejor puntaje por juego;
- ultimo resultado al terminar una partida;
- estado vacio cuando no hay partidas.

No se usa leaderboard global ficticio.

## Cambios en `/app`

Se agrego la tarjeta `Tu progreso de fe` con datos reales del usuario:

- devocionales leidos desde `devotional_reads`;
- juegos completados desde `game_scores`;
- puntos de juegos desde `game_scores`;
- oraciones apoyadas desde `prayer_supports`;
- ultimo juego jugado si existe.

## Implementacion

Nuevo servicio:

- `src/features/progress/progressService.ts`

El servicio usa solo el cliente Supabase normal con publishable key y respeta RLS. No usa service role ni secretos.

## Criterio de honestidad

Si no hay datos, la interfaz invita a completar la primera accion. No muestra numeros inventados ni ranking simulado.
