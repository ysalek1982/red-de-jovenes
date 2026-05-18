# Panel administrador inicial

## Objetivo

Pasar de un placeholder a un panel inicial útil para cuidado, contenido y
moderación de Red de Jóvenes, sin convertir la app en un dashboard genérico.

## Cambios implementados

- KPIs de usuarios, oraciones, publicaciones, devocionales, reportes y
  sugerencias.
- Listas recientes:
  - últimos usuarios
  - reportes
  - sugerencias de grupos
  - devocionales
  - posts
  - peticiones de oración
- Creación de devocionales desde `/app/admin`.
- Edición inicial de devocionales existentes desde la lista.
- Actualización de reportes a “reviewed”.
- Aprobación inicial de sugerencias de grupos.

## RLS

- Se agregaron políticas admin para crear, actualizar y eliminar devocionales.
- Se agregaron políticas admin para moderar peticiones y posts.
- Reportes y sugerencias usan `public.has_role('admin')`.
- La protección frontend sigue siendo complementaria, no reemplaza RLS.

## Migración

- `supabase/migrations/20260518070000_add_admin_moderation_policies.sql`

## Validación

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos Supabase regenerados.
- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.

## Pendientes

- CRUD completo por secciones dedicadas.
- Moderación con confirmaciones antes de eliminar contenido.
- Edición de devocional con carga completa de texto/reflexión desde detalle.
