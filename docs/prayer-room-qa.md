# QA Sala de oracion

Fecha: 2026-05-17

## Estado

- Ruta protegida creada: `/app/oracion`.
- Servicio actualizado: lectura de peticiones publicas, creacion, marcado como respondida y eliminacion propia.
- No se creo migracion incremental porque la tabla y las politicas RLS existentes cubren el flujo.

## Comportamiento esperado

- Usuarios autenticados pueden leer peticiones con visibilidad publica.
- Usuarios autenticados pueden crear peticiones propias.
- Usuarios autenticados pueden marcar como respondidas solo sus propias peticiones.
- Usuarios autenticados pueden eliminar solo sus propias peticiones.

## UI validada

- Formulario con titulo y cuerpo.
- Listado de tarjetas con autor, fecha, estado y contenido.
- Estados visuales: `En oracion` y `Respondida`.
- Estados de carga, error y lista vacia.

## Bloqueos

- `BLOCKED_EMAIL_CONFIRMATION`: si no hay usuario QA confirmado, no se puede completar la prueba real desde navegador autenticado.
- `BLOCKED_AUTH_RATE_LIMIT`: Supabase limito nuevos registros por email durante la sesion nocturna.

## Seguridad

- No se usaron secretos ni llaves privadas.
- Las operaciones de modificacion filtran por `user_id` en frontend y tambien dependen de RLS en base de datos.
