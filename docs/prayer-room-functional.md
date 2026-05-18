# Sala de oración global funcional

Fecha: 2026-05-18

## Cambios

- Se agregó tabla `prayer_supports`.
- Cada usuario autenticado puede marcar “Estoy orando” una sola vez por petición.
- El usuario puede quitar su apoyo de oración.
- La sala muestra contador de jóvenes orando por cada petición.
- Se agregaron filtros visuales:
  - Todas
  - En oración
  - Respondidas
- Se mantiene creación de petición, marcar propia como respondida y eliminar propia.

## Migración aplicada

```text
20260518020000_add_prayer_supports.sql
```

## RLS

- Lectura de apoyos de oración para usuarios autenticados.
- Inserción solo si `auth.uid() = user_id`.
- Eliminación solo del propio apoyo.
- La unicidad `(prayer_request_id, user_id)` evita duplicados.

## Validaciones

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos Supabase regenerados.
- `npm run lint`: OK.
- `npm run build`: OK.

## Pendiente QA dinámico

Validar con usuarios QA A/B cuando `.env.qa.local` tenga credenciales completas:

- Usuario A crea petición.
- Usuario B marca “Estoy orando”.
- Usuario B no puede editar la petición de A.
- Usuario A puede marcar respondida su propia petición.
