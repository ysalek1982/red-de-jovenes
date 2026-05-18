# Mapa mundial funcional

## Objetivo

Conectar la vista de mapa mundial a datos reales de Supabase y preparar el flujo
de sugerencias de comunidades sin convertir la app en portal institucional.

## Cambios implementados

- `groups` ahora incluye:
  - `contact_url`
  - `meeting_info`
  - `is_active`
  - `latitude`
  - `longitude`
- Nueva tabla `group_suggestions` para que usuarios sugieran comunidades.
- `/app/mapa` carga grupos activos desde Supabase.
- Se agregaron filtros por país y búsqueda por ciudad, iglesia o descripción.
- Se agregó formulario “Sugerir comunidad”.
- Se mantiene mapa visual simulado alineado al estilo Lovable/PWA.

## RLS

- Usuarios autenticados leen solo grupos activos.
- Usuarios autenticados pueden crear sus propias sugerencias.
- Usuarios autenticados pueden leer sus propias sugerencias.
- Administradores pueden leer y actualizar sugerencias.

## Migración

- `supabase/migrations/20260518050000_enhance_groups_suggestions.sql`

## Validación

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos remotos regenerados.
- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.

## Pendientes

- Integrar mapa real con coordenadas cuando haya datos verificados.
- Crear moderación/admin de sugerencias en el panel administrativo.
