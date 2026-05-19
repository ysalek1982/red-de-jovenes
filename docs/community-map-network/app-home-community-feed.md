# Inicio como pulso comunitario

Fecha: 2026-05-19

## Cambios aplicados

- El saludo de `/app` ahora presenta la Red como comunidad activa.
- Se agrego "Pulso de la comunidad" con eventos reales derivados de:
  - publicaciones recientes;
  - peticiones de oracion recientes;
  - devocional del dia;
  - ultimo juego propio;
  - comunidades propias.
- Se agrego "Comunidad destacada" usando grupos reales de Supabase.
- Se muestra CTA de perfil incompleto cuando faltan datos utiles para comunidad.
- Se conservan accesos rapidos a oracion, foros, devocional, juegos, mapa y perfil.

## Datos usados

Todos los datos vienen de Supabase:

- `posts`
- `prayer_requests`
- `devotionals`
- `game_scores`
- `groups`
- `group_members`
- `profiles`

## Estado vacio

Si no hay actividad, el home muestra una invitacion pastoral:

> Aun estamos empezando. Se de los primeros en compartir, orar o sugerir una comunidad.

## Observaciones

- No se agregaron metricas ficticias.
- Seguridad sigue fuera del menu visible.
- La actividad no es tiempo real; se refresca al cargar la pantalla.
