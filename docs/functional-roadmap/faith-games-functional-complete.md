# Juegos de fe con progreso

## Completado

- Versículo Rápido funcional.
- Trivia Bíblica funcional.
- Resultado final y repetir juego.
- Guardado de puntaje autenticado en `game_scores`.
- Historial personal de puntajes.
- RLS impide guardar puntaje para otro usuario.
- Script `qa:games`.

## Migración

- Tabla `game_scores` con validación de puntaje y RLS.

## QA

- `npm run qa:games`: `QA_GAMES_OK`.

## Pendiente

- Rankings comunitarios anónimos o por grupos, si se aprueba para fase futura.
