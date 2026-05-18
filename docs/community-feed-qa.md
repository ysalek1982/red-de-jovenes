# QA Feed de comunidad

Fecha: 2026-05-17

## Estado

- Ruta protegida creada: `/app/comunidad`.
- Servicio actualizado: lectura de posts recientes, creacion y eliminacion propia.
- No se creo migracion incremental porque la tabla `posts` y RLS actual cubren el flujo.

## Comportamiento esperado

- Usuarios autenticados pueden leer posts.
- Usuarios autenticados pueden crear posts propios.
- Usuarios autenticados pueden eliminar solo sus propios posts.
- El post permite cuerpo, referencia biblica opcional y texto de versiculo opcional.

## UI validada

- Compositor de post.
- Tarjetas de posts recientes con autor y fecha.
- Bloque destacado para versiculo.
- Estados de carga, error y lista vacia.

## Bloqueos

- `BLOCKED_EMAIL_CONFIRMATION`: pendiente confirmar usuario QA o desactivar temporalmente confirmacion para validar el flujo desde navegador.
- `BLOCKED_AUTH_RATE_LIMIT`: Supabase limito nuevos registros durante la sesion nocturna.

## Seguridad

- No se usaron secretos ni llaves privadas.
- La eliminacion filtra por `user_id` y RLS protege la operacion en base de datos.
