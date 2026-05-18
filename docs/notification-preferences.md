# Preferencias de notificaciones

## Objetivo

Preparar la base de recordatorios sin implementar push real ni introducir llaves
externas.

## Cambios implementados

- Nueva tabla `notification_preferences`.
- Preferencias disponibles:
  - devocional diario
  - actualizaciones de oración
  - actualizaciones de comunidad
- UI integrada en `/app/perfil`.
- Guardado con `upsert` por usuario.

## RLS

- Cada usuario puede leer, crear y actualizar únicamente sus preferencias.
- No hay service role ni permisos elevados en frontend.

## Migración

- `supabase/migrations/20260518080000_add_notification_preferences.sql`

## Pendientes

- Implementar push real en fase futura con VAPID, Edge Functions y permisos
  explícitos del navegador.
- Diseñar recordatorios pastorales no invasivos.

## Validación

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos Supabase regenerados.
- `npm run lint`: OK.
- `npm run build`: OK, con warnings no bloqueantes de plugin timing y chunk grande.
