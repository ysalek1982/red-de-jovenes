# QA Devocional diario

Fecha: 2026-05-17

## Estado

- Ruta protegida creada: `/app/devocional`.
- Servicio actualizado con busqueda exacta del devocional del dia, fallback al ultimo disponible e historial breve.
- No se creo migracion incremental; la migracion inicial contiene un devocional seed suficiente para fallback.

## Comportamiento esperado

- Si existe devocional con fecha actual, se muestra como principal.
- Si no existe, se muestra el ultimo devocional disponible hasta la fecha actual.
- El historial muestra devocionales recientes disponibles para el usuario autenticado.

## UI validada

- Card principal con titulo, fecha, versiculo, referencia y reflexion.
- Historial breve en panel lateral.
- Estados de carga, error y vacio.

## Bloqueos

- `BLOCKED_EMAIL_CONFIRMATION`: pendiente validar navegacion real con usuario QA confirmado.
- `BLOCKED_AUTH_RATE_LIMIT`: Supabase limito nuevos registros durante la sesion nocturna.

## Seguridad

- La tabla `devotionals` solo permite lectura a usuarios autenticados segun RLS.
- No se agregaron escrituras de devocionales desde cliente.
