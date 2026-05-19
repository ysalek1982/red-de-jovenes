# Sala de oracion comunitaria

Fecha: 2026-05-19

## Cambios aplicados

- Las peticiones pueden publicarse en la sala general o asociarse a una comunidad propia.
- El formulario muestra selector de comunidad cuando el usuario pertenece a grupos.
- Las tarjetas muestran badge de comunidad cuando aplica.
- Se agrego filtro "Mi comunidad".
- Se mejoraron mensajes de feedback para sostener tono pastoral.

## Seguridad

- La migracion `20260519113000_add_prayer_group_context.sql` agrega `prayer_requests.group_id`.
- La migracion `20260519113100_tighten_prayer_group_policy.sql` reemplaza la politica permisiva antigua de insercion.
- RLS permite crear peticiones en comunidad solo si el usuario es miembro activo.
- Usuario no miembro no puede crear peticiones en comunidad ajena.
- Usuario no puede marcar como respondida una peticion ajena.

## QA

`npm run qa:prayer` valida:

- crear peticion con comunidad;
- apoyo de oracion;
- no duplicar apoyo;
- marcar propia como respondida;
- bloquear actualizacion ajena;
- bloquear peticion en comunidad ajena;
- lectura con relacion de comunidad.

## Observaciones

- No se implemento chat ni oracion en tiempo real.
- La relacion con comunidad es opcional para conservar la sala global.
