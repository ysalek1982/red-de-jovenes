# Metricas de activacion

Fecha: 2026-05-21

## Cambios en Admin

Se agrego una seccion compacta "Activacion inicial" dentro de Estado del piloto.

## Metricas reales

| Metrica | Fuente |
| --- | --- |
| Usuarios con perfil completo | `profiles` con nombre, ciudad, pais, iglesia, bio y avatar. |
| Primer versiculo guardado | Usuarios distintos en `bible_saved_verses`. |
| Primera oracion | Usuarios distintos en `prayer_requests` o `prayer_supports`. |
| Primera publicacion/comentario | Usuarios distintos en `posts` o `post_comments`. |
| Primer juego | Usuarios distintos en `game_scores`. |
| Unidos a comunidad | Usuarios distintos en `group_members`. |
| Feedback real enviado | Usuarios distintos en `pilot_feedback`, excluyendo evidencia QA. |

## Criterios

- No se usan datos ficticios.
- Si no hay datos, se muestra cero.
- No se agregaron tablas ni migraciones.
- La evidencia QA sigue aislada de las metricas reales.
