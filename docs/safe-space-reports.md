# Espacio seguro y reportes

## Objetivo

Hacer visible y funcional la promesa de “Espacio seguro” dentro de la app,
manteniendo un tono pastoral, juvenil y no legalista.

## Cambios implementados

- Nueva ruta `/app/seguridad`.
- Reglas de comunidad con lenguaje claro y espiritual.
- Formulario para reportar contenido por tipo e identificador.
- Historial de reportes propios del usuario.
- Botones “Reportar” en:
  - posts de Foros con la Palabra
  - peticiones de Sala de oración global
- Nueva tabla `content_reports`.

## RLS

- Usuarios autenticados pueden crear reportes propios.
- Usuarios autenticados solo leen sus propios reportes.
- Administradores pueden leer y actualizar reportes.
- El cliente normal no usa service role ni permisos elevados.

## Migración

- `supabase/migrations/20260518060000_add_content_reports.sql`

## Validación

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos Supabase regenerados.
- `npm run lint`: OK.
- `npm run build`: OK, con warnings no bloqueantes de plugin timing y chunk grande.

## Pendientes

- Mejorar el flujo de reporte directo para no requerir ver/copiar ID cuando se
  reporte desde la página de seguridad.
- Conectar administración de reportes en el panel admin.
